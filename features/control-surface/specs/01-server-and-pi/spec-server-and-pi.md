# Spec: Server and Embedded Pi Agent

The core of the control surface: an HTTP server hosting the only embedded Pi agent via the SDK. Pi runs in-process with custom tools, a persistent auto-compacting session, and an HTTP/WS API for external callers and the thin web client.

## Context

This is the central process of Autonoma. Everything else — WhatsApp daemon, Claude Code hooks, cron, and the web app — pushes events into this server. Pi lives here, decides what to do, and acts through registered tools and loaded skills.

The Pi SDK (`@mariozechner/pi-coding-agent`) provides `createAgentSession()` which returns a long-lived `AgentSession`. Messages are sent through a serialized queue into `session.prompt(text)`. Session state persists to JSONL on disk via `SessionManager.create()` and auto-compacts over time.

Pi's native session history remains JSONL-based. The control surface mirrors the currently running Pi runtime into the blackboard's `pi_sessions` table so other processes can query active orchestrator state without treating SQLite as Pi's transcript store.

## Dependencies

- `@mariozechner/pi-coding-agent` (Pi SDK)
- `@mariozechner/pi-ai` (model providers, `getModel`)
- `node:http` or equivalent HTTP server
- SQLite blackboard
- WhatsApp daemon (Unix socket IPC for send/poll)
- Claude Code CLI + tmux for managed session launches

## Functional Requirements

### FR-1: Server Process

HTTP server on `127.0.0.1:{port}` (default `18820`, configurable in `~/.autonoma/config.json`). Endpoints:

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/message` | Enqueue a message for Pi |
| POST | `/hook/:event` | Accept Claude Code hook payloads |
| GET | `/status` | Server health, Pi session info, connection states |
| GET | `/api/sessions` | Browser-facing Claude session list |
| GET | `/api/sessions/:sessionId` | Browser-facing session detail |
| GET | `/api/sessions/:sessionId/transcript` | Paginated transcript preview |
| POST | `/sessions/:sessionId/message` | Send a direct message to a Claude Code session |
| POST | `/runtime/whatsapp/start` | Start WhatsApp daemon |
| POST | `/runtime/whatsapp/stop` | Stop WhatsApp daemon |
| POST | `/stop` | Graceful shutdown |
| WS | `/ws` | Thin web client streaming interface |

All mutating HTTP endpoints require `Authorization: Bearer {controlSurfaceToken}`.

V1 auth model is intentionally minimal:
- server binds to `127.0.0.1` only
- browser and machine callers may use the same hard-coded/example bearer token from `~/.autonoma/config.json`
- treat the token as a localhost password for now
- keep the contract token-based so a real auth layer can replace it later without changing endpoint shapes

The token is stored in `~/.autonoma/config.json` and generated on first run if absent, though developers may also hard-code a local value during early iterations.

`POST /message` request:

```json
{
  "text": "User replied on WhatsApp: yes, go ahead",
  "source": "whatsapp",
  "metadata": {}
}
```

`POST /message` response:

```json
{
  "ok": true,
  "queued": true,
  "queueDepth": 2
}
```

`GET /status` response shape:

```json
{
  "ok": true,
  "pid": 12345,
  "uptime": 3600,
  "pi": {
    "sessionId": "abc-123",
    "sessionFile": "~/.autonoma/control-surface/sessions/2026-03-07T...jsonl",
    "messageCount": 47,
    "lastPromptAt": "2026-03-07T18:30:00Z",
    "queueDepth": 0,
    "busy": false
  },
  "whatsapp": {
    "status": "connected",
    "pid": 23456,
    "managedByControlSurface": true
  },
  "blackboard": "ok"
}
```

### FR-2: Embedded Pi Session

Initialize Pi via `createAgentSession()` with full control:

```typescript
import {
  createAgentSession,
  createReadTool,
  createBashTool,
  createGrepTool,
  DefaultResourceLoader,
  SessionManager,
  SettingsManager,
  AuthStorage,
  ModelRegistry,
} from "@mariozechner/pi-coding-agent";
import { getModel } from "@mariozechner/pi-ai";

const HOME = process.env.HOME!;
const CWD = HOME;
const SESSION_DIR = path.join(HOME, ".autonoma", "control-surface", "sessions");
const AGENT_DIR = path.join(HOME, ".autonoma", "control-surface", "agent");

const auth = AuthStorage.create(path.join(AGENT_DIR, "auth.json"));
const modelRegistry = new ModelRegistry(auth, path.join(AGENT_DIR, "models.json"));

const resourceLoader = new DefaultResourceLoader({
  cwd: CWD,
  agentDir: AGENT_DIR,
  systemPromptOverride: () => AUTONOMA_SYSTEM_PROMPT,
});
await resourceLoader.reload();

