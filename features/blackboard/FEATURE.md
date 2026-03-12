# Feature: Blackboard (SQLite State Layer)

Real-time, queryable view of Autonoma state on the machine. Fed by Claude Code hooks, the WhatsApp daemon, and the control surface.

## Problem

Multiple sessions run concurrently across tmux and worktrees. The orchestrator, cron, WhatsApp channel, and web app all need answers: which sessions are working, idle, stale, or ended? What task is each on? Which did Autonoma start? What messages are pending? Without shared state, each consumer polls tmux, parses transcripts, and reconciles independently.

## Goals

1. SQLite at `~/.autonoma/blackboard.db`
2. Claude Code hooks write lifecycle events: SessionStart, PreToolUse, PostToolUse, PostToolUseFailure, Stop, SessionEnd, SubagentStart, SubagentStop
3. Events capture common fields (`session_id`, `transcript_path`, `cwd`, `permission_mode`) plus event-specific ones (`tool_name`, `tool_use_id`, `source`, `model`)
4. Autonoma-managed launches are tagged deterministically via launch metadata passed through environment variables and recorded at SessionStart
5. WhatsApp history and reply matching live in the same database
6. Pending user decisions are persisted so reply handling survives process restarts and Pi session compaction
7. Active Pi runtime sessions are tracked separately from Claude Code sessions
8. Fast queries: working, idle, stale, by project, recent events, pending messages, pending actions, active Pi sessions

## Schema Ownership

The blackboard owns the shared SQLite schema for Autonoma. Other features may write specific tables, but the schema contract is defined here.

## Core Tables

### `sessions`

| Column | Type | Description |
|--------|------|-------------|
| session_id | TEXT PK | Claude Code session ID |
| launch_id | TEXT | Autonoma launch correlation ID, if agent-managed |
| tmux_session | TEXT | Tmux session name, if managed |
| cwd | TEXT | Working directory (= worktree path when in a worktree) |
| project | TEXT | Git remote origin normalized to `host/owner/repo`; folder basename if no git remote |
| project_label | TEXT | Human-friendly fallback label, usually `basename(cwd)` |
| model | TEXT | Model in use |
| permission_mode | TEXT | Claude Code permission mode |
| source | TEXT | SessionStart source: startup / resume / clear / compact |
| status | TEXT | working / idle / stale / ended |
| transcript_path | TEXT | JSONL transcript path |
| task_description | TEXT | Managed task description |
| todoist_task_id | TEXT | Todoist task reference, if relevant |
| agent_managed | BOOLEAN | Autonoma-started? |
| session_end_reason | TEXT | SessionEnd reason |
| started_at | DATETIME | First SessionStart |
| ended_at | DATETIME | SessionEnd time |
| last_event_at | DATETIME | Latest event |
| last_tool_started_at | DATETIME | For in-flight tool detection |

### `events`

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | Auto-increment |
| session_id | TEXT FK | → sessions |
| event_name | TEXT | Hook event |
| tool_name | TEXT | Tool name for tool events |
| tool_use_id | TEXT | Links Pre/Post tool events |
| timestamp | DATETIME | Event time |
| payload | TEXT | JSON payload, truncated for noisy tool events |

### `pi_sessions`

Tracks embedded Pi runtime sessions separately from Claude Code sessions. `sessions` is for Claude Code; `pi_sessions` is for the orchestrator runtime itself.

| Column | Type | Description |
|--------|------|-------------|
| pi_session_id | TEXT PK | Pi SDK session ID |
| role | TEXT | orchestrator / cron / user / test |
| status | TEXT | active / idle / ended / crashed |
| runtime_instance_id | TEXT | Control-surface process instance UUID |
| pid | INTEGER | Owning process PID, if known |
| session_file | TEXT | Pi JSONL session file path |
| cwd | TEXT | Pi session working directory |
| agent_dir | TEXT | Pi agent/config directory |
| model_provider | TEXT | Active provider |
| model_id | TEXT | Active model |
| thinking_level | TEXT | Current thinking level |
| started_at | DATETIME | Pi session start time |
| last_prompt_at | DATETIME | Most recent prompt sent to Pi |
| last_event_at | DATETIME | Latest observed Pi activity |
| ended_at | DATETIME | End/crash time |
| end_reason | TEXT | shutdown / restart / crash_detected / replaced / other |

### `whatsapp_messages`

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | Auto-increment |
| direction | TEXT | inbound / outbound |
| wa_message_id | TEXT | WhatsApp message ID |
| remote_jid | TEXT | Remote JID |
| body | TEXT | Message body |
| context_ref | TEXT | Reply-matching context |
| status | TEXT | pending / sent / delivered / processed / failed |
| error_message | TEXT | Failure info |
| created_at | DATETIME | Creation time |
| processed_at | DATETIME | Inbound processing time |

### `pending_actions`

| Column | Type | Description |
|--------|------|-------------|
| action_id | TEXT PK | Stable action/question ID |
| channel | TEXT | whatsapp / web / internal |
| context_ref | TEXT | External correlation tag |
| kind | TEXT | restart_session / approve_change / clarify / other |
| prompt_text | TEXT | What the user was asked |
| related_session_id | TEXT | Optional session link |
| related_todoist_task_id | TEXT | Optional task link |
| status | TEXT | pending / resolved / expired / canceled |
| created_at | DATETIME | When action was created |
| resolved_at | DATETIME | When action was resolved |
| resolution_payload | TEXT | JSON with reply or chosen action |

## Hook Scripts

Hooks write through a shared Python writer (`~/.autonoma/scripts/bb-write.py`) using parameterized SQL and idempotent session updates. `SessionStart` reads launch metadata from environment variables when present:

- `AUTONOMA_AGENT_MANAGED=1`
- `AUTONOMA_LAUNCH_ID`
- `AUTONOMA_TMUX_SESSION`
- `AUTONOMA_TASK_DESCRIPTION`
- `AUTONOMA_TODOIST_TASK_ID`

This gives the blackboard a deterministic handshake between `launch_claude_code` and the first hook event.

## Staleness

Defaults:
- stale after **15 minutes** with no events while the session still appears active
- except when a tool is in flight
- long-running tool considered suspicious after **60 minutes**

Thresholds live in `~/.autonoma/config.json` so behavior is configurable without schema changes.

## Crash Recovery

Crash recovery is deterministic runtime behavior, not model judgment:

1. On control-surface startup, sweep any `working` sessions with stale timestamps and dead tmux sessions
2. On periodic maintenance, re-check stale sessions and mark them `stale` in SQLite when the timestamp rule is met
3. Pi or deterministic runtime reconciliation may later move a stale Claude session back to `working` or to `ended`
4. Never require reboot detection; sweeps are idempotent and safe on every run

## Migration

Blackboard schema is versioned and migration-owned here. It is the shared contract between hooks, the control surface, WhatsApp, cron, and the web app.

Adding `pi_sessions` is a schema migration owned here. Existing generic `agents` ideas should be treated as superseded by the more explicit Pi-runtime table.

## Dependencies

- Installer (hooks in `~/.claude/settings.json`)
- Python 3 (shared writer)
- sqlite3 (init and ad-hoc queries)
- jq (hook script JSON parsing)
