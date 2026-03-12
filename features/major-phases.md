# Autonoma — Major Phases Plan

Implementation order for the current architecture:

- One long-running **control surface** with an embedded **Pi** session
- SQLite **blackboard** as shared state
- **Cron** as idle/stale classifier and recovery loop
- **WhatsApp** as a transport daemon owned by app runtime
- **Web app** as a thin localhost client

Goal: minimize rework, maximize safe parallel execution, reach usable state fastest.

## Guiding Rules

1. **Build the runtime spine first.** Control surface, blackboard, and persisted Pi session are the core.
2. **Cron is not a second orchestrator.** It classifies SQLite state, ensures the app is up when needed, and seeds one deterministic prompt only after recovery into an actionable idle/stale condition.
3. **WhatsApp and web are clients/transports.** No orchestration layer in either.
4. **Freeze interfaces before parallel work.** DB schema and control-surface API shape must stabilize early so UI/channel work proceeds safely.
5. **Simplest workable transport in v1.** Direct Claude session messaging uses tmux injection for now.
6. **Parallelize by interface ownership, not feature labels.** One owner per shared pathway: DB schema + migrations, control-surface HTTP/WS contracts, tmux/session adapter, transcript normalization shape. Everyone else builds against frozen contracts.

---

## Current State Snapshot

### Ready to implement

- **Blackboard** — `features/blackboard/FEATURE.md`, `features/blackboard/specs/01-blackboard/spec-blackboard.md`
- **Control Surface** — `features/control-surface/FEATURE.md`, `features/control-surface/specs/01-server-and-pi/spec-server-and-pi.md`, `features/control-surface/specs/02-channel-routing/spec-channel-routing.md`
- **Cron Scheduler** — `features/cron-scheduler/FEATURE.md`, `features/cron-scheduler/specs/01-cron-scheduler/spec-cron-scheduler.md`
- **Installer** — `features/installer/FEATURE.md`, `features/installer/specs/01-installer/spec-installer.md`
- **Web App** — `features/web-app/FEATURE.md`, `features/web-app/specs/01-web-app/spec-web-app.md`

### Implementable with baseline already proven locally

- **WhatsApp Channel** — `features/whatsapp-channel/FEATURE.md`, `features/whatsapp-channel/specs/01-whatsapp-channel/spec-whatsapp-channel.md`
  Baseline daemon/send/reply flow is considered proven locally. Remaining work is runtime ownership, control-surface integration, and operational hardening.

---

## Dependency Graph

```text
Installer
  ├──> Blackboard
  ├──> Cron registration (macOS + Linux)
  └──> Runtime file deployment

Blackboard
  └──> Control Surface
         ├──> tmux / Claude session bridge
         ├──> Cron recovery loop
         ├──> WhatsApp daemon ownership
         └──> Web app thin client
```

Equivalent linear reading:

```text
Blackboard + runtime config
  -> Control Surface core
  -> tmux / Claude bridge
  -> cron recovery
  -> WhatsApp transport integration
  -> web app thin client
  -> hardening
```

---

# Major Phases

## Phase 1 — Blackboard and runtime foundation

**Goal:** Build the state and config substrate everything depends on — stable SQLite schema, persisted runtime state, session/runtime lookup queries, predictable config loading.

**Scope:**
- SQLite init + migrations
- Blackboard schema: `sessions`, `events`, `pi_sessions`, `whatsapp_messages`, `pending_actions`
- Hook writer behavior
- Launch metadata handshake
- Stale-reconciliation and idle-cleanup queries
- Config loader for `~/.autonoma/config.json`

**Docs:** `features/blackboard/specs/01-blackboard/spec-blackboard.md`, `features/overview.md`

**Suggested modules:**
- `src/config/load-config.ts`
- `src/blackboard/db.ts`, `migrate.ts`, `schema.sql`
- `src/blackboard/writers/hook-writer.ts`, `pi-session-writer.ts`
- `src/blackboard/queries/sessions.ts`, `pi-sessions.ts`

**Exit criteria:** Schema implemented and migratable; hook writes durable and spec-aligned; `pi_sessions` queryable; control surface can safely depend on blackboard.

---

## Phase 2 — Control Surface core runtime

**Goal:** Bring up the real app runtime: control surface hosting the embedded Pi session.

