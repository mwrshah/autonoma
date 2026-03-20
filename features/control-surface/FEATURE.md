# Feature: Control Surface

Long-running server hosting the only embedded Pi agent. Central nervous system of Autonoma: receives events from all channels, routes them through a serialized turn queue into one persistent Pi session, and Pi acts on the world through custom tools plus existing skills.

## Problem

Without a control surface, the architecture fragments: a WhatsApp daemon writes to SQLite, hook scripts write to SQLite, a cron scheduler wakes up independently, and a web UI would need its own agent session. Pi would constantly cold-start, rebuild context, and lose continuity.

Autonoma needs one always-on process where Pi lives, where channels push messages, and where deterministic runtime behavior handles queueing, state reconciliation, and process integration.

## Goals

1. A long-running Node.js/TypeScript server hosting Pi via `createAgentSession()` from the Pi SDK
2. Pi maintains one persistent session with auto-compaction
3. The active Pi runtime session is mirrored into the blackboard in a dedicated `pi_sessions` table
4. All inbound sources route into a single queued prompt stream: WhatsApp replies, Claude Code hook events, cron ticks, web app messages
5. Pi acts through custom tools (query blackboard, reload resources) and on-demand skills (tmux-2 for session management, Todoist for task context); Pi's final text response each turn is auto-surfaced to WhatsApp and the web client by the runtime
6. Todoist integration comes from existing Pi skills, not bespoke infrastructure code
7. HTTP + WebSocket API for external processes and the thin web client
8. The control surface acts as the app runtime owner: on startup it also brings up dependent processes such as the WhatsApp daemon
9. Deterministic runtime behavior for queueing, maintenance sweeps, routing, and dependent-process supervision; Pi decides actions and messaging

## Architecture

```
               ┌──────────────────────────────────────────────────┐
               │                 Control Surface                  │
               │                                                  │
               │   HTTP / WS API (:18820)                         │
               │   ├─ POST /message        ← Web, cron, daemon    │
               │   ├─ POST /hook/:event    ← Claude Code hooks    │
               │   ├─ POST /stop           ← Graceful shutdown    │
               │   ├─ GET  /status         ← Health/status (open) │
               │   ├─ GET  /api/sessions   ← Session browser (open)│
               │   ├─ GET  /api/pi/history ← Pi history (open)    │
               │   ├─ POST /runtime/whatsapp/start|stop ← Daemon  │
               │   ├─ POST /sessions/:id/message ← Direct inject  │
               │   └─ WS   /ws            ← Web client            │
               │                                                  │
               │   ┌──────────────────────────────────────────┐   │
               │   │ Inbound queue + single active Pi turn    │   │
               │   └──────────────────────┬───────────────────┘   │
               │                          │                       │
               │   ┌──────────────────────▼───────────────────┐   │
               │   │          Embedded Pi Agent               │   │
               │   │  Persistent, auto-compacting session     │   │
               │   │  Tools:                                   │   │
               │   │   - query_blackboard                      │   │
               │   │   - reload_resources                      │   │
               │   │   - read, bash, grep                      │   │
               │   │  Auto-surface: final text → WA + web      │   │
               │   │  Skills: Todoist, tmux-2, Autonoma wkflws │   │
               │   └──────────────────────┬───────────────────┘   │
               │                          │                       │
               │   ┌──────────────────────▼───────────────────┐   │
               │   │ Deterministic runtime helpers            │   │
               │   │ queueing · sweeps · health checks        │   │
               │   └──────────────────────────────────────────┘   │
               └──────────────────┬───────────────────────────────┘
                                  │
            ┌─────────────────────┼─────────────────────┐
            ▼                     ▼                     ▼
   ┌────────────────┐  ┌──────────────────┐  ┌──────────────────┐
   │ WhatsApp Daemon│  │ Blackboard (SQL) │  │ Claude Code tmux │
   │ (Baileys)      │  │                  │  │ sessions         │
   └────────────────┘  └──────────────────┘  └──────────────────┘
```

## How Events Reach Pi

| Source | Transport | What Pi Receives |
|--------|-----------|-----------------|
| WhatsApp reply | Daemon forwards via HTTP POST `/message` | `[WhatsApp] User replied: {body}` + context metadata |
| Claude hook: SessionStart | Hook script POSTs to `/hook/session-start` | Notification that a session started, with transcript/cwd/session metadata |
| Claude hook: Stop | Hook script POSTs to `/hook/stop` | Notification that a session paused/stopped |
| Claude hook: SessionEnd | Hook script POSTs to `/hook/session-end` | Notification that a session ended |
| Cron tick | launchd/systemd timer POSTs to `/message` | Scheduled check-in request |
| Web app message | WebSocket or HTTP POST `/message` | User's typed message |

## How Pi Acts on the World

Pi uses custom tools for machine actions, skills for workflow logic, and auto-surface for user-facing replies.

| Mechanism | What It Does |
|-----------|---------------|
| Auto-surface | After each Pi turn, the runtime extracts Pi's final assistant text and automatically sends it to both WhatsApp (via daemon IPC) and all connected web clients (via `pi_surfaced` WebSocket event). Pi does not need a tool to reach the user. |
| `query_blackboard` | Runs read-only SQL (SELECT/PRAGMA only) against `blackboard.db` |
| `reload_resources` | Hot-reload skills, extensions, prompts, context files, and system prompt |
| Skills (tmux-2) | Manage Claude Code sessions across tmux — launch, inspect, inject, kill |
| Skills (Todoist) | Todoist and workflow-specific behavior loaded into Pi |
| Standard tools | `read`, `bash`, `grep` |

