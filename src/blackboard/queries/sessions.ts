import type { BlackboardDatabase } from "../db.ts";
import type { AutonomaConfig } from "../../config/load-config.ts";
import type {
  BlackboardEventRow as EventRow,
  ClaudeSessionDetail as SessionDetail,
  ClaudeSessionListItem as SessionListItem,
  ClaudeSessionRow,
} from "../../contracts/index.ts";

type InjectionEligibility =
  | { ok: true; reason: "idle" }
  | { ok: false; reason: "ended" | "no_tmux_session" | "busy" | "stale_or_ambiguous" };

function parseIsoTime(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }

  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

function minutesAgo(now: number, value: string | null | undefined): number | null {
  const time = parseIsoTime(value);
  if (time === null) {
    return null;
  }
  return (now - time) / 60_000;
}

function mapSessionRow(row: ClaudeSessionRow): SessionListItem {
  return {
    sessionId: row.session_id,
    launchId: row.launch_id,
    tmuxSession: row.tmux_session,
    cwd: row.cwd,
    project: row.project,
    projectLabel: row.project_label,
    model: row.model,
    permissionMode: row.permission_mode,
    source: row.source,
    status: row.status,
    transcriptPath: row.transcript_path,
    taskDescription: row.task_description,
    todoistTaskId: row.todoist_task_id,
    agentManaged: Boolean(row.agent_managed),
    sessionEndReason: row.session_end_reason,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    lastEventAt: row.last_event_at,
    lastToolStartedAt: row.last_tool_started_at,
  };
}

export function listSessions(db: BlackboardDatabase): SessionListItem[] {
  const rows = db
    .prepare(
      `SELECT *
       FROM sessions
       ORDER BY
         CASE status
           WHEN 'working' THEN 0
           WHEN 'idle' THEN 1
           WHEN 'stale' THEN 2
           ELSE 3
         END,
         last_event_at DESC`,
    )
    .all() as ClaudeSessionRow[];

  return rows.map(mapSessionRow);
}


export function getSessionById(db: BlackboardDatabase, sessionId: string): SessionListItem | null {
  const row = db.prepare("SELECT * FROM sessions WHERE session_id = ?").get(sessionId) as ClaudeSessionRow | undefined;
  return row ? mapSessionRow(row) : null;
}

export function getSessionDetail(db: BlackboardDatabase, sessionId: string, eventLimit = 50): SessionDetail | null {
  const session = getSessionById(db, sessionId);
  if (!session) {
    return null;
  }

  const recentEvents = db
    .prepare(
      `SELECT id, session_id, event_name, tool_name, tool_use_id, timestamp, payload
       FROM events
       WHERE session_id = ?
       ORDER BY timestamp DESC
       LIMIT ?`,
    )
    .all(sessionId, eventLimit) as EventRow[];

  return {
    ...session,
    recentEvents,
  };
}


export function getSessionByTmuxSession(db: BlackboardDatabase, tmuxSession: string): SessionListItem | null {
  const row = db
    .prepare(
      `SELECT *
       FROM sessions
       WHERE tmux_session = ?
       ORDER BY last_event_at DESC
       LIMIT 1`,
    )
    .get(tmuxSession) as ClaudeSessionRow | undefined;

  return row ? mapSessionRow(row) : null;
}

export function getInjectionEligibility(
  session: SessionListItem,
  config: Pick<AutonomaConfig, "stallMinutes" | "toolTimeoutMinutes">,
): InjectionEligibility {
  if (session.status === "ended") {
    return { ok: false, reason: "ended" };
  }

  if (!session.tmuxSession) {
    return { ok: false, reason: "no_tmux_session" };
  }

  if (session.status === "stale") {
    return { ok: false, reason: "stale_or_ambiguous" };
  }

  if (session.status === "idle") {
    return { ok: true, reason: "idle" };
  }

  const now = Date.now();
  const lastEventAgeMinutes = minutesAgo(now, session.lastEventAt);
  const lastToolAgeMinutes = minutesAgo(now, session.lastToolStartedAt);
  const staleByEvent = lastEventAgeMinutes === null || lastEventAgeMinutes > config.stallMinutes;
  const staleByTool =
    session.lastToolStartedAt === null
      ? true
      : lastToolAgeMinutes !== null && lastToolAgeMinutes > config.toolTimeoutMinutes;

  if (!staleByEvent) {
    return { ok: false, reason: "busy" };
  }

  if (staleByEvent && staleByTool) {
    return { ok: false, reason: "stale_or_ambiguous" };
  }

  return { ok: false, reason: "busy" };
}

function findStaleCandidates(
  db: BlackboardDatabase,
  stallMinutes: number,
  toolTimeoutMinutes: number,
): SessionListItem[] {
  const rows = db
    .prepare(
      `SELECT *
       FROM sessions
       WHERE status = 'working'
         AND datetime(last_event_at) <= datetime('now', '-' || ? || ' minutes')
         AND (
           last_tool_started_at IS NULL
           OR datetime(last_tool_started_at) <= datetime('now', '-' || ? || ' minutes')
         )
       ORDER BY last_event_at ASC`,
    )
    .all(stallMinutes, toolTimeoutMinutes) as ClaudeSessionRow[];
  return rows.map(mapSessionRow);
}

export function markStaleSessions(
  db: BlackboardDatabase,
  stallMinutes: number,
  toolTimeoutMinutes: number,
): SessionListItem[] {
  const candidates = findStaleCandidates(db, stallMinutes, toolTimeoutMinutes);
  for (const session of candidates) {
    db.prepare(`UPDATE sessions SET status = 'stale' WHERE session_id = ? AND status = 'working'`).run(session.sessionId);
  }
  return candidates;
}

export function findIdleCleanupCandidates(db: BlackboardDatabase, idleBeforeIsoOrHours: string | number): SessionListItem[] {
  let rows: ClaudeSessionRow[];
  if (typeof idleBeforeIsoOrHours === "string") {
    rows = db
      .prepare(
        `SELECT *
         FROM sessions
         WHERE status IN ('working', 'stale')
           AND last_event_at < ?
         ORDER BY last_event_at ASC`,
      )
      .all(idleBeforeIsoOrHours) as ClaudeSessionRow[];
  } else {
    rows = db
      .prepare(
        `SELECT *
         FROM sessions
         WHERE status IN ('working', 'stale')
           AND datetime(last_event_at) <= datetime('now', '-' || ? || ' hours')
         ORDER BY last_event_at ASC`,
      )
      .all(idleBeforeIsoOrHours) as ClaudeSessionRow[];
  }
  return rows.map(mapSessionRow);
}

export function markSessionEnded(
  db: BlackboardDatabase,
  sessionId: string,
  reason: string,
  endedAt = new Date().toISOString(),
): void {
  db.prepare(
    `UPDATE sessions
     SET status = 'ended',
         session_end_reason = ?,
         ended_at = COALESCE(ended_at, ?),
         last_event_at = MAX(last_event_at, ?),
         last_tool_started_at = NULL
     WHERE session_id = ?`,
  ).run(reason, endedAt, endedAt, sessionId);
}

