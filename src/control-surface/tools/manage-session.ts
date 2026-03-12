import type { BlackboardDatabase } from "../../blackboard/db.ts";
import {
  getInjectionEligibility,
  getSessionById,
  getSessionByTmuxSession,
} from "../../blackboard/queries/sessions.ts";
import type { AutonomaConfig } from "../../config/load-config.ts";
import type { DirectSessionMessageResponse } from "../../contracts/index.ts";
import { sendMessageToClaudeSession } from "../../claude-sessions/send-message.ts";
import {
  inspectTmuxSession,
  killTmuxSession,
  listTmuxSessions,
  tmuxSessionExists,
} from "../../claude-sessions/tmux.ts";

type ManageSessionAction = "list" | "inspect" | "inject" | "kill";

type ManageSessionToolInput = {
  action: ManageSessionAction;
  session_id?: string;
  tmux_session?: string;
  sessionName?: string;
  text?: string;
  verify_inference?: boolean;
};

type SessionControlContext = {
  blackboard: BlackboardDatabase;
  config: Pick<AutonomaConfig, "stallMinutes" | "toolTimeoutMinutes">;
};

function findSession(context: SessionControlContext, input: Pick<ManageSessionToolInput, "session_id" | "tmux_session" | "sessionName">) {
  if (input.session_id) {
    return getSessionById(context.blackboard, input.session_id);
  }

  const tmuxSession = input.tmux_session ?? input.sessionName;
  if (tmuxSession) {
    return getSessionByTmuxSession(context.blackboard, tmuxSession);
  }

  return null;
}

function resolveTmuxSession(
  context: SessionControlContext,
  input: Pick<ManageSessionToolInput, "session_id" | "tmux_session" | "sessionName">,
): string | null {
  return input.tmux_session ?? input.sessionName ?? findSession(context, input)?.tmuxSession ?? null;
}

export async function directSessionMessage(
  context: SessionControlContext,
  sessionId: string,
  text: string,
): Promise<DirectSessionMessageResponse> {
  const session = getSessionById(context.blackboard, sessionId);
  if (!session) {
    return { ok: false, sessionId, reason: "stale_or_ambiguous" };
  }

  const eligibility = getInjectionEligibility(session, context.config);
  if (!eligibility.ok) {
    return {
      ok: false,
      sessionId,
      busy: eligibility.reason === "busy",
      reason: eligibility.reason,
    };
  }

  const tmuxSession = session.tmuxSession;
  if (!tmuxSession) {
    return { ok: false, sessionId, reason: "no_tmux_session" };
  }

  if (!(await tmuxSessionExists(tmuxSession))) {
    return { ok: false, sessionId, reason: "tmux_session_missing" };
  }

  const inspection = await inspectTmuxSession(tmuxSession);
  if (!inspection.exists || !inspection.pane) {
    return { ok: false, sessionId, reason: "tmux_session_missing" };
  }

  if (inspection.pane.uiState === "INFERRING") {
    return { ok: false, sessionId, busy: true, reason: "busy" };
  }

  if (inspection.pane.uiState !== "IDLE") {
    return { ok: false, sessionId, busy: false, reason: "stale_or_ambiguous" };
  }

  const delivery = await sendMessageToClaudeSession(tmuxSession, text, {
    verifyInference: true,
    maxRetries: 2,
    settleMs: 2000,
  });

  if (!delivery.ok) {
    return {
      ok: false,
      sessionId,
      busy: delivery.uiState === "INFERRING",
      reason: delivery.reason,
    };
  }

  return { ok: true, delivery: "tmux_send_keys", sessionId };
}

export async function manageSessionTool(context: SessionControlContext, input: ManageSessionToolInput) {
  const session = findSession(context, input);
  const tmuxSession = resolveTmuxSession(context, input);

  switch (input.action) {
    case "list":
      return listTmuxSessions();
    case "inspect": {
      if (!tmuxSession) {
        throw new Error("inspect requires session_id or tmux_session");
      }
      return inspectTmuxSession(tmuxSession);
    }
    case "inject": {
      if (!input.text?.trim()) {
        throw new Error("inject requires text");
      }

      if (input.session_id) {
        return directSessionMessage(context, input.session_id, input.text);
      }

      if (!tmuxSession || !session) {
        throw new Error("inject requires session_id or tmux_session plus text");
      }

      const eligibility = getInjectionEligibility(session, context.config);
      if (!eligibility.ok) {
        return { ok: false, reason: eligibility.reason };
      }

      const inspection = await inspectTmuxSession(tmuxSession);
      if (!inspection.exists || inspection.pane?.uiState !== "IDLE") {
        return { ok: false, reason: inspection.pane?.uiState === "INFERRING" ? "busy" : "stale_or_ambiguous" };
      }

      return sendMessageToClaudeSession(tmuxSession, input.text, {
        verifyInference: input.verify_inference ?? true,
        maxRetries: 2,
        settleMs: 2000,
      });
    }
    case "kill": {
      if (!tmuxSession) {
        throw new Error("kill requires session_id or tmux_session");
      }
      await killTmuxSession(tmuxSession);
      return { ok: true, sessionName: tmuxSession };
    }
  }
}