const { session } = await createAgentSession({
  cwd: CWD,
  agentDir: AGENT_DIR,
  model: getModel("anthropic", config.piModel || "claude-sonnet-4-6"),
  thinkingLevel: config.piThinkingLevel || "low",
  tools: [createReadTool(CWD), createBashTool(CWD), createGrepTool(CWD)],
  customTools: [
    sendWhatsAppTool,
    pollWhatsAppTool,
    queryBlackboardTool,
    manageSessionTool,
    launchClaudeCodeTool,
  ],
  resourceLoader,
  sessionManager: SessionManager.create(CWD, SESSION_DIR),
  settingsManager: SettingsManager.inMemory(),
  authStorage: auth,
  modelRegistry,
});
```

Key choices:
- **`cwd: HOME`** — Pi is an orchestrator, not tied to one repo.
- **`SessionManager.create(CWD, SESSION_DIR)`** — persistent session JSONL on disk.
- **`SettingsManager.inMemory()`** — model/thinking controlled by Autonoma config.
- **skills loaded via `resourceLoader`** — this is how Todoist behavior enters the system.
- **custom tools kept narrow** — only runtime and transport actions become custom tools.

### FR-3: Blackboard Mirroring for the Active Pi Session

The control surface must mirror the embedded Pi runtime into the blackboard's `pi_sessions` table.

On startup, after `createAgentSession()` succeeds, the runtime writes or upserts a `pi_sessions` row containing at least:
- `pi_session_id = session.sessionId`
- `role = 'orchestrator'`
- `status = 'active'`
- `runtime_instance_id`
- `pid`
- `session_file = session.sessionFile`
- `cwd`
- `agent_dir`
- `model_provider`
- `model_id`
- `thinking_level`
- `started_at`
- `last_event_at`

Update behavior:
- update `last_prompt_at` whenever the runtime calls `session.prompt()`
- update `last_event_at` from Pi event subscriptions and/or queue turn lifecycle
- update model/thinking columns if those values change

Shutdown/recovery behavior:
- on graceful shutdown, set `status='ended'`, `ended_at`, `end_reason='shutdown'`
- on startup, reconcile any stale previously-active orchestrator rows and mark them `ended` or `crashed` with an explicit reason
- the runtime should normally keep only one active `orchestrator` row, even though the schema allows multiple active Pi sessions in general

This row is for runtime discovery and health queries. Pi's actual message history remains the JSONL session file.

### FR-4: Single Turn Queue

All inbound messages are serialized through one queue. Only one Pi turn may execute at a time.

Queue item shape:

```ts
type QueueItem = {
  id: string;
  source: "whatsapp" | "hook" | "cron" | "web";
  text: string;
  metadata?: Record<string, unknown>;
  receivedAt: string;
  webClientId?: string;
  deliveryMode?: "followUp" | "steer";
};
```

Rules:
1. every accepted inbound message becomes a queue item
2. the server processes items FIFO
3. only one Pi turn may execute at once
4. if Pi is idle, the runtime may deliver the next item with `session.prompt()`
5. if Pi is already streaming, v1 should prefer the Pi SDK's built-in queueing semantics over homegrown interruption logic:
   - default delivery mode is `followUp`
   - `followUp` means the message is delivered after the current Pi work finishes
   - `steer` is supported as an explicit override for manual/operator use, but is not the default
6. hook filtering happens before enqueueing
7. queue depth is exposed in `/status`
8. v1 does not implement queue coalescing or prioritization

Default delivery mapping in v1:
- WhatsApp inbound → `followUp`
- web inbound → `followUp`
- forwarded hook events → `followUp`
- cron bootstrap/check-in → `followUp`

This queue is the runtime contract that keeps one persistent Pi session coherent under concurrent inbound events without racing concurrent prompts into the embedded Pi session.

### FR-5: System Prompt

The system prompt lives at `~/.autonoma/control-surface/agent/system-prompt.md`.

Initial content:

```markdown
You are Autonoma, a Pi agent orchestrating Claude Code sessions and managing development workflows.

You run as a long-lived embedded agent inside the Autonoma control surface. Messages arrive from multiple sources — WhatsApp replies, Claude Code hook events, cron check-ins, and the web app. Each message includes its source.

Important runtime facts:
- You are the only embedded Pi instance in the system.
- The web app is a thin client to this control surface, not a second agent host.
- Machine behavior like queueing, health checks, and crash sweeps is handled by runtime code.
- You decide actions, summaries, and user communication.
- Todoist behavior is available through skills, not custom tools.

Your job:
- monitor Claude Code sessions via the blackboard
- detect stale or completed sessions and take action
- reach the user via WhatsApp when decisions are needed
- use existing workflow skills, including Todoist, when appropriate
- be proactive but permission-gated: suggest actions, don't execute significant changes without approval

