# Spec: Blackboard (SQLite State Layer)

SQLite database at `~/.autonoma/blackboard.db` fed by Claude Code hook scripts, the WhatsApp daemon, and the control surface. Real-time queryable state for the orchestrator, cron scheduler, and web app.

## Functional Requirements

### FR-1: Database Initialization

Create `~/.autonoma/blackboard.db` with WAL mode on first run. Init script at `~/.autonoma/scripts/init-db.sh`, idempotent via `IF NOT EXISTS` and schema-versioned via a migrations table.

**Schema** (consequential interface — defines the shared data contract for hooks, control surface, WhatsApp, cron, and web app):

```sql
PRAGMA journal_mode=WAL;

CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at DATETIME NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    launch_id TEXT,
    tmux_session TEXT,
    cwd TEXT NOT NULL,
    project TEXT NOT NULL,
    project_label TEXT,
    model TEXT,
    permission_mode TEXT,
    source TEXT,
    status TEXT NOT NULL DEFAULT 'working'
      CHECK (status IN ('working', 'idle', 'stale', 'ended')),
    transcript_path TEXT,
    task_description TEXT,
    todoist_task_id TEXT,
    agent_managed BOOLEAN DEFAULT 0,
    session_end_reason TEXT,
    started_at DATETIME NOT NULL,
    ended_at DATETIME,
    last_event_at DATETIME NOT NULL,
    last_tool_started_at DATETIME
);

CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL REFERENCES sessions(session_id),
    event_name TEXT NOT NULL,
    tool_name TEXT,
    tool_use_id TEXT,
    timestamp DATETIME NOT NULL,
    payload TEXT
);

CREATE TABLE IF NOT EXISTS pi_sessions (
    pi_session_id TEXT PRIMARY KEY,
    role TEXT NOT NULL, -- orchestrator/cron/user/test
    status TEXT NOT NULL DEFAULT 'active'
      CHECK (status IN ('active', 'idle', 'ended', 'crashed')),
    runtime_instance_id TEXT,
    pid INTEGER,
    session_file TEXT,
    cwd TEXT NOT NULL,
    agent_dir TEXT,
    model_provider TEXT,
    model_id TEXT,
    thinking_level TEXT,
    started_at DATETIME NOT NULL,
    last_prompt_at DATETIME,
    last_event_at DATETIME NOT NULL,
    ended_at DATETIME,
    end_reason TEXT
);

CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    wa_message_id TEXT,
    remote_jid TEXT NOT NULL,
    body TEXT NOT NULL,
    context_ref TEXT,
    status TEXT NOT NULL DEFAULT 'pending'
      CHECK (status IN ('pending', 'sent', 'delivered', 'processed', 'failed')),
    error_message TEXT,
    created_at DATETIME NOT NULL DEFAULT (datetime('now')),
    processed_at DATETIME
);

CREATE TABLE IF NOT EXISTS pending_actions (
    action_id TEXT PRIMARY KEY,
    channel TEXT NOT NULL,
    context_ref TEXT,
    kind TEXT NOT NULL,
    prompt_text TEXT NOT NULL,
    related_session_id TEXT,
    related_todoist_task_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending'
      CHECK (status IN ('pending', 'resolved', 'expired', 'canceled')),
    created_at DATETIME NOT NULL DEFAULT (datetime('now')),
    resolved_at DATETIME,
    resolution_payload TEXT
);

CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_project ON sessions(project);
CREATE INDEX IF NOT EXISTS idx_sessions_last_event_at ON sessions(last_event_at);
CREATE INDEX IF NOT EXISTS idx_events_session_id ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
CREATE INDEX IF NOT EXISTS idx_events_session_event ON events(session_id, event_name);
CREATE INDEX IF NOT EXISTS idx_pi_sessions_status ON pi_sessions(status);
CREATE INDEX IF NOT EXISTS idx_pi_sessions_role_status ON pi_sessions(role, status);
CREATE INDEX IF NOT EXISTS idx_pi_sessions_last_event_at ON pi_sessions(last_event_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_status_created ON whatsapp_messages(status, created_at);
CREATE INDEX IF NOT EXISTS idx_pending_actions_status_created ON pending_actions(status, created_at);
```

### FR-2: Shared Writer and Hook Scripts

One bash wrapper per event under `~/.autonoma/hooks/`, each delegating to a shared Python writer (`~/.autonoma/scripts/bb-write.py`). All hooks configured as `async: true` to avoid blocking Claude Code.

Claude Code hook writers own `sessions` and `events`. The control surface runtime owns `pi_sessions` because Pi runtime state is not sourced from Claude hooks.

**Approach**: Python's `sqlite3` module with parameterized queries (`?` placeholders), WAL mode, and `busy_timeout=5000` on every connection.

**Event dispatch:**

| Event | Session Update | Event Record |
|-------|---------------|-------------|
| SessionStart | INSERT or UPDATE on resume; set `status='working'`; record launch metadata from env vars | Full payload |
| PreToolUse | set `status='working'`, update `last_event_at`, set `last_tool_started_at` | Truncated payload |
| PostToolUse | update `last_event_at`, clear `last_tool_started_at` | Truncated payload |
| PostToolUseFailure | same as PostToolUse | Truncated payload |
| Stop | `status='idle'`, update `last_event_at` | Full payload |
| SessionEnd | `status='ended'`, set `ended_at`, `session_end_reason`, clear `last_tool_started_at` | Full payload |
| SubagentStart | no session-state change | Full payload |
| SubagentStop | no session-state change | Full payload |

**Payload policy**:
- keep full payloads for lifecycle events (`SessionStart`, `Stop`, `SessionEnd`, subagent events)
- truncate noisy tool payloads
- never store large tool outputs in the blackboard; transcript JSONL remains the source of truth for deep inspection

