import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import type { BlackboardDatabase } from "../../blackboard/db.ts";
import { getWorkstreamById, closeWorkstream } from "../../blackboard/queries/workstreams.ts";
import { endPiSession } from "../../blackboard/queries/pi-sessions.ts";

type CloseWorkstreamResult = {
  ok: boolean;
  workstreamId: string;
  message: string;
  worktreeRemoved?: boolean;
};

function hasGtr(cwd: string): boolean {
  try {
    execSync("git gtr version", { cwd, timeout: 5_000, stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

function inferBranchFromWorktree(worktreePath: string): string | null {
  try {
    const output = execSync("git branch --show-current", { cwd: worktreePath, timeout: 5_000, stdio: "pipe" })
      .toString()
      .trim();
    return output || null;
  } catch {
    return null;
  }
}

function removeWithGtr(repoPath: string, branch: string): boolean {
  try {
    // --yes to skip confirmation, no --delete-branch to preserve the branch for PR/review
    execSync(`git gtr rm ${branch} --yes`, { cwd: repoPath, timeout: 15_000, stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

function removeWithRawGit(worktreePath: string): boolean {
  try {
    execSync(`git worktree remove ${JSON.stringify(worktreePath)}`, { timeout: 15_000, stdio: "pipe" });
    return true;
  } catch {
    try {
      execSync(`git worktree remove --force ${JSON.stringify(worktreePath)}`, { timeout: 15_000, stdio: "pipe" });
      return true;
    } catch {
      return false;
    }
  }
}

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
    const branch = inferBranchFromWorktree(workstream.worktree_path);
    const repoPath = workstream.repo_path || path.resolve(workstream.worktree_path, "..");

    if (branch && hasGtr(repoPath)) {
      worktreeRemoved = removeWithGtr(repoPath, branch);
    }
    if (!worktreeRemoved) {
      worktreeRemoved = removeWithRawGit(workstream.worktree_path);
    }
  }

  closeWorkstream(blackboard, workstreamId);
  endPiSession(blackboard, piSessionId, "ended", "workstream_closed");

  return {
    ok: true,
    workstreamId,
    message: `Workstream "${workstream.name}" closed.${worktreeRemoved ? " Worktree removed (branch preserved)." : ""}`,
    worktreeRemoved,
  };
}

export function createCloseWorkstreamTool(blackboard: BlackboardDatabase, piSessionId: string) {
  return {
    name: "close_workstream",
    label: "Close Workstream",
    description:
      "Close the current workstream. Only call when the human explicitly confirms the work is done. Removes the git worktree (preserves the branch for PR/review), closes the workstream, and ends this orchestrator session.",
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