When a Claude Code session stops or ends:
1. query the blackboard for session details
2. read the recent transcript if needed
3. decide: re-prompt the session, notify the user, or do nothing
4. if notifying, compose a concise WhatsApp message with actionable options

When a cron tick arrives:
1. query the blackboard for working, idle, stale, and ended sessions
2. use relevant skills if workflow review is needed
3. reach out only if there is something actionable

When the user replies on WhatsApp or the web app:
1. inspect pending actions and recent context
2. execute the chosen action
3. confirm back through the relevant channel

Communication style: terse, no fluff. Status updates are bulleted. Questions have numbered options. Never send a message unless there's something actionable.
```

### FR-6: Custom Tools

Each tool is registered via `customTools`.

#### `send_whatsapp`
Sends a message through the WhatsApp daemon via Unix socket IPC.

#### `poll_whatsapp`
Returns unread inbound messages from the daemon/blackboard layer.

#### `query_blackboard`
Runs read-only SQL against the blackboard.

Rules:
- allow only `SELECT` and `PRAGMA`
- point Pi at `sessions`, `pi_sessions`, `events`, `whatsapp_messages`, and `pending_actions`

#### `manage_session`
Manages Claude Code tmux sessions.

Actions:
- `list`
- `inspect`
- `inject`
- `kill`

#### `launch_claude_code`
Launches a new **interactive Claude Code CLI session in tmux**, not a second embedded SDK agent.

Parameters:
- `cwd: string`
- `prompt: string`
- `session_name?: string`
- `task_description?: string`
- `todoist_task_id?: string`

Execution contract:
1. generate `launch_id`
2. create tmux session in `cwd`
3. start Claude Code CLI interactively with launch metadata exported in the environment:
   - `AUTONOMA_AGENT_MANAGED=1`
   - `AUTONOMA_LAUNCH_ID`
   - `AUTONOMA_TMUX_SESSION`
   - `AUTONOMA_TASK_DESCRIPTION`
   - `AUTONOMA_TODOIST_TASK_ID`
4. inject the initial user prompt into the tmux pane
5. return `launch_id` and `tmux_session`
6. the first `SessionStart` hook will record the same metadata in the blackboard

This avoids stdout parsing and removes the race around session identification.

### FR-7: Message Formatting and Enqueue

When the server receives a valid POST to `/message` or `/hook/:event`:

1. authenticate the caller
2. format the payload into a human-readable prompt
3. determine delivery mode:
   - default to `followUp`
   - allow explicit `steer` override from trusted callers such as the web app
4. enqueue it
5. return immediately with `{ ok: true, queued: true }`

Formatting examples:

**WhatsApp inbound**
```text
[WhatsApp] User replied: "yes, go ahead"
Context: session-12-stall
```

**Hook event: SessionStart**
```text
[Hook: SessionStart] Claude Code session started.
Session ID: abc-123
Project: github.com/user/repo
CWD: ~/Documents/coded-programs/repo
Transcript: /path/to/transcript.jsonl
Agent managed: yes
Tmux session: auto-search-ui
```

**Hook event: Stop**
```text
[Hook: Stop] Claude Code session stopped.
Session ID: abc-123
Project: github.com/user/repo
CWD: ~/Documents/coded-programs/repo
```

**Cron tick**
```text
[Cron] Scheduled check-in. Assess sessions and run relevant workflow skills if there is anything actionable.
```

**Web app**
```text
[Web] User: "What's the status of the search UI session?"
```

#### Direct Claude Session Messaging

V1 direct session messaging from the web app uses the simplest reliable transport: tmux injection.

`POST /sessions/:sessionId/message` behavior:
1. look up the target session in the blackboard
2. resolve its `tmux_session`
3. verify the target Claude Code session is inject-safe before sending anything:
   - if the session is `ended`, reject
   - if the session is `working` with recent activity, treat it as busy and do not inject
   - if the session is `idle`, injection is allowed
   - if state is `stale` or otherwise ambiguous, fail closed rather than risk injecting into an inferencing session
4. use the runtime's tmux/session management path to inject the provided text into the live Claude Code session only when the check passes
5. return `delivery: "tmux_send_keys"` on success, or a busy/not-delivered response when the session is not inject-safe

This is intentionally a v1 transport choice, not a forever protocol choice. A later phase may replace this with a more structured Claude-session messaging path.

### FR-8: Deterministic Maintenance

The control surface runtime performs deterministic maintenance that should not depend on Pi remembering to do it:

- startup blackboard ping
- periodic WhatsApp daemon health check
- periodic sweep for `working` sessions whose timestamps now qualify them as `stale`
- periodic sweep for sessions that appear stuck inferencing because hooks stopped advancing
- 24-hour idle cleanup for Claude Code sessions using `last_event_at` as the v1 idle proxy
- queue bookkeeping and stuck-turn detection

24-hour idle cleanup policy in v1:
- if a Claude Code session is still open and `last_event_at` is older than 24 hours, the runtime may close the tmux/Claude session and mark it ended in the blackboard
- if a session is already `idle` or `ended`, no forced close is needed
- unresolved `pending_actions` remain in the blackboard even if the Claude Code session is later closed; Pi can still query them and follow up with the user

Pi may react to the results of these checks, but the checks themselves are runtime behavior.

### FR-9: Process Lifecycle

- **start**: `node server.js` in development; managed runtime in production
- **PID file**: `~/.autonoma/control-surface/server.pid`
- **logs**: `~/.autonoma/logs/control-surface.log`
- **graceful shutdown**: `POST /stop` or SIGTERM
- **crash recovery**: on restart, Pi resumes from persisted session JSONL

The control surface is the runtime owner of the app. Starting the app means starting the control surface, and the control surface startup path must also ensure dependent background processes are up, especially the WhatsApp daemon.

Startup behavior:
1. start control-surface process
2. initialize/open embedded Pi session
3. ensure WhatsApp daemon process is running
4. expose health state through `/status`

Shutdown behavior:
1. graceful `POST /stop` or SIGTERM marks `pi_sessions` ended
2. stop managed child/background processes started by the app, including the WhatsApp daemon
3. remove PID files / stale runtime markers

V1 supervision policy:
- the WhatsApp daemon is **not** an independently installed always-on service
- it is a dependent runtime process managed by the control surface
- the web app may call dedicated runtime endpoints to start or stop it manually
- manual WhatsApp authentication remains terminal-driven for now (`autonoma-wa auth`), with browser QR UX deferred

Config additions in `~/.autonoma/config.json`:

```json
{
  "controlSurfacePort": 18820,
  "controlSurfaceToken": "auto-generated-uuid",
  "piModel": "claude-sonnet-4-6",
  "piThinkingLevel": "low",
  "stallMinutes": 15,
  "toolTimeoutMinutes": 60
}
```

### FR-10: Event Subscription for the Thin Web Client

Pi's session emits events via `session.subscribe()`. The server forwards these to connected WebSocket clients:

- `message_update` → `text_delta`
- `tool_execution_start`
- `tool_execution_end`
- `turn_end`

The browser always sees Pi's streamed response for turns it initiated. The web app does not host its own Pi session.

## Consequential Interface: HTTP API

```
POST /message
  Authorization: Bearer {controlSurfaceToken}
  Content-Type: application/json
  Body: { text: string, source: string, metadata?: object, deliveryMode?: "followUp" | "steer" }
  Response: { ok: boolean, queued: boolean, queueDepth: number }

