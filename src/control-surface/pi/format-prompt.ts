import type { QueueItem } from "../queue/turn-queue.ts";

/**
 * Produce the final prompt string for session.prompt().
 * Clean user text gets a structured <context /> header for the default agent;
 * orchestrators and hook/cron sources pass through unchanged.
 */
export function formatPromptWithContext(item: QueueItem, role: "default" | "orchestrator"): string {
	// Hook and cron messages are already formatted content — pass through
	if (item.source === "hook" || item.source === "cron") {
		return item.text;
	}

	// Orchestrators receive raw text (workstream context is in system prompt)
	if (role === "orchestrator") {
		return item.text;
	}

	// Default agent: prepend structured context header
	const attrs: string[] = [];
	attrs.push(`source="${item.source}"`);

	const meta = item.metadata;
	if (meta) {
		if (typeof meta.workstream_name === "string") attrs.push(`workstream="${meta.workstream_name}"`);
		if (typeof meta.workstream_id === "string") attrs.push(`workstream_id="${meta.workstream_id}"`);
		if (typeof meta.router_action === "string") attrs.push(`action="${meta.router_action}"`);
	}

	return `<context ${attrs.join(" ")} />\n\n${item.text}`;
}
