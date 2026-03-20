import fs from "node:fs";
import type { BlackboardDatabase } from "../../blackboard/db.ts";
import type { WorkstreamRow } from "../../contracts/index.ts";
import { listOpenWorkstreams, insertWorkstream } from "../../blackboard/queries/workstreams.ts";
import { callGeminiClassify, type GeminiClassifyResult } from "./gemini-client.ts";

export type ClassificationResult = {
	workstream: WorkstreamRow | null;
	isWorkMessage: boolean;
	action: "matched" | "created" | "none";
};

function listProjectDirs(projectsDir: string): string[] {
	try {
		if (!fs.existsSync(projectsDir)) return [];
		return fs
			.readdirSync(projectsDir, { withFileTypes: true })
			.filter((d) => d.isDirectory() && !d.name.startsWith("."))
			.map((d) => d.name);
	} catch {
		return [];
	}
}

function buildClassificationPrompt(
	message: string,
	workstreams: WorkstreamRow[],
	projects: string[],
): string {
	const workstreamBlock =
		workstreams.length > 0
			? workstreams
					.map((ws) => `- id: "${ws.id}", name: "${ws.name}"${ws.repo_path ? `, repo: ${ws.repo_path}` : ""}`)
					.join("\n")
			: "(none open)";

	const projectBlock = projects.length > 0 ? projects.join(", ") : "(none)";

	return `You are a message classifier for a software development assistant.

Given a user message, classify it against open workstreams and known projects.

## Open workstreams
${workstreamBlock}

## Known projects
${projectBlock}

## Rules
1. If the message clearly relates to an existing open workstream, return its id.
2. If the message starts new work (a task, bug, feature, investigation, etc.) that doesn't match any open workstream, set new_workstream_name to a short descriptive name (2-5 words, lowercase, dash-separated).
3. If the message is casual conversation, a greeting, a question about the assistant itself, or otherwise not work-related, set is_work_message to false and leave both ids null.
4. When in doubt between matching an existing workstream and creating a new one, prefer matching the existing one.
5. A message that references a known project by name should be matched to an existing workstream for that project if one exists, or trigger a new workstream if not.

## User message
${message}`;
}

export async function classifyMessage(
	message: string,
	db: BlackboardDatabase,
	geminiApiKey: string,
	projectsDir: string,
): Promise<ClassificationResult> {
	const workstreams = listOpenWorkstreams(db);
	const projects = listProjectDirs(projectsDir);
	const prompt = buildClassificationPrompt(message, workstreams, projects);

	let result: GeminiClassifyResult;
	try {
		result = await callGeminiClassify(geminiApiKey, prompt);
	} catch (error) {
		// If Gemini fails, pass through as non-work (don't block the message)
		console.error(
			`[router] Gemini classification failed: ${error instanceof Error ? error.message : String(error)}`,
		);
		return { workstream: null, isWorkMessage: false, action: "none" };
	}

	if (!result.is_work_message) {
		return { workstream: null, isWorkMessage: false, action: "none" };
	}

	// Try to match existing workstream
	if (result.workstream_id) {
		const existing = workstreams.find((ws) => ws.id === result.workstream_id);
		if (existing) {
			return { workstream: existing, isWorkMessage: true, action: "matched" };
		}
		// Gemini returned an id that doesn't exist — fall through to create
	}

	// Create new workstream
	if (result.new_workstream_name) {
		const created = insertWorkstream(db, result.new_workstream_name);
		return { workstream: created, isWorkMessage: true, action: "created" };
	}

	// Work message but no workstream assignment
	return { workstream: null, isWorkMessage: true, action: "none" };
}
