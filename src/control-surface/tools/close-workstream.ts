import { execSync } from "node:child_process";
import fs from "node:fs";
import type { BlackboardDatabase } from "../../blackboard/db.ts";
import { getWorkstreamById, closeWorkstream } from "../../blackboard/queries/workstreams.ts";
import { endPiSession } from "../../blackboard/queries/pi-sessions.ts";

type CloseWorkstreamResult = {
  ok: boolean;
  workstreamId: string;
  message: string;
  worktreeRemoved?: boolean;
};

export function executeCloseWorkstream(
  blackboard: BlackboardDatabase,
  piSessionId: string,
  workstreamId: string,
): CloseWorkstreamResult {
  const workstream = getWorkstreamById(blackboard, workstreamId);
  if (!workstream) {
    return { ok: false, workstreamId, message: `Workstream ${workstreamId} not found` };
  }
  if (workstream.status !== "open") {
    return { ok: false, workstreamId, message: `Workstream ${workstreamId} is already closed` };
  }

  let worktreeRemoved = false;
  if (workstream.worktree_path && fs.existsSync(workstream.worktree_path)) {
    try {
      execSync(`git worktree remove ${JSON.stringify(workstream.worktree_path)}`, {
        timeout: 15_000,
        stdio: "pipe",
      });
      worktreeRemoved = true;
    } catch (error) {
      // Force remove if normal remove fails (e.g., dirty worktree)
      try {
        execSync(`git worktree remove --force ${JSON.stringify(workstream.worktree_path)}`, {
          timeout: 15_000,
          stdio: "pipe",
        });
        worktreeRemoved = true;
      } catch {
        // Log but don't block — workstream close is more important than worktree cleanup
      }
    }
  }

  closeWorkstream(blackboard, workstreamId);
  endPiSession(blackboard, piSessionId, "ended", "workstream_closed");

  return {
    ok: true,
    workstreamId,
    message: `Workstream "${workstream.name}" closed.${worktreeRemoved ? " Git worktree removed." : ""}`,
    worktreeRemoved,
  };
}

export function createCloseWorkstreamTool(blackboard: BlackboardDatabase, piSessionId: string) {
  return {
    name: "close_workstream",
    label: "Close Workstream",
    description:
      "Close the current workstream. Only call when the human explicitly confirms the work is done. Cleans up the git worktree, closes the workstream, and ends this orchestrator session.",
    parameters: {
      type: "object",
      properties: {
        workstream_id: { type: "string", description: "ID of the workstream to close" },
      },
      required: ["workstream_id"],
      additionalProperties: false,
    },
    execute: async (_toolCallId: string, params: any) => {
      const result = executeCloseWorkstream(blackboard, piSessionId, params.workstream_id);
      return {
        content: [{ type: "text", text: result.message }],
        details: result,
      };
    },
  };
}
