import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import {
	AuthStorage,
	createAgentSession,
	createBashTool,
	createGrepTool,
	createReadTool,
	DefaultResourceLoader,
	ModelRegistry,
	SessionManager,
	SettingsManager,
} from "@mariozechner/pi-coding-agent";
import { getModel } from "@mariozechner/pi-ai";
import type { AutonomaConfig } from "../../config/load-config.ts";
import { DEFAULT_AGENT_PROMPT, buildOrchestratorPrompt } from "./system-prompt.ts";
import type { OrchestratorContext } from "./system-prompt.ts";

const HOME = os.homedir();
const THIS_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(THIS_DIR, "../../..");

type PiRole = "default" | "orchestrator";

type CreateAutonomaAgentOptions = {
	config: AutonomaConfig;
	customTools: Array<any>;
	role?: PiRole;
	orchestratorContext?: OrchestratorContext;
};

export async function createAutonomaAgent(options: CreateAutonomaAgentOptions) {
	const { config, customTools, role = "default", orchestratorContext } = options;
	const systemPrompt = resolveSystemPrompt(role, orchestratorContext);
	ensurePromptFile(config.controlSurfacePromptPath, systemPrompt);
	const authStorage = AuthStorage.create(path.join(config.controlSurfaceAgentDir, "auth.json"));
	const modelRegistry = new ModelRegistry(authStorage, path.join(config.controlSurfaceAgentDir, "models.json"));
	const settingsManager = SettingsManager.inMemory();
	const resourceLoader = new DefaultResourceLoader({
		cwd: PROJECT_ROOT,
		agentDir: config.controlSurfaceAgentDir,
		settingsManager,
		additionalSkillPaths: [path.join(HOME, ".agents", "skills")].filter((entry) => fs.existsSync(entry)),
		systemPromptOverride: () => fs.readFileSync(config.controlSurfacePromptPath, "utf8"),
	});
	await resourceLoader.reload();

	const model = getModel("anthropic", config.piModel as Parameters<typeof getModel>[1]);
	if (!model) {
		throw new Error(`Unable to resolve Pi model: ${config.piModel}`);
	}

	const created = await createAgentSession({
		cwd: HOME,
		agentDir: config.controlSurfaceAgentDir,
		model,
		thinkingLevel: config.piThinkingLevel,
		tools: [createReadTool(HOME), createBashTool(HOME), createGrepTool(HOME)],
		customTools,
		resourceLoader,
		sessionManager: SessionManager.create(HOME, config.controlSurfaceSessionsDir),
		settingsManager,
		authStorage,
		modelRegistry,
	});

	return {
		...created,
		modelInfo: {
			provider: (model as any).providerId ?? (model as any).provider ?? "anthropic",
			id: (model as any).modelId ?? (model as any).id ?? config.piModel,
		},
	};
}

function resolveSystemPrompt(role: PiRole, ctx?: OrchestratorContext): string {
	if (role === "orchestrator") {
		if (!ctx) throw new Error("orchestratorContext is required for orchestrator role");
		return buildOrchestratorPrompt(ctx);
	}
	return DEFAULT_AGENT_PROMPT;
}

function ensurePromptFile(promptPath: string, content: string): void {
	fs.mkdirSync(path.dirname(promptPath), { recursive: true });
	fs.writeFileSync(promptPath, content, "utf8");
}
