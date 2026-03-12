# Spec: WhatsApp Channel

Bidirectional WhatsApp messaging via Baileys for Pi agent outreach and user replies.

## Context

The control-surface Pi agent needs to reach the user away from the terminal. WhatsApp is the primary channel. This spec covers: a background daemon maintaining a persistent WhatsApp Web connection, a CLI wrapper for send/poll/status over Unix socket IPC, and inbound/outbound storage in the shared blackboard.

Baseline transport viability is already proven locally: the daemon can run, outbound messages can reach WhatsApp, and inbound replies can reach the app path. Remaining work is runtime ownership, control-surface integration, and hardening.

## Dependencies

- `@whiskeysockets/baileys` v7.0.0-rc.9, `qrcode-terminal`, `pino`
- Node.js 17+
- Blackboard (Feature #2) for message storage
- Control Surface (Feature #6) for real-time forwarding
- OpenClaw as reference only

## Architecture

### Daemon + CLI Hybrid

Baileys requires a persistent WebSocket. A background daemon maintains the connection; a thin CLI wrapper communicates via Unix socket IPC.

```text
autonoma-wa send/poll/status ──> Unix socket ──> [daemon: Baileys WS] ──> WhatsApp
                                                │
                                                ├─> blackboard.whatsapp_messages
                                                └─> control surface POST /message (best effort for inbound)
```

- **Daemon**: long-running Node.js process at `~/.autonoma/whatsapp/daemon.sock`, PID at `daemon.pid`
- **CLI**: sends commands to daemon. If daemon is down, returns an actionable error.
- **Control surface** remains the only embedded Pi host. The daemon is transport only.
- **Lifecycle owner**: the control surface manages the daemon as a dependent runtime process. Starting the app starts the daemon; runtime endpoints may stop/start it manually.

### Auth Persistence

Use Baileys `useMultiFileAuthState` at `~/.autonoma/whatsapp/auth/`, hardened with backup/restore and restrictive permissions.

### Connection Lifecycle

1. **First run**: `autonoma-wa auth` — QR in terminal or pairing code for headless
2. **Normal**: daemon auto-connects from persisted creds
3. **401 (session expired)**: stop retrying, write alert to blackboard, notify via web app/control surface
4. **Transient disconnect**: exponential backoff
5. **515 (WA restart)**: immediate single reconnect

## Functional Requirements

### FR-1: Send Outbound Message

`autonoma-wa send "message" [--context session-12]`

CLI sends to daemon; daemon sends via Baileys with a short typing delay. On success: write outbound row to `whatsapp_messages`. On transient failure: single retry. On persistent failure: return error and write failure state to the blackboard. Single configured recipient in `~/.autonoma/whatsapp/config.json`.

If the daemon is down when a send is requested, the control surface/runtime may attempt one automatic daemon start before failing the send.

### FR-2: Receive Inbound Messages

Daemon listens on `messages.upsert` (`notify` only). Filter to configured recipient JID. Extract text, insert inbound row into `whatsapp_messages`, mark read, and best-effort POST the message to the control surface.

### FR-3: Poll for Replies

`autonoma-wa poll [--ack]`

Query pending inbound messages from the blackboard and return JSON to stdout. `--ack` marks them processed.

### FR-4: Initial Authentication

`autonoma-wa auth [--pairing-code]`

V1 authentication UX is manual and terminal-driven.

Behavior:
- user runs the auth command manually when WhatsApp credentials are missing or expired
- the command starts the daemon in auth mode
- QR is displayed in the terminal, or pairing code is shown for headless use
- browser-based QR/pairing UX is explicitly deferred to a later feature

### FR-5: Daemon Management

`start` / `stop` / `status` — start daemon in background, graceful shutdown, report connection state.

Runtime policy:
- the control surface ensures the daemon is running during app startup
- the web app may call control-surface runtime endpoints to stop or restart it
- there is no separate launchd/pm2-managed always-on WhatsApp service in v1

### FR-6: Structured Prompts

Decision messages use numbered choices with `context_ref`. V1 reply matching is simple but durable:
- outbound message stores `context_ref` in `whatsapp_messages`
- control surface/runtime may also create a `pending_actions` row in the blackboard
- inbound replies are matched against the most recent unresolved pending action or message context

## Consequential Interface: Blackboard Ownership

The `whatsapp_messages` table is part of the shared blackboard schema and is defined by the Blackboard feature/spec. This feature writes and reads that table; it does not own schema definition independently.

**Outbound lifecycle:** `pending -> sent -> delivered/failed`

**Inbound lifecycle:** `pending -> processed`

## Anti-Ban

Low-volume, single-recipient use only. Use light presence simulation, avoid unknown contacts, and keep message frequency low.

## Security

- auth files: restrictive permissions
- Unix socket: local-only restrictive permissions
- config file: restrictive permissions, contains recipient phone number

## Locked Decisions

- baseline daemon/send/reply transport is treated as locally verified
- keep the current Baileys-based approach for v1; the remaining work is hardening, not first-time feasibility
- v1 context matching stays simple: match against the most recent unresolved pending action or message context
- testing should focus on IPC/blackboard flows plus manual WhatsApp smoke verification
