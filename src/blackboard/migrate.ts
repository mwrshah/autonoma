import type { DatabaseSync } from "node:sqlite";
import { BLACKBOARD_SCHEMA_SQL, BLACKBOARD_SCHEMA_VERSION } from "../contracts/index.ts";

const LATEST_BLACKBOARD_SCHEMA_VERSION = BLACKBOARD_SCHEMA_VERSION;

function hasTable(db: DatabaseSync, tableName: string): boolean {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName) as
    | { name?: string }
    | undefined;
  return Boolean(row?.name);
}

function getSchemaVersion(db: DatabaseSync): number {
  if (!hasTable(db, "schema_migrations")) {
    return 0;
  }
  const row = db.prepare("SELECT COALESCE(MAX(version), 0) AS version FROM schema_migrations").get() as {
    version: number;
  };
  return Number(row.version ?? 0);
}

function hasLegacyMarkers(db: DatabaseSync): boolean {
  if (!hasTable(db, "sessions")) {
    return false;
  }
  if (hasTable(db, "agents") || !hasTable(db, "pi_sessions")) {
    return true;
  }
  const row = db.prepare("SELECT COUNT(*) AS count FROM sessions WHERE status = 'running'").get() as {
    count: number;
  };
  return Number(row.count ?? 0) > 0;
}

function ensureSchemaTables(db: DatabaseSync): void {
  db.exec(BLACKBOARD_SCHEMA_SQL);
}

function applyLegacyUpgrade(db: DatabaseSync): void {
  db.exec("PRAGMA foreign_keys=OFF;");
  db.exec("BEGIN IMMEDIATE;");

  try {
    db.exec(`
      DROP INDEX IF EXISTS idx_sessions_status;
      DROP INDEX IF EXISTS idx_sessions_project;
      DROP INDEX IF EXISTS idx_sessions_last_event_at;
      DROP INDEX IF EXISTS idx_events_session_id;
      DROP INDEX IF EXISTS idx_events_timestamp;
      DROP INDEX IF EXISTS idx_events_session_event;
      DROP INDEX IF EXISTS idx_pi_sessions_status;
      DROP INDEX IF EXISTS idx_pi_sessions_role_status;
      DROP INDEX IF EXISTS idx_pi_sessions_last_event_at;
      DROP INDEX IF EXISTS idx_whatsapp_status_created;
      DROP INDEX IF EXISTS idx_pending_actions_status_created;
    `);

    if (hasTable(db, "events")) {
      db.exec("ALTER TABLE events RENAME TO events_legacy;");
    }
    if (hasTable(db, "sessions")) {
      db.exec("ALTER TABLE sessions RENAME TO sessions_legacy;");
    }

    ensureSchemaTables(db);

    if (hasTable(db, "sessions_legacy")) {
      db.exec(`
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
        FROM sessions_legacy
      `);
    }

    if (hasTable(db, "events_legacy")) {
      db.exec(`
        INSERT INTO events (id, session_id, event_name, tool_name, tool_use_id, timestamp, payload)
        SELECT
          id,
          session_id,
          event_name,
          tool_name,
          tool_use_id,
          COALESCE(timestamp, datetime('now')),
          payload
        FROM events_legacy
      `);
    }

    db.exec(`
      DROP TABLE IF EXISTS events_legacy;
      DROP TABLE IF EXISTS sessions_legacy;
      DROP TABLE IF EXISTS agents;
      INSERT OR IGNORE INTO schema_migrations(version) VALUES (${LATEST_BLACKBOARD_SCHEMA_VERSION});
    `);

    db.exec("COMMIT;");
  } catch (error) {
    db.exec("ROLLBACK;");
    throw error;
  } finally {
    db.exec("PRAGMA foreign_keys=ON;");
  }
}

export function migrateBlackboard(db: DatabaseSync): number {
  ensureSchemaTables(db);

  const version = getSchemaVersion(db);
  if (version === 0) {
    db.prepare("INSERT OR IGNORE INTO schema_migrations(version) VALUES (?)").run(LATEST_BLACKBOARD_SCHEMA_VERSION);
    return LATEST_BLACKBOARD_SCHEMA_VERSION;
  }

  if (version < LATEST_BLACKBOARD_SCHEMA_VERSION || hasLegacyMarkers(db)) {
    applyLegacyUpgrade(db);
  }

  return getSchemaVersion(db);
}