POST /hook/:event
  Authorization: Bearer {controlSurfaceToken}
  Content-Type: application/json
  Body: raw Claude Code hook payload
  Response: { ok: boolean, queued?: boolean, filtered?: boolean }

GET /status
  Response: { ok, pid, uptime, pi: {...}, whatsapp, blackboard }

GET /api/sessions
  Response: { items: [...] }

GET /api/sessions/:sessionId
  Response: { session: {...} }

GET /api/sessions/:sessionId/transcript?cursor=...&limit=...
  Response: { items: [...], nextCursor?: string }

POST /sessions/:sessionId/message
  Authorization: Bearer {controlSurfaceToken}
  Content-Type: application/json
  Body: { text: string }
  Response: { ok: boolean, delivery?: "tmux_send_keys", sessionId: string, busy?: boolean, reason?: string }

POST /runtime/whatsapp/start
  Authorization: Bearer {controlSurfaceToken}
  Response: { ok: boolean, status: string }

POST /runtime/whatsapp/stop
  Authorization: Bearer {controlSurfaceToken}
  Response: { ok: boolean, status: string }

POST /stop
  Authorization: Bearer {controlSurfaceToken}
  Response: { ok: boolean, message: string }

WS /ws
  Token-authenticated streaming channel for the thin web client
```

## Security

- server binds to `127.0.0.1` only
- bearer-token auth on mutating endpoints
- v1 browser access may reuse the same localhost token as machine callers
- `query_blackboard` is read-only
- `bash` operates from `$HOME` under normal Pi safety rules

## Locked Decisions

- queueing is strict FIFO in v1
- the runtime uses Pi SDK queueing semantics where possible: `followUp` by default, `steer` only as an explicit override
- queue coalescing and prioritization are out of scope for v1
- browser and machine callers reuse the same localhost bearer token in v1
- direct tmux injection must check session state first and fail closed when busy or ambiguous
