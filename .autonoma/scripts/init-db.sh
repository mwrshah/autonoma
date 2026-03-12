#!/usr/bin/env bash
# init-db.sh — Create or migrate the configured Autonoma blackboard to the Phase 1 schema.
set -euo pipefail

AUTONOMA_HOME="${AUTONOMA_HOME:-$HOME/.autonoma}"
AUTONOMA_CONFIG="${AUTONOMA_CONFIG:-$AUTONOMA_HOME/config.json}"
DB_PATH="${AUTONOMA_DB_PATH:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCHEMA_FILE=""
CURRENT_VERSION=0
LATEST_VERSION=2

expand_home() {
  local value="$1"
  if [[ "$value" == "~" ]]; then
    printf '%s\n' "$HOME"
  elif [[ "$value" == ~/* ]]; then
    printf '%s/%s\n' "$HOME" "${value#~/}"
  else
    printf '%s\n' "$value"
  fi
}

if [[ -z "$DB_PATH" && -f "$AUTONOMA_CONFIG" ]] && command -v jq >/dev/null 2>&1; then
  config_db_path="$(jq -r '.blackboardPath // empty' "$AUTONOMA_CONFIG" 2>/dev/null || true)"
  if [[ -n "$config_db_path" && "$config_db_path" != "null" ]]; then
    DB_PATH="$(expand_home "$config_db_path")"
  fi
fi

if [[ -z "$DB_PATH" ]]; then
  DB_PATH="${AUTONOMA_HOME}/blackboard.db"
fi

DB_DIR="$(dirname "$DB_PATH")"

for candidate in \
  "$SCRIPT_DIR/../src/blackboard/schema.sql" \
  "$SCRIPT_DIR/../../src/blackboard/schema.sql"
do
  if [[ -f "$candidate" ]]; then
    SCHEMA_FILE="$candidate"
    break
  fi
done

if [[ -z "$SCHEMA_FILE" ]]; then
  echo "init-db.sh: could not locate src/blackboard/schema.sql" >&2
  exit 1
fi

mkdir -p "$DB_DIR"

sqlite() {
  sqlite3 "$DB_PATH" "$@"
}

bootstrap_migrations_table() {
  sqlite3 "$DB_PATH" >/dev/null <<'SQL'
PRAGMA journal_mode=WAL;
PRAGMA busy_timeout=5000;
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  applied_at DATETIME NOT NULL DEFAULT (datetime('now'))
);
SQL
}

query_scalar() {
  local sql="$1"
  sqlite "$sql" 2>/dev/null || echo "0"
}

has_table() {
  local table_name="$1"
  [[ "$(query_scalar "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='${table_name}';")" != "0" ]]
}

apply_schema_file() {
  sqlite3 "$DB_PATH" >/dev/null < "$SCHEMA_FILE"
}

create_fresh_schema() {
  apply_schema_file
  sqlite "INSERT OR IGNORE INTO schema_migrations(version) VALUES (${LATEST_VERSION});"
}

legacy_markers_present() {
  if has_table agents; then
    return 0
  fi

  if ! has_table pi_sessions; then
    return 0
  fi

  if has_table sessions; then
    local running_count
    running_count="$(query_scalar "SELECT COUNT(*) FROM sessions WHERE status='running';")"
    if [[ "$running_count" != "0" ]]; then
      return 0
    fi
  fi

  return 1
}

apply_legacy_upgrade() {
  {
    cat <<'SQL'
PRAGMA journal_mode=WAL;
PRAGMA busy_timeout=5000;
PRAGMA foreign_keys=OFF;
BEGIN IMMEDIATE;

DROP INDEX IF EXISTS idx_sessions_status;
DROP INDEX IF EXISTS idx_sessions_project;
DROP INDEX IF EXISTS idx_sessions_last_event_at;
DROP INDEX IF EXISTS idx_events_session_id;
DROP INDEX IF EXISTS idx_events_timestamp;
DROP INDEX IF EXISTS idx_events_session_event;
DROP INDEX IF EXISTS idx_whatsapp_status_created;
DROP INDEX IF EXISTS idx_pending_actions_status_created;
DROP INDEX IF EXISTS idx_pi_sessions_status;
DROP INDEX IF EXISTS idx_pi_sessions_role_status;
DROP INDEX IF EXISTS idx_pi_sessions_last_event_at;
SQL

    if has_table events; then
      echo "ALTER TABLE events RENAME TO events_legacy;"
    fi

    if has_table sessions; then
      echo "ALTER TABLE sessions RENAME TO sessions_legacy;"
    fi

    cat "$SCHEMA_FILE"

    if has_table sessions; then
      cat <<'SQL'
INSERT INTO sessions (
  session_id,
  launch_id,
  tmux_session,
  cwd,
  project,
  project_label,
  model,
  permission_mode,
  source,
  status,
  transcript_path,
  task_description,
  todoist_task_id,
  agent_managed,
  session_end_reason,
  started_at,
  ended_at,
  last_event_at,
  last_tool_started_at
)
SELECT
  session_id,
  launch_id,
  tmux_session,
  COALESCE(NULLIF(cwd, ''), '.') AS cwd,
  COALESCE(NULLIF(project, ''), NULLIF(project_label, ''), COALESCE(NULLIF(cwd, ''), 'unknown')) AS project,
  project_label,
  model,
  permission_mode,
  source,
  CASE
    WHEN status = 'running' THEN 'working'
    WHEN status IN ('working', 'idle', 'stale', 'ended') THEN status
    ELSE 'working'
  END AS status,
  transcript_path,
  task_description,
  todoist_task_id,
  COALESCE(agent_managed, 0),
  session_end_reason,
  COALESCE(started_at, last_event_at, datetime('now')),
  ended_at,
  COALESCE(last_event_at, started_at, datetime('now')),
  last_tool_started_at
FROM sessions_legacy;
SQL
    fi

    if has_table events; then
      cat <<'SQL'
INSERT INTO events (id, session_id, event_name, tool_name, tool_use_id, timestamp, payload)
SELECT
  id,
  session_id,
  event_name,
  tool_name,
  tool_use_id,
  COALESCE(timestamp, datetime('now')),
  payload
FROM events_legacy;
SQL
    fi

    cat <<'SQL'
DROP TABLE IF EXISTS events_legacy;
DROP TABLE IF EXISTS sessions_legacy;
DROP TABLE IF EXISTS agents;
INSERT OR IGNORE INTO schema_migrations(version) VALUES (2);
COMMIT;
PRAGMA foreign_keys=ON;
SQL
  } | sqlite3 "$DB_PATH" >/dev/null
}

bootstrap_migrations_table
CURRENT_VERSION="$(query_scalar "SELECT COALESCE(MAX(version), 0) FROM schema_migrations;")"

if ! has_table sessions; then
  create_fresh_schema
elif (( CURRENT_VERSION < LATEST_VERSION )) || legacy_markers_present; then
  apply_legacy_upgrade
else
  apply_schema_file
fi

echo "blackboard.db ready at ${DB_PATH} (schema v${LATEST_VERSION})"
