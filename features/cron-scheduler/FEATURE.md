# Feature: Cron Scheduler

Periodic health-gated prompt injection for the Autonoma control surface. Cron is a dumb external timer that pings a running control surface. The control surface decides whether to act based on its own health state, circuit breakers, and session classification. If the surface is down, nothing happens — cron never starts processes.

## Problem

Autonoma benefits from periodic proactive behavior: checking for stale Claude Code sessions, reviewing Todoist for next steps, surfacing idle-window suggestions. But this proactive loop must be safe:

- It must not restart a stopped control surface (user stopping the surface is an intentional kill switch)
- It must not enqueue prompts when the system is unhealthy (rate limits, LLM errors, WhatsApp disconnected)
- It must not duplicate prompts when Pi is already active
- It must not hide scheduling state inside in-process timers that are invisible from the outside
- It must be observable and controllable through standard OS tools

## Goals

1. **External timer only.** A systemd user timer (Linux) or launchd agent (macOS) fires a single HTTP request to the control surface. No in-process `setInterval` loops.
2. **No cold-start.** If the control surface is not running, the HTTP call fails and cron exits silently. Cron never spawns processes.
3. **Health-gated.** The control surface checks internal health gates before enqueuing any prompt. If any gate fails, the tick is skipped with a logged reason.
4. **Circuit breakers in SQLite.** Persistent error flags (rate limits, repeated LLM failures) prevent cron from burning tokens into known failures. Flags are set by the control surface when errors occur and cleared by expiry or manual reset.
5. **Observable.** The cron endpoint returns a structured response indicating what it did and why. systemd journal / launchd logs capture every tick.
6. **Single cron implementation.** One bash script, one endpoint, one decision path. No duplicate TypeScript cron loop.

## Design

### External Timer

The systemd timer (or launchd agent) runs every N minutes (default 5) and executes a minimal bash script:

```bash
#!/usr/bin/env bash
curl -sf -X POST \
  -H "Authorization: Bearer ${AUTONOMA_TOKEN}" \
  "http://127.0.0.1:18820/cron/tick" \
  || true
```

That's it. If the surface is down, `curl` fails, the script exits 0. No retries, no process spawning, no SQLite access from bash.

### Control Surface Endpoint

`POST /cron/tick` (bearer auth) is a new endpoint on the control surface. When it receives a tick, it runs through a gate check sequence. The first failing gate stops the sequence and returns a skip response.

#### Gate Sequence

1. **Pi not active.** If Pi is currently processing a turn (`active` status), skip — no duplicate prompt.
2. **Pi not ended/crashed.** If the Pi session has terminated, skip — nothing to enqueue to.
3. **WhatsApp connected.** If WhatsApp is disconnected or in an error state, skip — Pi can't reach the user for confirmation, so proactive work is pointless.
4. **No active circuit breakers.** Check `health_flags` for unexpired error flags. If any blocking flag is set, skip.
5. **Classify sessions.** Query the blackboard for stale and idle sessions, then enqueue the appropriate prompt.

#### Response Shape

```
POST /cron/tick → 200
{
  "ok": true,
  "action": "enqueued" | "skipped",
  "reason": "idle_check" | "stale_check" | "pi_active" | "pi_ended" | "whatsapp_disconnected" | "circuit_breaker" | "no_actionable_state",
  "flags": ["rate_limit", ...]    // only present when action=skipped due to circuit_breaker
}
```

Always returns 200 (the tick itself succeeded; the decision was to skip or enqueue). Non-200 only for auth failures or server errors.

### Circuit Breaker: `health_flags` Table

A new SQLite table tracks error conditions that should suppress cron activity:

| Column | Type | Purpose |
|--------|------|---------|
| `flag` | TEXT PK | Identifier: `rate_limit`, `llm_error`, `pi_crash_loop`, etc. |
| `reason` | TEXT | Human-readable description of what triggered the flag |
| `set_at` | TEXT | ISO timestamp when the flag was set |
| `expires_at` | TEXT NULL | ISO timestamp for auto-expiry. NULL = manual clear only |
| `cleared_at` | TEXT NULL | Set when manually cleared. Non-null = inactive |

