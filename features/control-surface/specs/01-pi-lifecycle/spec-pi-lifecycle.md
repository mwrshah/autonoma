# Spec: Pi Lifecycle — State Machine, Session Linkage, Orchestrator Self-Close

## Problem

Pi has six defined states (`active`, `idle`, `waiting_for_user`, `waiting_for_sessions`, `ended`, `crashed`) but only four are ever set. `waiting_for_sessions` and `waiting_for_user` are never used. The runtime has no mechanism to:
- Track which CC sessions belong to which Pi instance
- Automatically transition Pi states based on session lifecycle events
- Allow orchestrators to close themselves when the user confirms work is done
- Give the router awareness of recently closed workstreams

Pi currently manages no state — it processes turns and goes idle. The linkage between Pi launching CC sessions and those sessions reporting back via hooks is implicit (all managed sessions go to the single Pi) rather than explicit. This breaks in a multi-Pi future and leaves v1 without meaningful observability.

## Approach

1. **Runtime-managed state machine** — Pi never sets its own state. The runtime transitions Pi states based on turn lifecycle and CC session events.
2. **Explicit Pi→session linkage** — CC sessions record which Pi instance launched them via a new `pi_session_id` column + passthrough from launch to hook.
3. **Orchestrator self-close** — a `close_workstream` tool that orchestrators call only when the human confirms done. Cleans up worktree, soft-closes workstream, ends the Pi session.
4. **Router recent history** — workstreams are soft-deleted with `closed_at` timestamp. Router sees closed workstreams from the last 6 hours for context continuity.

## Design Decisions

### State simplification

`idle` is removed as a distinct concept. If Pi isn't active and isn't waiting for sessions, it's waiting for the user. The user is always the next actor unless CC sessions are running. This applies to both default Pi (at startup, between tasks) and orchestrators (workstream open, ball in user's court).

### Pi state machine

| State | Meaning | Transition in | Transition out |
|-------|---------|---------------|----------------|
| `active` | Processing a turn | Turn starts (message/hook queued) | Turn ends |
| `waiting_for_sessions` | Has active managed CC sessions | Turn ends + active managed sessions exist | Last managed session ends → `active` (to process the hook) |
| `waiting_for_user` | No pending work, user is next actor | Turn ends + no active managed sessions | Turn starts → `active` |
| `ended` | Intentionally closed | Orchestrator self-close, or shutdown | Terminal |
| `crashed` | Abnormal termination | Runtime detects failure | Terminal |

State transitions (all managed by runtime, never by Pi):

```
startup → waiting_for_user

user message / hook arrives → active
  Pi turn ends:
    managed sessions exist? → waiting_for_sessions
    no managed sessions?    → waiting_for_user

managed session Stop/End hook fires:
  other managed sessions still active? → stay waiting_for_sessions
  last managed session done?           → active (Pi processes the hook)
    Pi turn ends → waiting_for_user

orchestrator calls close_workstream() → ended
```

### Orchestrator self-close

Orchestrators have a `close_workstream()` tool with a hard instruction: **only call when the human explicitly confirms the work is done.** The tool:
1. Cleans up the git worktree (if exists)
2. Soft-closes the workstream row (`status='closed'`, `closed_at=now()`)
3. Ends the orchestrator's Pi session (`status='ended'`)

After close, the router no longer matches messages to this workstream's orchestrator. Next message about the topic either hits the default Pi or triggers a new workstream.

### Router recent history

The router's classification prompt includes:
- Open workstreams (current behavior)
- Recently closed workstreams (last 6 hours) with a `[closed]` label

This prevents duplicate workstream creation for topics just completed and allows the user to reference recent work naturally. The router can return a `reopen` action if it matches a closed workstream, which the runtime handles by spinning up a fresh orchestrator.

---

## Functional Requirements

### FR-1: Pi→session linkage via `pi_session_id`

