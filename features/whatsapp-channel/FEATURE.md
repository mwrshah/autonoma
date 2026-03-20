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

OpenClaw's debouncing, echo detection, lane concurrency, block streaming — not needed. Autonoma sends low-frequency, short messages.

### Architecture

Lightweight Node.js process: connects via Baileys, exposes `send(text)` and `onMessage(callback)`, persists auth at `~/.autonoma/whatsapp/auth/`. It is a transport daemon owned by the app runtime: starting the control surface should also ensure this daemon is up. CLI interface for manual use:

```bash
autonoma-wa send "3 sessions running. 'search UI' stalled — restart? (y/n)"
```

### Message Routing

All message delivery is push-based — no polling anywhere in the pipeline.

**Outbound**: Pi calls `send_whatsapp` tool → control surface sends IPC command to daemon → daemon delivers via Baileys.
**Inbound**: Baileys `messages.upsert` event fires → daemon extracts message body → daemon immediately forwards to control surface via HTTP POST `/message` → control surface enqueues into Pi's turn queue. Blackboard persistence (dedup, context enrichment, history) happens as a secondary concern after forwarding, wrapped in error handling so a database failure never drops a message.

### Authentication

First setup: QR code scan. Baileys persists credentials, auto-reconnects. On expiry, agent notifies via web app.

## Dependencies

- Baileys npm package, Node.js
- OpenClaw as reference (not runtime dependency)
- Blackboard (inbound message storage)

## Constraints

- Single recipient for v1; text-only; low frequency (few messages per 15-min cycle)
- Handle rate limits and connection drops gracefully