**Setting flags:** Any part of the control surface that detects a blocking error condition calls a shared `setHealthFlag(flag, reason, ttlMinutes?)` function. Examples:
- LLM provider returns 429 → set `rate_limit` with 15-minute TTL
- Pi crashes 3+ times in an hour → set `pi_crash_loop` with 60-minute TTL
- Repeated LLM inference errors → set `llm_error` with 30-minute TTL

**Checking flags:** The cron endpoint queries for active flags: `WHERE cleared_at IS NULL AND (expires_at IS NULL OR expires_at > datetime('now'))`. Any result = circuit open = skip.

**Clearing flags:** Flags clear in three ways:
1. TTL expiry (checked at query time, no background job)
2. Manual clear via a future admin endpoint or Pi tool
3. Control surface restart clears all flags (fresh start = clean slate)

### Stale Detection

Stale detection moves fully into the control surface endpoint. A `working` session is classified as stale when both conditions are met:

1. `last_event_at` is older than `stallMinutes` (default 15 min)
2. `last_tool_started_at` is either NULL or older than `toolTimeoutMinutes` (default 60 min)

The endpoint marks matching sessions as `stale` in the blackboard before deciding which prompt to enqueue.

### Standard Prompts

Two deterministic prompts, same as before. The control surface selects which one based on session classification.

**Stale-session prompt** — when one or more sessions are classified stale:

```text
[Cron stale session check] N session(s) appear stale:
  - <session_id> (<tmux_name>) last activity: <timestamp>
Verify real tmux state, reconcile SQLite state if needed, and decide whether each session should return to working, stay idle, be ended, or be re-prompted.
```

**Idle-work prompt** — when all sessions are stopped/idle and no stale sessions exist:

```text
[Cron idle check] All tracked Claude Code sessions appear stopped or idle. Review the latest session state, recent transcripts, Obsidian context, and Todoist context. Figure out what the user most likely wants to tackle next. If an obvious next prompt exists for an idle Claude session, consider continuing it. If parallel Claude Code work would help, prepare a concrete suggestion and ask the user for confirmation before launching anything significant.
```

### Ownership Boundary

| Owner | Responsibility |
|-------|---------------|
| **systemd/launchd timer** | Fire HTTP request on schedule. Nothing else. |
| **Bash script** | Single authenticated `curl` call. No logic, no SQLite, no process management. |
| **Control surface `/cron/tick`** | Gate checks, session classification, stale marking, prompt selection, enqueue decision. |
| **`health_flags` table** | Persistent circuit breaker state. Set by any component, checked by cron endpoint. |
| **Pi** | All orchestration reasoning: tmux verification, transcript reading, next-step decisions, user-facing suggestions. |

### What Gets Removed

- **`src/control-surface/cron.ts`** — the in-process `setInterval` loop. Replaced by the endpoint.
- **`cronTimer` in `runtime.ts`** — no more in-process timer management.
- **`cronEnabled` config key** — not needed. The systemd timer being enabled/disabled is the feature flag.
- **`cronIntervalMinutes` config key** — the interval is owned by the systemd timer unit, not the app config.
- **`.autonoma/cron/autonoma-checkin.sh` complexity** — rewritten to a 3-line curl script. No blackboard access, no `autonoma-up`, no `jq`, no retry logic.

### Platform Support

- **Linux:** `systemd --user` timer + service. Installed/uninstalled by the Autonoma installer.
- **macOS:** launchd user agent plist. Same curl script, same endpoint.

Both are registered by the installer and controllable via standard OS commands (`systemctl --user enable/disable`, `launchctl load/unload`).

### Configuration

Cron-relevant config in `~/.autonoma/config.json` is reduced to:

| Key | Type | Default | Purpose |
|-----|------|---------|---------|
| `stallMinutes` | int | `15` | Minutes before a silent `working` session is marked `stale` |
| `toolTimeoutMinutes` | int | `60` | Grace period for long-running tools before stale marking applies |
| `controlSurfaceToken` | string | — | Bearer token for the `/cron/tick` endpoint |

Timer interval is configured in the systemd unit / launchd plist, not in app config.

## Dependencies

- Installer (systemd/launchd timer registration)
- Control Surface (hosts the `/cron/tick` endpoint)
- Blackboard (`health_flags` table, session state queries)