**Schema change** — add column to `sessions` table:
```sql
ALTER TABLE sessions ADD COLUMN pi_session_id TEXT REFERENCES pi_sessions(pi_session_id) ON DELETE SET NULL;
CREATE INDEX idx_sessions_pi_session ON sessions(pi_session_id);
```

**Launch passthrough** — update `launchClaudeSession()` in `src/claude-sessions/launch-session.ts`:
- Accept new parameter: `piSessionId: string`
- Add env var: `AUTONOMA_PI_SESSION_ID=<piSessionId>`

**Hook enrichment** — update `.autonoma/hooks/hook-post.mjs`:
- Read `AUTONOMA_PI_SESSION_ID` from environment
- Include in enriched payload

**Session insert** — update `insertSession()` in `src/blackboard/queries/sessions.ts`:
- Accept and store `pi_session_id`

**Query helpers** — add to `src/blackboard/queries/sessions.ts`:
- `getActiveManagedSessionsByPi(piSessionId: string)` — returns sessions where `pi_session_id = ? AND status IN ('working', 'idle') AND agent_managed = 1`
- `countActiveManagedSessionsByPi(piSessionId: string)` — returns count

### FR-2: Workstream ID passthrough at launch

**Launch passthrough** — update `launchClaudeSession()`:
- Accept new parameter: `workstreamId: string`
- Add env var: `AUTONOMA_WORKSTREAM_ID=<workstreamId>`

**Hook enrichment** — read `AUTONOMA_WORKSTREAM_ID`, include in payload.

**Session insert** — populate `sessions.workstream_id` from the hook payload. This column already exists but is never written.

### FR-3: Runtime-managed Pi state transitions

**Turn lifecycle** — in `src/control-surface/runtime.ts`, around `processQueueItem()`:

- **Turn starts**: set Pi status to `active`
- **Turn ends**: 
  - Call `countActiveManagedSessionsByPi(piSessionId)`
  - If count > 0 → set status to `waiting_for_sessions`
  - If count == 0 → set status to `waiting_for_user`

**Hook-triggered transitions** — when a Stop or SessionEnd hook fires:
- After `updateSessionStop()` / `markSessionEnded()`:
  - Look up `pi_session_id` from the session record
  - Call `countActiveManagedSessionsByPi(piSessionId)`
  - If count == 0 AND Pi is in `waiting_for_sessions`:
    - The Stop hook is already queued to Pi → Pi will go `active` when it processes it
    - After Pi's turn ends processing the hook → `waiting_for_user` (per turn-end logic above)

**Remove `idle` state** — update `PiSessionStatus` enum in `src/contracts/blackboard.ts`:
- Remove `idle` from the enum
- Update schema CHECK constraint
- Migrate any existing `idle` rows to `waiting_for_user`

**Files**:
- `src/control-surface/runtime.ts` — state transition logic around turn processing
- `src/blackboard/queries/pi-sessions.ts` — `updatePiSessionStatus(piSessionId, status)` (may already exist)
- `src/contracts/blackboard.ts` — update `PiSessionStatus` enum
- `src/blackboard/schema.sql` — update CHECK constraint
- `src/blackboard/migrate.ts` — migration V5

### FR-4: `close_workstream` tool for orchestrators

**New tool** — `src/control-surface/tools/close-workstream.ts`:

```typescript
{
  name: "close_workstream",
  description: "Close the current workstream. Only call when the human explicitly confirms the work is done. Cleans up the git worktree, closes the workstream, and ends this orchestrator session.",
  parameters: {
    workstream_id: { type: "string", description: "ID of the workstream to close" }
  }
}
```

**Implementation**:
1. Look up workstream row, verify it exists and is open
2. If `worktree_path` is set and exists on disk: `git worktree remove <path>` 
3. Update workstream: `SET status = 'closed', closed_at = datetime('now')`
4. Update Pi session: `SET status = 'ended', ended_at = datetime('now'), end_reason = 'workstream_closed'`
5. Return confirmation message

**Tool registration** — only register for orchestrator Pi instances (not the default agent). Check `role` parameter when creating the agent.

