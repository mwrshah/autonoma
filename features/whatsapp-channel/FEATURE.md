# Feature: WhatsApp Channel

Bidirectional WhatsApp via Baileys — proactive outreach and user replies when away from terminal or web app.

## Problem

The cron scheduler must reach the user away from the computer. Sessions stall, tasks come due, the agent needs permission. WhatsApp is the primary channel and fastest to respond on.

## Goals

1. Send messages from Pi agent to user's WhatsApp (outbound)
2. Receive replies, route back to agent context (inbound)
3. Structured options: numbered choices, yes/no prompts
4. Persistent Baileys session — no re-auth per message
5. Minimal: command channel for the orchestrator, not a chat platform

## Design

### Baileys Integration

OpenClaw (`~/Documents/coded-programs/openclaw`) has a mature Baileys layer. V1 extracts a minimal subset:
- **Session**: connect to WhatsApp Web, persist auth for auto-reconnect
- **Send**: text to configured phone number
- **Receive**: listen for replies from user's number

OpenClaw's debouncing, lane concurrency, block streaming — not needed. Autonoma sends low-frequency, short messages. Echo detection is implemented (see below).

### Architecture

Standalone Node.js daemon (`src/whatsapp/daemon.ts`): connects via Baileys, communicates with the control surface over a Unix domain socket (`~/.autonoma/whatsapp/daemon.sock`). Persists auth at `~/.autonoma/whatsapp/auth/` with automatic backup/restore (`src/whatsapp/auth.ts`). The control surface auto-starts the daemon on first WhatsApp command if it isn't already running.

Configuration lives at `~/.autonoma/whatsapp/config.json` with fields: `recipientJid`, `pairingPhoneNumber`, `typingDelayMs` (default 800ms), `daemonStartupTimeoutMs` (default 8000ms).

CLI (`src/whatsapp/cli.ts`) for manual use:

```bash
autonoma-wa send "message" [--context ref]
autonoma-wa start | stop | status
autonoma-wa auth [--pairing-code]
```

### Message Routing

All message delivery is push-based — no polling anywhere in the pipeline.

**Outbound**: Control surface calls `sendWhatsAppCommand()` → IPC via Unix socket (`sendDaemonCommand`) → daemon creates outbound record in blackboard, sends typing indicator, delivers via Baileys, marks sent/failed. Delivery receipts (`message-receipt.update`) update the blackboard record.

**Inbound**: Baileys `messages.upsert` event fires → daemon filters by recipient JID → `persistInboundMessage()` checks echo window and dedup → forwards to control surface via HTTP POST `/message` → control surface enqueues into Pi's turn queue. Blackboard persistence (dedup, context enrichment, history) happens as a secondary concern after forwarding, wrapped in error handling so a database failure never drops a message. Daemon auto-marks inbound messages as read.

**Web→WA mirroring**: When users send messages via the web app, the control surface mirrors them to WhatsApp with a `User (web):` prefix so WA shows the complete conversation. Pi responses are also auto-surfaced to WA with a `B-bot:` prefix.

### Echo Detection

Outbound messages arriving back via `messages.upsert` (as `fromMe`) are filtered by `shouldFilterRecentOutboundEcho()` — checks whether a recent outbound message exists in the blackboard within a 5-second window. Duplicate inbound messages are also caught by `wa_message_id` lookup before forwarding.

### Authentication

First setup: QR code scan or pairing code (`autonoma-wa auth --pairing-code`). Baileys persists credentials with automatic backup/restore; auto-reconnects with exponential backoff (up to 30s). On auth expiry (disconnect code 401/loggedOut), daemon creates a `whatsapp_auth_expired` pending action in the blackboard.

### Connection Management

Daemon tracks connection state (`connecting`, `connected`, `reconnecting`, `auth_required`, `logged_out`, `stopped`) and reconnects automatically. Restart-required disconnects (code 515) get one immediate retry; other disconnects use exponential backoff. Status is exposed via the `status` IPC command and cached by the control surface for the web UI.

## Dependencies

- `@whiskeysockets/baileys` (WhatsApp Web protocol)
- `qrcode-terminal` (QR display for auth)
- Blackboard (message storage, echo dedup, pending actions, delivery tracking)

## Constraints

- Single recipient; text-only; low frequency (few messages per 15-min cycle)
- Handle rate limits and connection drops gracefully
