# Spec: Cron Scheduler

Periodic state check for the Autonoma app. Cron does not run its own Pi session. It reads blackboard state directly, decides whether the machine is in a true idle window or has suspiciously stale Claude Code sessions, ensures the control surface is running when Pi needs to be woken, and injects the appropriate prompt into the embedded Pi runtime.

## Context

Autonoma's architecture depends on one long-running control surface hosting one persistent embedded Pi session. If that process dies, proactive behavior stops. The cron scheduler is the recovery loop.

It is intentionally thin in orchestration terms:
- no second Pi host
- no cold-start workflow reasoning inside cron
- direct blackboard inspection is allowed so cron can decide whether waking Pi is warranted
- no duplicate prompting when the app is already healthy and Pi is already active

## Dependencies

- Control Surface (health endpoint, startup target, embedded Pi host)
- Installer (register the schedule on macOS and Linux)
- Blackboard (`pi_sessions` runtime visibility)

## Functional Requirements

### FR-1: Cross-Platform Schedule

The scheduler must run every **10 minutes** on both supported platforms:

- **macOS:** launchd user agent
- **Linux:** user crontab entry

Both invoke the same script:

```text
~/.autonoma/cron/autonoma-checkin.sh
```

V1 default cadence:
- minute `*/10` on Linux
- equivalent 10-minute interval on macOS

The interval is configurable later through `~/.autonoma/config.json`, but the default spec value is 10 minutes.

### FR-2: Blackboard Classification Contract

Each cron tick performs this sequence before deciding whether to wake Pi:

1. read `~/.autonoma/config.json`
2. inspect blackboard state for Claude Code sessions
3. classify the machine into one of these states:
   - **no-action** — at least one Claude Code session appears actively inferencing, or there is otherwise no reason to wake Pi
   - **idle-window** — all tracked Claude Code sessions appear ended or idle, so Pi may proactively reason about next work
   - **stale-window** — one or more Claude Code sessions are stale, or still look `working` but hook timestamps have stopped advancing long enough that they should now be marked stale and verified
4. only if the result is `idle-window` or `stale-window` should cron proceed to the control-surface health check and possible Pi wake-up

V1 classification inputs come from SQLite, not tmux scraping:
- `sessions.status`
- `sessions.last_event_at`
- `sessions.last_tool_started_at`
- `sessions.ended_at`

V1 stale rule:
- if a Claude Code session is still marked `working` but `last_event_at` is older than 15 minutes, mark it `stale` in SQLite and wake Pi with the stale-session verification prompt

V1 idle-window rule:
- if all relevant Claude Code sessions are `idle`, `ended`, or absent, and none are actively inferencing, cron may wake Pi with the proactive idle-work prompt

### FR-3: Launch-if-Needed Behavior

If cron classified the machine as `idle-window` or `stale-window`, it then checks whether the control surface and embedded Pi session are already available.

1. issue `GET http://127.0.0.1:{controlSurfacePort}/status`
2. if the control surface is up and reports an active embedded Pi session, do not enqueue another cron prompt for the same tick; exit `0`
3. if the control surface is down or reports no active embedded Pi session, launch the app using the app startup script:

```text
~/.autonoma/bin/autonoma-up
```

4. `autonoma-up` is responsible for starting the control surface
5. the control surface startup path is responsible for also starting dependent runtime processes such as the WhatsApp daemon
6. cron waits for readiness by polling `/status` for up to 30 seconds
7. if readiness is reached, continue to FR-4
8. if readiness is not reached, append an error to `~/.autonoma/logs/cron.log` and exit `0`

Cron should not fail loudly or spin forever. Missing readiness is logged for later inspection.

### FR-4: Prompt Injection After Recovery

Cron sends a prompt only when:
- it classified the machine as `idle-window` or `stale-window`, and
- it had to launch or re-establish the control surface/Pi runtime during this tick

For an `idle-window`, `POST /message` body:

```json
{
  "source": "cron",
  "text": "[Cron idle check] All tracked Claude Code sessions appear stopped or idle. Review the latest session state, recent transcripts, Obsidian context, and Todoist context. Figure out what the user most likely wants to tackle next. If an obvious next prompt exists for an idle Claude session, consider continuing it. If parallel Claude Code work would help, prepare a concrete suggestion and ask the user for confirmation before launching anything significant.",
  "metadata": {
    "kind": "idle-window-check"
  }
}
```

For a `stale-window`, `POST /message` body:

```json
{
  "source": "cron",
  "text": "[Cron stale session check] One or more tracked Claude Code sessions are stale based on blackboard state. Verify real tmux state, reconcile SQLite state if needed, and decide whether the session should return to working, stay idle, be ended, or be re-prompted.",
  "metadata": {
    "kind": "stale-session-check"
  }
}
```

These prompts are intentionally deterministic. Pi performs the actual tmux checks, transcript reading, state reconciliation, and user-facing reasoning.

### FR-5: No Duplicate Check-ins While Pi Is Already Active

When the app is already healthy and Pi is already active, cron must **not** enqueue another prompt for the same tick.

This includes cases where Pi is:
- idle inside the running control surface
- in the middle of a turn
- waiting for user input
- holding unresolved pending actions

The scheduler may classify the machine from SQLite on every tick, but it should only wake Pi when Pi is not already active and the machine state is actionable.

### FR-6: Script Shape

`~/.autonoma/cron/autonoma-checkin.sh` should be a small shell script that:

- uses `jq` to read `controlSurfacePort` and `controlSurfaceToken`
- inspects SQLite directly to classify the current Claude-session state
- uses `curl` with short timeouts
- logs to `~/.autonoma/logs/cron.log`
- always exits `0` after logging recoverable issues

Pseudo-flow:

```bash
load config
classify blackboard state
if state is no-action; then
  log "no actionable idle/stale condition"
  exit 0
fi

if /status says healthy with active pi session; then
  log "pi already active; no duplicate cron prompt"
  exit 0
fi

run ~/.autonoma/bin/autonoma-up
wait for /status readiness
if ready; then
  POST idle-work or stale-session prompt
else
  log failure
fi

exit 0
```

### FR-7: Consequential Interfaces

Cron depends on both SQLite and control-surface behaviors.

#### SQLite blackboard
Minimum session fields used by cron classification:
- `status`
- `last_event_at`
- `last_tool_started_at`
- `ended_at`

Cron uses these fields only to decide whether Pi should be woken and which deterministic prompt to inject. Cron does not inspect tmux directly.

#### `GET /status`
Minimum fields used by cron after it has decided Pi should be woken:

```json
{
  "ok": true,
  "pi": {
    "sessionId": "abc-123",
    "busy": false
  }
}
```

#### `POST /message`
Used only after recovery/startup in an actionable idle/stale state.

Auth:
```text
Authorization: Bearer {controlSurfaceToken}
```

### FR-8: Installer Responsibilities

Installer must register the 10-minute scheduler on both platforms.

#### macOS
Install:
```text
~/Library/LaunchAgents/com.autonoma.scheduler.plist
```

#### Linux
Install one marked crontab entry, for example:

```cron
*/10 * * * * /bin/bash "$HOME/.autonoma/cron/autonoma-checkin.sh" # autonoma-scheduler
```

Uninstaller removes only Autonoma's scheduled entry.

## Non-Goals

- no second embedded Pi instance
- no cron-owned cold-start Pi session
- no direct tmux inspection from cron
- no direct Todoist or Obsidian reasoning in cron itself
- no retry storm if the app is broken
- no user-facing notification directly from cron

## Locked Decisions

- readiness polling does not wait for WhatsApp daemon health in v1
- control-surface readiness plus active Pi session is enough before sending the cron-selected prompt
- cron classifies Claude-session state from SQLite, not tmux
- cron remains a deterministic wake-up gate, not an orchestration brain
