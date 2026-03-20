# Feature: Cron Scheduler

Periodic state check for the Autonoma app. Cron's job is not to cold-start a separate orchestrator every tick; its job is to classify machine state from the blackboard, make sure the control surface and embedded Pi session exist when needed, and inject the right Pi prompt only when there is something worth orchestrating.

## Problem

Autonoma is meant to feel always-on. If the control surface or embedded Pi session dies, the system becomes passive: no proactive outreach, no periodic review of notes/tasks, no WhatsApp nudges.

A lightweight scheduler is needed to:
- check whether the app is already healthy
- inspect blackboard state to detect true idle windows where no Claude Code session is inferencing
- detect stale Claude Code sessions whose hook stream stopped advancing and may need tmux verification
- start the control surface if it is needed and not already running
- inject a standard proactive prompt only when the machine is truly idle and Pi is not already active
- inject a different verification prompt when a Claude Code session looks stale enough to need Pi-led tmux checks
- exit politely when everything is already running or there is nothing actionable to wake Pi for

## Goals

1. Run every **10 minutes** by default
2. Work on **macOS and Linux**
3. Detect whether the control surface is already running and healthy
4. Read blackboard state directly to classify Claude Code sessions as idle/ended vs stale
5. Treat the machine as proactively actionable only when no Claude Code session is actively inferencing and Pi is not already running
6. If the app is down but Pi should be woken, launch the control surface, which in turn launches dependent runtime processes like the WhatsApp daemon
7. After a fresh launch into a true idle window, enqueue one standard proactive prompt asking Pi to infer what the user may want next and whether to reach out
8. If a Claude Code session becomes stale, enqueue a different prompt asking Pi to verify tmux reality and reconcile state
9. Never create a second embedded Pi instance or a separate cron-owned Pi session

## Design

### Invocation

Cron is a deterministic runtime trigger. It does not host Pi and it does not perform orchestration reasoning itself, but it does inspect blackboard state before deciding whether to wake Pi.

Every tick:
1. read `~/.autonoma/config.json`
2. inspect blackboard state to classify Claude Code sessions; mark `working` sessions as `stale` when their `last_event_at` exceeds `stallMinutes` and no long-running tool is active
3. if there is no actionable idle/stale condition, exit `0`
4. call `GET /status` on the control surface to check Pi state
5. if Pi is already active, exit `0` (no duplicate prompt)
6. if the control surface is not healthy, start it via `~/.autonoma/bin/autonoma-up start`
7. wait for Pi readiness (up to 30 seconds)
8. inject the appropriate prompt into Pi via `POST /message` (authenticated with `controlSurfaceToken`, retries once on failure):
   - proactive idle-work prompt when all Claude Code sessions are stopped/idle and the machine is in a true idle window
   - stale-session verification prompt when one or more Claude Code sessions look suspect because hook activity stopped advancing
9. exit `0`

### Standard Prompt

Cron sends one of two deterministic prompts, depending on what it saw in the blackboard.

**Idle-work prompt** — used when all Claude Code sessions appear stopped or idle and the machine is in a true idle window:

```text
[Cron idle check] All tracked Claude Code sessions appear stopped or idle. Review the latest session state, recent transcripts, Obsidian context, and Todoist context. Figure out what the user most likely wants to tackle next. If an obvious next prompt exists for an idle Claude session, consider continuing it. If parallel Claude Code work would help, prepare a concrete suggestion and ask the user for confirmation before launching anything significant.
```

**Stale-session verification prompt** — used when one or more Claude Code sessions look suspect because hook activity stopped advancing:

```text
[Cron stale session check] One or more tracked Claude Code sessions are stale based on blackboard state. Verify real tmux state, reconcile SQLite state if needed, and decide whether the session should return to working, stay idle, be ended, or be re-prompted.
```

This keeps the cron behavior deterministic while leaving the actual orchestration reasoning to Pi.

### Existing Healthy Runtime

If the control surface is up and the embedded Pi session is already active, cron does not enqueue another prompt for the same tick.

That includes cases where:
- Pi is already working
- Pi is idle inside the running control surface
- Pi is waiting for user input
- Pi has pending actions and is intentionally paused

Cron should not generate duplicate prompts just because the scheduler fired.

### Ownership Boundary

- **Cron owns:** periodic blackboard check, stale-session marking, actionable-state classification, launch-if-needed, and deterministic prompt injection
- **Control surface owns:** the embedded Pi session, queueing, health reporting, dependent processes, and runtime supervision
- **Pi owns:** tmux verification, transcript reading, next-step reasoning, user-facing suggestions, and any permission-gated outreach

### Platform Support

- **macOS:** launchd user agent
- **Linux:** `systemd --user` timer

Both schedule the same `~/.autonoma/cron/autonoma-checkin.sh` script. A backward-compatible wrapper `~/.autonoma/cron/scheduler.sh` also exists and `exec`s the main script.

### Configuration

The following keys in `~/.autonoma/config.json` affect cron behavior:

| Key | Type | Default | Purpose |
|-----|------|---------|---------|
| `stallMinutes` | int | `15` | Minutes since last hook event before a `working` session is marked `stale` |
| `toolTimeoutMinutes` | int | `60` | Minutes since last tool start; sessions with a recent tool start are not marked stale even if `stallMinutes` is exceeded |
| `controlSurfaceToken` | string | — | Bearer token for `POST /message`. Required; prompt injection is skipped without it |
| `controlSurfaceHost` | string | `127.0.0.1` | Host for control surface API calls |
| `controlSurfacePort` | int | `18820` | Port for control surface API calls |

### Stale Detection Logic

A `working` session is marked `stale` when both conditions are met:
1. `last_event_at` is older than `stallMinutes` (default 15 min)
2. `last_tool_started_at` is either NULL or older than `toolTimeoutMinutes` (default 60 min)

This prevents marking sessions as stale while a long-running tool (e.g. a build or test suite) is executing.

## Dependencies

- Installer (scheduler registration on macOS + Linux)
- Control Surface (health endpoint, startup target, embedded Pi host)
- Blackboard (runtime state visibility)
- Todoist skill (workflow context)
- Obsidian notes/vault access through Pi tools and skills