**Scope:**
- HTTP server
- Embedded Pi with persisted JSONL session
- Single-turn FIFO queue
- Pi event subscriptions
- `pi_sessions` mirroring
- Routes: `/message`, `/hook/:event`, `/status`, `/stop`
- Runtime lifecycle handling
- Basic custom-tool registration shells

**Docs:** `features/control-surface/specs/01-server-and-pi/spec-server-and-pi.md`

**Suggested modules:**
- `src/control-surface/server.ts`, `runtime.ts`
- `src/control-surface/pi/create-agent.ts`, `session-state.ts`, `subscribe.ts`
- `src/control-surface/queue/turn-queue.ts`
- `src/control-surface/routes/message.ts`, `hooks.ts`, `status.ts`, `stop.ts`

**Exit criteria:** Control surface starts cleanly; embedded Pi persists across restarts; queue serializes turns; `/status` reports live Pi; hook and message ingress work.

---

## Phase 3 — Claude/tmux bridge and machine integrations

**Goal:** Connect runtime to real Claude Code sessions and machine-side channels.

**Scope:**
- tmux/Claude session adapter
- Direct session messaging endpoint
- `launch_claude_code` and `manage_session` tool behavior
- Hook forwarding alignment
- Control-surface-side event filtering
- Browser-facing session/transcript endpoints

**Docs:** `features/control-surface/specs/02-channel-routing/spec-channel-routing.md`, `features/control-surface/specs/01-server-and-pi/spec-server-and-pi.md`

**Suggested modules:**
- `src/claude-sessions/tmux.ts`, `send-message.ts`, `launch-session.ts`
- `src/control-surface/routes/direct-session-message.ts`, `browser-sessions.ts`, `browser-transcript.ts`

**Key v1 decision:** Direct Claude session messaging uses **tmux send-keys**, but only after an inject-safe state check; busy or ambiguous sessions fail closed.

**Exit criteria:** Control surface can list/inspect Claude sessions; direct message delivery works through the inject-safe gate; browser-facing session and transcript endpoints exist; hook routing reaches control surface cleanly.

---

## Phase 4 — Cron recovery loop

**Goal:** Self-healing — app always comes back up.

**Scope:**
- `~/.autonoma/cron/autonoma-checkin.sh`
- `~/.autonoma/bin/autonoma-up`
- 10-minute cross-platform scheduling
- SQLite-backed idle/stale classification
- Launch-if-missing, `/status` health check
- Deterministic prompt injection after recovery for `idle-window` or `stale-window`; no-op when Pi is already active

**Docs:** `features/cron-scheduler/specs/01-cron-scheduler/spec-cron-scheduler.md`

**Suggested modules:** `scripts/autonoma-checkin.sh`, `scripts/autonoma-up.sh`

**Exit criteria:** macOS and Linux schedules supported by installer; cron classifies Claude-session state from SQLite, exits politely when there is no actionable idle/stale condition, relaunches if missing, and sends exactly one deterministic prompt after recovery when warranted.

---

## Phase 5 — WhatsApp transport integration

**Goal:** Connect app runtime to a real outbound/inbound user channel.

**Scope:**
- WhatsApp daemon process ownership by control surface
- Runtime endpoints: `/runtime/whatsapp/start`, `/runtime/whatsapp/stop`
- Control-surface tools: `send_whatsapp`, `poll_whatsapp`
- Inbound forwarding to control surface
- Outbound/inbound blackboard flow
- Manual auth flow (`autonoma-wa auth`)

**Docs:** `features/whatsapp-channel/specs/01-whatsapp-channel/spec-whatsapp-channel.md`, `features/control-surface/specs/01-server-and-pi/spec-server-and-pi.md`

**Suggested modules:**
- `src/whatsapp/daemon.ts`, `ipc.ts`, `auth.ts`, `send.ts`, `receive.ts`
- `src/control-surface/routes/runtime-whatsapp.ts`

**V1 UX decision:** WhatsApp auth stays **manual and terminal-driven**.

**Exit criteria:** Control surface starts/stops daemon; Pi can send WhatsApp through runtime tools; inbound replies reach blackboard and control surface; manual auth documented and working.

---

## Phase 6 — Web app thin client

