#!/usr/bin/env bash
set -euo pipefail

AUTONOMA_HOME="${AUTONOMA_HOME:-$HOME/.autonoma}"
# shellcheck source=/dev/null
source "$AUTONOMA_HOME/scripts/runtime-common.sh"

LOG_FILE="$AUTONOMA_LOG_DIR/cron.log"
DB_PATH="$(blackboard_path)"
UP_SCRIPT="$AUTONOMA_HOME/bin/autonoma-up"

IDLE_PROMPT='[Cron idle check] All tracked Claude Code sessions appear stopped or idle. Review the latest session state, recent transcripts, Obsidian context, and Todoist context. Figure out what the user most likely wants to tackle next. If an obvious next prompt exists for an idle Claude session, consider continuing it. If parallel Claude Code work would help, prepare a concrete suggestion and ask the user for confirmation before launching anything significant.'
STALE_PROMPT='[Cron stale session check] One or more tracked Claude Code sessions are stale based on blackboard state. Verify real tmux state, reconcile SQLite state if needed, and decide whether the session should return to working, stay idle, be ended, or be re-prompted.'

log_info() {
  append_log "$LOG_FILE" "INFO" "$1"
}

log_warn() {
  append_log "$LOG_FILE" "WARN" "$1"
}

sqlite_query() {
  sqlite3 "$DB_PATH" "$1"
}

classify_state() {
  if ! command -v sqlite3 >/dev/null 2>&1; then
    log_warn "sqlite3 not available; skipping cron classification"
    echo "no-action"
    return 0
  fi

  if [[ ! -f "$DB_PATH" ]]; then
    echo "idle-window"
    return 0
  fi

  local stall_minutes tool_timeout_minutes
  stall_minutes=$(config_int '.stallMinutes' '15')
  tool_timeout_minutes=$(config_int '.toolTimeoutMinutes' '60')

  sqlite_query "
    PRAGMA busy_timeout=5000;
    UPDATE sessions
    SET status = 'stale'
    WHERE status = 'working'
      AND datetime(last_event_at) <= datetime('now', '-${stall_minutes} minutes')
      AND (
        last_tool_started_at IS NULL
        OR datetime(last_tool_started_at) <= datetime('now', '-${tool_timeout_minutes} minutes')
      );
  " >/dev/null 2>&1 || true

  local working_count stale_count
  working_count=$(sqlite_query "SELECT COUNT(*) FROM sessions WHERE status = 'working';" 2>/dev/null || echo 0)
  stale_count=$(sqlite_query "SELECT COUNT(*) FROM sessions WHERE status = 'stale';" 2>/dev/null || echo 0)

  if [[ "${working_count:-0}" != "0" ]]; then
    echo "no-action"
  elif [[ "${stale_count:-0}" != "0" ]]; then
    echo "stale-window"
  else
    echo "idle-window"
  fi
}

current_status_body() {
  curl_status_json "$(control_surface_host)" "$(control_surface_port)" 2>/dev/null || true
}

post_prompt() {
  local kind="$1"
  local text="$2"
  local host port token payload status_code attempt
  host=$(control_surface_host)
  port=$(control_surface_port)
  token=$(config_string '.controlSurfaceToken' '')
  payload=$(jq -n --arg text "$text" --arg kind "$kind" '{source:"cron",text:$text,metadata:{kind:$kind}}')

  if [[ -z "$token" ]]; then
    log_warn "controlSurfaceToken missing; cannot post cron prompt kind=${kind}"
    return 1
  fi

  for attempt in 1 2; do
    status_code=$(post_json_with_auth "POST" "http://${host}:${port}/message" "$token" "$payload" 2>/dev/null || true)
    if [[ "$status_code" =~ ^2 ]]; then
      log_info "posted cron prompt kind=${kind} attempt=${attempt}"
      return 0
    fi
    sleep "$attempt"
  done

  log_warn "failed to post cron prompt kind=${kind}"
  return 1
}

main() {
  ensure_runtime_dirs
  log_info "cron tick"

  if ! command -v jq >/dev/null 2>&1; then
    log_warn "jq not available; skipping"
    exit 0
  fi

  local state body host port
  state=$(classify_state)
  case "$state" in
    no-action)
      log_info "no actionable idle/stale condition"
      exit 0
      ;;
    idle-window|stale-window)
      ;;
    *)
      log_warn "unknown classification state=${state}; treating as no-action"
      exit 0
      ;;
  esac

  body=$(current_status_body)
  if status_has_active_pi "$body"; then
    log_info "pi already active; no duplicate cron prompt"
    exit 0
  fi

  if [[ ! -x "$UP_SCRIPT" ]]; then
    log_warn "missing startup wrapper: $UP_SCRIPT"
    exit 0
  fi

  local up_result=""
  if ! up_result=$("$UP_SCRIPT" start 2>/dev/null); then
    log_warn "autonoma-up failed to start control surface"
    exit 0
  fi

  if [[ "$up_result" == "already-running" ]]; then
    log_info "Pi became active during startup race; no duplicate cron prompt"
    exit 0
  fi

  host=$(control_surface_host)
  port=$(control_surface_port)
  if ! wait_for_active_pi "$host" "$port" 30; then
    log_warn "control surface failed readiness check within 30s"
    exit 0
  fi

  if [[ "$state" == "idle-window" ]]; then
    post_prompt "idle-window-check" "$IDLE_PROMPT" || true
  else
    post_prompt "stale-session-check" "$STALE_PROMPT" || true
  fi

  exit 0
}

main