### FR-3: Launch Metadata Handshake

Autonoma-managed sessions must be identifiable on the very first hook event. `launch_claude_code` starts Claude Code with these environment variables:

- `AUTONOMA_AGENT_MANAGED=1`
- `AUTONOMA_LAUNCH_ID=<uuid>`
- `AUTONOMA_TMUX_SESSION=<tmux_session_name>`
- `AUTONOMA_TASK_DESCRIPTION=<task text>`
- `AUTONOMA_TODOIST_TASK_ID=<id or empty>`

`SessionStart` reads those values and writes them into `sessions` immediately. No stdout parsing or race-prone post-hoc matching.

### FR-4: Project Identity Derivation

Normalize git remote URL to `host/owner/repo`. Stable across worktrees and clones.

**Approach**:
1. try `origin`
2. if absent, use first available remote
3. if no git remotes exist, use `basename(cwd)`
4. always store both:
   - `project`: normalized canonical identifier
   - `project_label`: human-friendly fallback `basename(cwd)`

The Python implementation strips protocol, auth, and port numbers, and removes `.git` suffix.

### FR-5: Staleness Detection

A Claude Code session is stale when:
- `status='working'`
- `last_event_at` is older than configured `stallMinutes` defaulting to 15
- and either no tool is in flight, or a tool has been in flight longer than configured `toolTimeoutMinutes` defaulting to 60

`stale` is a persisted Claude-session status in v1. It means the blackboard believes the session stopped advancing and now needs verification or reconciliation.

Thresholds are read from `~/.autonoma/config.json`.

### FR-6: Out-of-Order Event Safety

Hook writes must tolerate async arrival order.

Rules:
1. append every event row as received
2. update `sessions.last_event_at` with the max of current and incoming timestamp
3. only clear `last_tool_started_at` on Post events if the incoming timestamp is not older than the current value
4. once `status='ended'`, only an explicit later `SessionStart` may move it back to `working`
5. session-state updates are idempotent; replaying the same event should not corrupt state

### FR-7: Stale Reconciliation and Idle Cleanup

Sessions without `SessionEnd` must not stay `working` forever.

Deterministic maintenance behavior:
1. on control-surface startup, sweep `working` sessions with stale timestamps
2. if the stale rule is met, mark the Claude session row `stale`
3. repeat the same sweep during scheduled maintenance
4. Pi or deterministic runtime reconciliation may later move a stale Claude session back to `working` if tmux confirms it is actually active
5. Pi or deterministic runtime reconciliation may move a stale Claude session to `ended` if tmux confirms it is no longer active or if the runtime intentionally closes it
6. use `last_event_at` as the v1 proxy for long-idle session cleanup
7. if a Claude Code session is still open and `last_event_at` is older than 24 hours, the runtime may close it and mark it `ended` with an explicit reason such as `idle_timeout`
8. if a session is already `idle` or `ended`, do not force-close it again
9. no special reboot detection is needed; the sweep is idempotent and safe every time

### FR-8: Pi Runtime Session Tracking

The control surface mirrors the currently running embedded Pi session into `pi_sessions`.

Rules:
1. on control-surface startup, create or upsert one `pi_sessions` row for the embedded Pi session
2. persist the Pi SDK `session.sessionId`
3. persist the Pi JSONL `session.sessionFile` when available
4. persist `cwd`, `agent_dir`, `model_provider`, `model_id`, and `thinking_level`
5. set `status='active'` while the runtime is healthy
6. update `last_prompt_at` whenever the runtime sends a prompt into Pi
7. update `last_event_at` whenever Pi emits subscribed activity or when the queue/turn lifecycle confirms liveness
8. on graceful shutdown, set `status='ended'`, `ended_at`, and `end_reason='shutdown'`
9. on startup, mark stale previously-active rows for the same role/runtime family as `ended` or `crashed` with an explicit reason such as `restart`, `replaced`, or `crash_detected`
10. the schema must allow multiple active Pi sessions in general, but v1 runtime behavior should normally keep only one active `orchestrator` row

This table is the durable lookup point for “which Pi session is currently active?” without making SQLite the source of truth for Pi's full transcript history.

### FR-9: Pending Actions

When Pi asks the user a question that expects a reply, the runtime stores a row in `pending_actions`. `context_ref` is the external correlation key, but the database row is the durable source of truth.

Examples:
- restart or inspect a stale session
- approve a worktree or branch action
- clarify which spec to prioritize

WhatsApp replies and web replies resolve these rows; Pi can also query them through `query_blackboard`.

V1 decision:
- `pending_actions.related_session_id` is the durable way to track Claude Code sessions waiting on user input
- this is queryable without adding new schema
- a Claude Code session may later be closed by idle cleanup while the pending action remains open; the pending action is the thing Pi follows up on

### FR-10: Event Retention

No aggressive pruning in v1.

Policy:
- keep `sessions`, `pi_sessions`, `whatsapp_messages`, and `pending_actions` indefinitely
- keep `events` indefinitely for v1 unless DB growth becomes a real problem
- if pruning is added later, prune only old `events`, never core state tables

### FR-11: Scope of Hook Events

V1 tracks these eight Claude Code hook events only:
- SessionStart
- PreToolUse
- PostToolUse
- PostToolUseFailure
- Stop
- SessionEnd
- SubagentStart
- SubagentStop

Additional hook events like `Notification`, `UserPromptSubmit`, or `TaskCompleted` are out of scope for v1.

## Dependencies

- **Installer** — installs hook entries in `~/.claude/settings.json`
- **Python 3** — parameterized SQL writer
- **sqlite3** — init and ad-hoc inspection