## Session Lifecycle

Pi's session persists across server restarts via `SessionManager.create()` (JSONL on disk). Auto-compaction summarizes older messages when approaching context limits. The session is a continuous thread across WhatsApp, hooks, cron, and the web app.

The control surface also mirrors the active embedded Pi runtime into the blackboard's `pi_sessions` table. The JSONL file remains Pi's native session history; SQLite stores the runtime lookup row needed to answer “which Pi session is active right now?”

The control surface serializes all inbound prompts. Only one Pi turn runs at a time. Additional inbound events wait in a queue and are processed in order.

## Web Client

The web app is more than a chat window — it provides operational visibility into the running system.

| Feature | Description |
|---------|-------------|
| Pi chat | Real-time streaming of Pi responses via WebSocket (text deltas, tool execution, turn events). Supports image attachments. |
| Session browser | Browse all Claude Code sessions tracked in the blackboard. View status, cwd, model, permissions, tmux state. |
| Transcript viewer | Paginated reading of Claude Code session transcript files (cursor-based pagination). |
| Direct message injection | Send a message directly into a Claude Code session's tmux pane (POST `/sessions/:id/message`). Includes inference verification and retry logic. |
| WhatsApp controls | Start/stop the WhatsApp daemon from the web UI (POST `/runtime/whatsapp/start|stop`). Shows daemon PID, status, auth state. |
| Settings | Theme (light/dark/system), base URL, bearer token config. Persisted to localStorage. |

Web-originated user messages are automatically mirrored to WhatsApp with a `[Web] User` prefix so the conversation stays in sync across channels.

## Maintenance Loop

A background loop runs every 60 seconds and performs deterministic housekeeping:

- Blackboard health check
- WhatsApp daemon status refresh
- Mark stale Claude Code sessions (exceeding `stallMinutes` threshold)
- Clean up idle sessions (24h+ since last activity) and kill their tmux sessions
- Detect stuck queue turns (exceeding `toolTimeoutMinutes` threshold)

## Hook Event Filtering

Not all hook events are forwarded to Pi. The runtime filters:

- **SessionStart**: only processes sessions with `agent_managed=true` or sessions matching Pi's own session ID. Other sessions are ignored.
- **Stop / SessionEnd**: only processes sessions already known to the blackboard. Unknown sessions return `filtered=true`.

## Design Decisions

**Single embedded Pi.** The control surface is the only place where Pi is embedded. The web app is a thin client, cron is a trigger, and hooks are event forwarders.

**HTTP on loopback.** Hooks, cron, the web app, and the WhatsApp daemon can all speak to the control surface over localhost HTTP/WS.

**WhatsApp daemon stays separate, but is app-owned.** Baileys needs its own persistent socket to WhatsApp servers. The daemon remains a transport process, not a second orchestrator, and the control surface is responsible for bringing it up as part of app startup.

**Claude Code launches use the CLI in tmux.** Managed sessions are interactive Claude Code sessions started inside tmux with Autonoma metadata passed via environment variables. The first `SessionStart` hook records that metadata in the blackboard.

**Todoist is a skill concern.** The control surface does not add custom Todoist infrastructure. Pi uses the existing Todoist skill when workflow logic needs it.

## Dependencies

- Pi SDK (`@mariozechner/pi-coding-agent`)
- Blackboard (Feature #2)
- WhatsApp Channel (Feature #4)
- Installer (Feature #1)

## Constraints

- Single user, single Pi instance for v1
- Server binds to localhost only
- Bearer-token auth for mutating endpoints (`/message`, `/hook/:event`, `/stop`, `/sessions/:id/message`, `/runtime/whatsapp/*`) and WebSocket (via header or `token` query param). Token is auto-generated UUID on first run, stored in `config.json`.
- Read-only `/api/*` endpoints (`/api/sessions`, `/api/pi/history`, `/api/sessions/:id/transcript`) are unauthenticated — acceptable because the server binds to localhost only
- Pi uses Anthropic API by default, configurable

## Files Touched

| File/Dir | Purpose |
|----------|---------|
| `~/.autonoma/control-surface/` | Server runtime: PID, logs, state |
| `~/.autonoma/control-surface/sessions/` | Pi session JSONL |
| `~/.autonoma/control-surface/agent/` | Pi prompt, skills, extensions, auth/models |
| `~/.autonoma/config.json` | Port, tokens, thresholds, model config |
| `~/.autonoma/logs/` | `control-surface.log` |
| `~/.autonoma/blackboard.db` | SQLite database |
| `~/.autonoma/whatsapp/auth/` | Baileys auth data |
| `~/.autonoma/whatsapp/daemon.sock` | Unix socket for daemon IPC |
| `~/.autonoma/whatsapp/daemon.pid` | Daemon PID file |
| `~/.autonoma/hooks/` | Hook script (`hook-post.mjs`) that POSTs to the control surface; control surface owns blackboard writes |