**Goal:** Localhost browser surface consuming stable backend contracts.

**Scope:**
- TanStack Start shell
- Localhost bearer-token fetch layer
- WS client for Pi streaming
- Chat UI, session list/detail UI, transcript preview UI
- Direct session messaging UI
- Runtime controls for WhatsApp daemon

**Docs:** `features/web-app/specs/01-web-app/spec-web-app.md`

**Suggested modules:**
- `web/src/lib/api.ts`, `ws.ts`
- `web/src/routes/__root.tsx`, `index.tsx`, `sessions/index.tsx`, `sessions/$sessionId.tsx`
- `web/src/components/chat/ChatPanel.tsx`, `ToolEventList.tsx`
- `web/src/components/sessions/SessionList.tsx`, `SessionDetail.tsx`, `TranscriptViewer.tsx`
- `web/src/components/runtime/WhatsAppControls.tsx`

**Exit criteria:** Browser can chat with Pi, list sessions, inspect transcript previews, send direct Claude session messages, start/stop WhatsApp daemon.

---

## Phase 7 — Installer, startup wrappers, and hardening

**Goal:** Clean install/start/recover/uninstall lifecycle.

**Scope:**
- Installer/uninstaller finalization
- Runtime file deployment
- launchd + Linux crontab support
- Startup wrapper cleanup, PID/log handling
- Graceful shutdown
- Transcript API normalization cleanup
- Runtime error handling and retries
- End-to-end install/run/recover/uninstall checks

**Docs:** `features/installer/specs/01-installer/spec-installer.md` + all specs above

**Exit criteria:** Install is idempotent; uninstall removes only Autonoma-owned modifications; startup wrapper reliable; cron, hooks, web, and WhatsApp all converge on same control-surface Pi runtime; end-to-end smoke tests pass.

---

# Parallel Execution Strategy

Phases define logical dependency order but don't execute serially. Freeze shared contracts early, assign one owner per shared pathway, let downstream teams build against those contracts.

## Shared pathway owners (single-owner rule)

### Owner 1 — Data contract
Owns: SQLite schema, migrations, blackboard query helpers, transcript normalized item shape.
Freezes: DB schema, indexes, transcript preview response shape.

### Owner 2 — Control-surface API
Owns: `/status`, `/message`, `/hook/:event`, `/api/sessions`, `/api/sessions/:sessionId`, `/api/sessions/:sessionId/transcript`, `/sessions/:sessionId/message`, `/runtime/whatsapp/start`, `/runtime/whatsapp/stop`, `/ws`.
Freezes: HTTP request/response payloads, WS event/message payloads, auth header/query-token contract.

### Owner 3 — Claude/tmux bridge
Owns: tmux adapter, session launch/inject/list/kill pathways, v1 direct-message delivery contract (`tmux_send_keys`).

### Owner 4 — Runtime packaging
Owns: `autonoma-up`, cron script shape, installer/uninstaller integration, runtime file layout under `~/.autonoma/`.

---

## Recommended parallel waves

### Wave 0 — Contract freeze sprint (small, critical, fast)

The only truly serial part. 4 engineers max, 1 per shared pathway.

**Deliverables:** DB schema + migration plan, control-surface endpoint list, WS event names, transcript normalized item shape, tmux bridge contract, runtime file layout — all frozen.

**Exit criteria:** Everyone else can stub against these interfaces without waiting.

---

### Wave 1 — Backend spine in parallel

All start after Wave 0.

| Track | Implements | Owns |
|-------|-----------|------|
| **A — Blackboard** | Phase 1: schema, migrations, query helpers, hook writer, `pi_sessions` | DB internals |
| **B — Control-surface core** | Phase 2: persisted Pi, queue, status/message/hook/stop routes, Pi event subscriptions | HTTP server/runtime |
| **C — Claude/tmux bridge** | Phase 3: tmux/session adapter, direct session message pathway, launch/list/inject helpers | tmux adapter internals |
| **D — Installer/runtime packaging** | Installer skeleton, runtime file deployment, `autonoma-up` wrapper, cron registration (macOS + Linux) | Installed file layout, startup scripts |

Safe in parallel: each track owns distinct implementation surfaces, sharing only frozen interfaces.

---

### Wave 2 — Integration surfaces in parallel

