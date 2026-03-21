import type { BlackboardDatabase } from "../blackboard/db.ts";
import type { PiSessionStatus } from "../contracts/index.ts";

type CronContext = {
  blackboard: BlackboardDatabase;
  piSessionId: () => string | undefined;
  enqueue: (text: string) => void;
  log: (msg: string) => void;
};

function getPiStatus(db: BlackboardDatabase, piSessionId: string): PiSessionStatus | null {
  const row = db.prepare(
    "SELECT status FROM pi_sessions WHERE pi_session_id = ?",
  ).get(piSessionId) as { status: PiSessionStatus } | undefined;
  return row?.status ?? null;
}

function getStaleSessions(db: BlackboardDatabase): Array<{ session_id: string; tmux_session: string | null; last_event_at: string }> {
  return db.prepare(
    `SELECT session_id, tmux_session, last_event_at
     FROM sessions
     WHERE status = 'working'
       AND datetime(last_event_at) <= datetime('now', '-15 minutes')`,
  ).all() as Array<{ session_id: string; tmux_session: string | null; last_event_at: string }>;
}

function tick(ctx: CronContext): void {
  const piId = ctx.piSessionId();
  if (!piId) {
    ctx.log("[cron] no Pi session — skipping tick");
    return;
  }

  const status = getPiStatus(ctx.blackboard, piId);
  if (!status) {
    ctx.log("[cron] Pi session not in blackboard — skipping");
    return;
  }

  if (status === "active" || status === "waiting_for_sessions") {
    ctx.log(`[cron] Pi is ${status} — skipping tick`);
    return;
  }

  if (status === "ended" || status === "crashed") {
    ctx.log(`[cron] Pi is ${status} — skipping tick`);
    return;
  }

  // Pi is waiting_for_user — check for actionable work
  const staleSessions = getStaleSessions(ctx.blackboard);

  if (staleSessions.length > 0) {
    const sessionList = staleSessions
      .map((s) => `  - ${s.session_id.slice(0, 8)}${s.tmux_session ? ` (${s.tmux_session})` : ""} last activity: ${s.last_event_at}`)
      .join("\n");
    ctx.enqueue(
      `[Cron stale session check] ${staleSessions.length} session(s) appear stale:\n${sessionList}\n\nVerify real tmux state, reconcile SQLite state if needed, and decide whether each session should return to working, stay idle, be ended, or be re-prompted.`,
    );
    ctx.log(`[cron] queued stale-session check (${staleSessions.length} stale)`);
  } else {
    ctx.enqueue(
      "[Cron idle check] All tracked Claude Code sessions appear stopped or idle. Review the latest session state, recent transcripts, and Todoist context. If an obvious next prompt exists for an idle Claude session, consider continuing it. If there is nothing actionable, do nothing.",
    );
    ctx.log("[cron] queued idle-work check");
  }
}

export function startCronLoop(
  intervalMs: number,
  ctx: CronContext,
): NodeJS.Timeout {
  ctx.log(`[cron] starting cron loop every ${Math.round(intervalMs / 60_000)}m`);
  return setInterval(() => {
    try {
      tick(ctx);
    } catch (error) {
      ctx.log(`[cron] tick error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, intervalMs);
}
