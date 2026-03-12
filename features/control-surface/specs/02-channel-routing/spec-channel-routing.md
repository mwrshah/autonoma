# Spec: Channel Routing

Wiring all inbound sources into the control surface and updating existing components to push events to Pi instead of only writing to SQLite.

## Context

Spec 01 builds the server and embedded Pi. This spec connects the real channels: WhatsApp daemon forwards inbound messages, Claude Code hooks POST to the control surface, and cron ticks into it instead of cold-starting Pi.

Each channel adapter is intentionally thin: receive event, POST to `http://127.0.0.1:{port}/message` or `/hook/:event`, done. The control surface handles filtering, formatting, queueing, and Pi injection.

## Dependencies

- Spec 01 (server and embedded Pi)
- WhatsApp daemon (Feature #4)
- Blackboard hook scripts (Feature #2)
- Cron scheduler (Feature #3)

## Functional Requirements

### FR-1: WhatsApp Inbound Forwarding

The WhatsApp daemon writes inbound messages to `whatsapp_messages` in SQLite and also forwards them to the control surface so Pi sees them immediately.

Update `daemon.js` `messages.upsert` handler: after SQLite insert, POST to the control surface:

```javascript
try {
  const resp = await fetch(`http://127.0.0.1:${config.controlSurfacePort}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.controlSurfaceToken}`,
    },
    body: JSON.stringify({
      text: body,
      source: 'whatsapp',
      metadata: {
        wa_message_id: msg.key.id,
        context_ref: contextRef,
      },
    }),
  });
} catch {
  // Control surface down -- message is still in SQLite.
  // Pi can pick it up later via poll_whatsapp / blackboard state.
}
```

Forwarding is best-effort. If the control surface is down, the message is still durable in the blackboard.

### FR-2: Claude Code Hook Forwarding

The hook scripts at `~/.autonoma/hooks/` write events to SQLite via `bb-write.py` and then best-effort POST to the control surface.

The hook payload arrives from Claude Code on stdin. After the SQLite write, the script forwards it:

```bash
CONFIG="$HOME/.autonoma/config.json"
PORT=$(jq -r '.controlSurfacePort // 18820' "$CONFIG")
TOKEN=$(jq -r '.controlSurfaceToken // empty' "$CONFIG")

curl -s -X POST "http://127.0.0.1:${PORT}/hook/${EVENT_NAME}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d "${PAYLOAD}" \
  --connect-timeout 1 \
  --max-time 2 \
  2>/dev/null || true
```

The hook scripts do **not** depend on installer-injected environment variables for control-surface config. They read `~/.autonoma/config.json` directly.

### FR-3: Hook Event Filtering

Not every hook event should reach Pi. The server filters before enqueueing.

**Forward to Pi:**
- `session-start`
- `stop`
- `session-end`

**Do not forward to Pi in v1:**
- `pre-tool-use`
- `post-tool-use`
- `post-tool-use-failure`
- `subagent-start`
- `subagent-stop`

Those still go to the blackboard; they just do not become prompts for Pi.

Rationale:
- `SessionStart` confirms launches and gives Pi awareness of newly started sessions
- `Stop` and `SessionEnd` are high-signal lifecycle changes
- tool events are too noisy for the prompt stream

Server-side filtering:

```typescript
const PI_RELEVANT_EVENTS = new Set(['session-start', 'stop', 'session-end']);

if (!PI_RELEVANT_EVENTS.has(event)) {
  return json({ ok: true, filtered: true });
}
```

### FR-4: Cron Integration

Cron no longer starts Pi directly. It POSTs a check-in message to the control surface:

```bash
#!/bin/bash
# ~/.autonoma/cron/autonoma-checkin.sh

CONFIG="$HOME/.autonoma/config.json"
PORT=$(jq -r '.controlSurfacePort // 18820' "$CONFIG")
TOKEN=$(jq -r '.controlSurfaceToken // empty' "$CONFIG")

if ! curl -s "http://127.0.0.1:${PORT}/status" > /dev/null 2>&1; then
  echo "$(date): Control surface not running" >> "$HOME/.autonoma/logs/cron.log"
  exit 0
fi

curl -s -X POST "http://127.0.0.1:${PORT}/message" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{"text": "Cron check-in. Assess sessions and run relevant workflow skills if anything is actionable.", "source": "cron"}' \
  >> "$HOME/.autonoma/logs/cron.log" 2>&1
```

Cron is a thin trigger, not a second orchestrator.

### FR-5: Thin Web Client Integration

The web app connects to the control surface via WebSocket at `ws://localhost:{port}/ws`.

**Inbound (web → Pi):** browser sends a message event; server formats and enqueues it.

```json
{"type":"message","text":"What's the status of the search UI session?","deliveryMode":"followUp"}
```

Default web behavior is `followUp`. `steer` is an explicit operator override, not the default.

**Outbound (Pi → web):** the control surface streams Pi response deltas and tool events over that same socket.

```json
{"type":"text_delta","delta":"The search UI session "}
{"type":"text_delta","delta":"is running..."}
{"type":"turn_end"}
```

The browser is a thin client. It never hosts a second Pi instance.

### FR-6: Response Routing

The control surface tracks which source triggered each queued turn.

- **WhatsApp trigger** → defaults to `followUp`; Pi may call `send_whatsapp`; no automatic reply if Pi chooses silence
- **Cron trigger** → defaults to `followUp`; Pi may notify via WhatsApp or do nothing
- **Web trigger** → defaults to `followUp`; streamed back to the originating WebSocket client; `steer` is available as an explicit operator override
- **Hook trigger** → defaults to `followUp`; Pi may notify, manage sessions, or do nothing

The runtime routes browser streaming; Pi chooses user-facing actions on other channels.

### FR-7: Daemon Status Integration

The control surface checks WhatsApp daemon health periodically and includes the cached state in `/status`.

If the daemon is down when Pi calls `send_whatsapp`, the tool returns an error. Pi can then choose a fallback, but runtime health reporting is deterministic code.

## Consequential Interface: Hook Script Protocol

Updated hook scripts use dual-write:

```
Hook event → stdin (JSON)
  ├─ bb-write.py → SQLite blackboard
  └─ curl POST → control surface (best effort)
```

The POST is fire-and-forget with a short timeout. If it fails, the event is still durable in SQLite.

## Security

- all inter-process communication is localhost-only
- WhatsApp daemon → control surface: HTTP + bearer token
- hook scripts → control surface: HTTP + bearer token read from `config.json`
- cron → control surface: HTTP + bearer token read from `config.json`
- web app → control surface: v1 uses the same localhost bearer token contract as other callers; a richer browser auth layer can replace it later

## Locked Decisions

- failed hook POSTs use fire-and-forget behavior in v1; SQLite remains the durable source and there is no retry queue
- hook handlers stay `async: true` so Claude Code is not delayed on stop/end/tool events
- rate limiting is out of scope for v1; the queue already prevents concurrent Pi turns