Start as soon as Wave 1 has minimal working stubs.

| Track | Implements | Depends on |
|-------|-----------|-----------|
| **E — Cron recovery** | Phase 4: SQLite classification, health check, launch-if-missing, one deterministic idle/stale prompt after recovery | `/status`, `/message`, `autonoma-up` |
| **F — WhatsApp runtime** | Phase 5: start/stop endpoints, tool hookup, inbound forwarding | Control-surface runtime, runtime packaging |
| **G — Browser API + transcript** | Session list/detail routes, transcript preview, WS browser stream completion | Control-surface API, data contract |

Safe in parallel: each track integrates against already-owned contracts.

---

### Wave 3 — Web app + system hardening in parallel

| Track | Implements |
|-------|-----------|
| **H — Web app shell** | TanStack Start scaffold, auth token plumbing, route shell, API client, WS client |
| **I — Web app UX** | Pi chat UI, tool-event rendering, session list/detail, direct session message UI, WhatsApp controls |
| **J — Runtime hardening** | Retries, logging, PID cleanup, graceful shutdown, crash handling |

Safe in parallel: frontend builds against stable APIs while hardening improves backend behind the same contracts.

---

### Wave 4 — End-to-end closure

| Track | Implements |
|-------|-----------|
| **K — Installer finalization** | Install/uninstall lifecycle, runtime asset deployment, launchd/crontab cleanup |
| **L — End-to-end QA** | install -> start -> recover -> message -> stop -> uninstall; localhost browser checks; WhatsApp manual-auth smoke; transcript paging smoke |

---

## Suggested staffing

### Core owners (small group)
1 engineer each: data contract, control-surface API, Claude/tmux bridge, runtime packaging.

### Parallel execution teams
- 1–2: blackboard implementation
- 2: control-surface runtime
- 1–2: cron + startup scripts
- 1–2: WhatsApp integration
- 2–3: web app
- 1–2: installer/hardening/QA

---

## File ownership boundaries

| Team | Primary ownership |
|------|------------------|
| Data / blackboard | `src/blackboard/**`, `src/config/load-config.ts` |
| Control surface runtime | `src/control-surface/**` (except routes owned elsewhere) |
| Claude/tmux bridge | `src/claude-sessions/**`, `src/control-surface/routes/direct-session-message.ts` |
| WhatsApp integration | `src/whatsapp/**`, `src/control-surface/routes/runtime-whatsapp.ts` |
| Web app | `web/src/**` |
| Runtime packaging / installer | `scripts/**`, installer/uninstaller files, deploy/runtime asset templates |

Cross-boundary contract changes go through the owner — no ad hoc edits.

---

# Fastest Path to a Usable System

Maximum throughput is **not** fully serial phases. It is:

1. **Wave 0** — freeze shared contracts
2. **Wave 1** — blackboard, control-surface core, tmux bridge, installer/runtime packaging in parallel
3. **Wave 2** — cron, WhatsApp, browser API completion in parallel
4. **Wave 3** — web app and hardening in parallel
5. **Wave 4** — installer closure and end-to-end QA

**Earliest useful milestone** (end of Waves 1+2): control surface alive, Pi persistent, Claude sessions reachable, cron recovery working, WhatsApp daemon runtime-owned, browser-facing session APIs available. The app is real; the web UI becomes a consumer, not a blocker.

---

# Remaining Risks

- **WhatsApp reliability** — pairing, reconnect behavior, auth expiry edge cases
- **Transcript normalization** — exact item/event shape, large-file chunking performance
- **Startup wrappers** — final `autonoma-up` shape, PID ownership, stale PID cleanup
- **WebSocket polish** — reconnect strategy, correlation IDs, multi-tab behavior

---

# Summary

**Canonical dependency order:**
1. Blackboard and runtime foundation
2. Control Surface core runtime
3. Claude/tmux bridge and machine integrations
4. Cron recovery loop
5. WhatsApp transport integration
6. Web app thin client
7. Installer, startup wrappers, and hardening

**Execution model:** Short shared-contract freeze, then multiple parallel waves owned by interface boundaries.

**Core principle:** Build the app as one persistent runtime first; attach recovery, channels, and UI around it without letting teams edit the same shared pathways simultaneously.