**System prompt instruction** — add to orchestrator prompt:
> You have a `close_workstream` tool. ONLY call it when the human explicitly says the work is done (e.g., "looks good", "ship it", "we're done here"). Never call it autonomously.

### FR-5: Workstream soft-delete + router recent history

**Schema change** — add columns to `workstreams` table:
```sql
ALTER TABLE workstreams ADD COLUMN status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'closed'));
ALTER TABLE workstreams ADD COLUMN closed_at TEXT;
```

**Query helpers** — add to `src/blackboard/queries/workstreams.ts`:
- `closeWorkstream(workstreamId: string)` — sets `status='closed'`, `closed_at=now()`
- `listRecentlyClosedWorkstreams(withinHours: number)` — returns workstreams where `status='closed' AND closed_at > datetime('now', '-' || hours || ' hours')`
- Update `listOpenWorkstreams()` — filter `WHERE status = 'open'` (if not already)

**Router prompt update** — in `src/control-surface/router/classify.ts`:
- Query both open and recently closed (6h) workstreams
- Format closed workstreams with `[closed]` label in the prompt
- Add a fourth classification outcome: `reopen` — matches a closed workstream that should be reopened
- On `reopen`: runtime sets workstream `status='open'`, `closed_at=NULL`, spawns new orchestrator

### FR-6: Remove `idle` from state glossary and overview

**Update `features/overview.md`**:
- State glossary: remove `idle`, update `waiting_for_user` description to cover the idle case
- Note that state transitions are runtime-managed, not Pi-managed

**Update Pi system prompt** — remove any references to idle state.

---

## Acceptance Criteria

1. When Pi launches a CC session, the `sessions` row has `pi_session_id` and `workstream_id` populated
2. After Pi's turn ends with active managed sessions, `pi_sessions.status = 'waiting_for_sessions'`
3. After Pi's turn ends with no active managed sessions, `pi_sessions.status = 'waiting_for_user'`
4. When the last managed CC session ends, Pi is notified (Stop hook) and transitions through `active` → `waiting_for_user`
5. `close_workstream` tool exists, is only registered for orchestrator role
6. Calling `close_workstream` removes worktree, soft-closes workstream, ends Pi session
7. Router prompt includes recently closed workstreams (6h window)
8. `idle` state no longer exists in the codebase
9. All state transitions are performed by the runtime — Pi never calls a "set my status" function
10. Schema migration V5 handles all column additions and `idle` → `waiting_for_user` migration

## Files Likely Touched

### Schema & Blackboard
- `src/blackboard/schema.sql` — workstreams status/closed_at columns, sessions pi_session_id column, pi_sessions CHECK constraint update
- `src/contracts/blackboard-schema.sql` — mirror changes
- `src/blackboard/migrate.ts` — V5 migration
- `src/contracts/blackboard.ts` — update `PiSessionStatus` enum (remove `idle`)
- `src/blackboard/queries/sessions.ts` — `insertSession` update, new query helpers
- `src/blackboard/queries/workstreams.ts` — `closeWorkstream`, `listRecentlyClosedWorkstreams`
- `src/blackboard/queries/pi-sessions.ts` — `updatePiSessionStatus`

### Launch & Hooks
- `src/claude-sessions/launch-session.ts` — accept `piSessionId`, `workstreamId` params, add env vars
- `.autonoma/hooks/hook-post.mjs` — read `AUTONOMA_PI_SESSION_ID`, `AUTONOMA_WORKSTREAM_ID`

### Runtime
- `src/control-surface/runtime.ts` — state transition logic in `processQueueItem()`, hook handler updates
- `src/control-surface/tools/close-workstream.ts` — new file
- `src/control-surface/pi/create-agent.ts` — register `close_workstream` tool for orchestrator role

### Router
- `src/control-surface/router/classify.ts` — include closed workstreams in prompt, handle `reopen` action

### Docs
- `features/overview.md` — update state glossary (with user permission)
