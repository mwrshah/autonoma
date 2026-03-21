import { execSync } from "node:child_process";
import path from "node:path";
import type { BlackboardDatabase } from "../../blackboard/db.ts";
import { getWorkstreamById, enrichWorkstream } from "../../blackboard/queries/workstreams.ts";

type CreateWorktreeResult = {
	ok: boolean;
	workstreamId: string;
	worktreePath?: string;
	branchName?: string;
	message: string;
};

export function executeCreateWorktree(
	blackboard: BlackboardDatabase,
	workstreamId: string,
	repoPath: string,
	branchName?: string,
): CreateWorktreeResult {
	const workstream = getWorkstreamById(blackboard, workstreamId);
	if (!workstream) {
		return { ok: false, workstreamId, message: `Workstream ${workstreamId} not found` };
	}
	if (workstream.status !== "open") {
		return { ok: false, workstreamId, message: `Workstream ${workstreamId} is not open` };
	}

	const slug = workstream.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
	const resolvedBranch = branchName ?? `ws/${slug}`;
	const worktreePath = path.resolve(repoPath, "..", ".worktrees", slug);

	try {
		execSync("git fetch origin", { cwd: repoPath, timeout: 30_000, stdio: "pipe" });
		execSync(
			`git worktree add ${JSON.stringify(worktreePath)} -b ${JSON.stringify(resolvedBranch)} origin/main`,
			{ cwd: repoPath, timeout: 30_000, stdio: "pipe" },
		);
	} catch (error: any) {
		return {
			ok: false,
			workstreamId,
			message: `Failed to create worktree: ${error.stderr?.toString().trim() || error.message}`,
		};
	}

	enrichWorkstream(blackboard, workstreamId, repoPath, worktreePath);

	return {
		ok: true,
		workstreamId,
		worktreePath,
		branchName: resolvedBranch,
		message: `Worktree created at ${worktreePath} on branch ${resolvedBranch}`,
	};
}
