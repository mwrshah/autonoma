import fs from "node:fs";
import path from "node:path";
import net from "node:net";
import crypto from "node:crypto";
import type http from "node:http";
import { loadConfig, type AutonomaConfig } from "../config/load-config.ts";
import type {
	ClaudeSessionListItem as SessionListItem,
	ControlSurfaceWebSocketClientEvent,
	DeliveryMode,
	DirectSessionMessageResponse,
	HookResponse,
	RuntimeWhatsAppStartResponse,
	RuntimeWhatsAppStopResponse,
	SessionTranscriptResponse,
	StatusResponse,
	WhatsAppDaemonStatus as ControlSurfaceWhatsAppStatus,
} from "../contracts/index.ts";
import { openBlackboard, pingBlackboard, type BlackboardDatabase } from "../blackboard/db.ts";
import { executeCloseWorkstream } from "./tools/close-workstream.ts";
import {
	endPiSession,
	reconcilePreviousPiSessions,
	touchPiPrompt,
	updatePiSessionStatus,
	upsertPiSession,
} from "../blackboard/queries/pi-sessions.ts";
import {
	findIdleCleanupCandidates,
	getSessionById,
	insertSession,
	listSessions,
	markSessionEnded,
	markStaleSessions,
	updateSessionStop,
} from "../blackboard/queries/sessions.ts";
import { killTmuxSession } from "../claude-sessions/tmux.ts";
import { readTranscriptPage } from "./transcript.ts";
import { createAutonomaAgent } from "./pi/create-agent.ts";
import { PiSessionState } from "./pi/session-state.ts";
import { subscribeToPiSession } from "./pi/subscribe.ts";
import { TurnQueue, type QueueItem, type QueueSource } from "./queue/turn-queue.ts";
import { WebSocketHub, type WebSocketClient } from "./ws/hub.ts";
import { sendDaemonCommand } from "../whatsapp/ipc.ts";
import { getDaemonStatus, startDaemonProcess, stopDaemonProcess, waitForDaemonReady } from "../whatsapp/process.ts";
import { directSessionMessage } from "./tools/manage-session.ts";

type EnqueueInput = {
	text: string;
	source: QueueSource;
	metadata?: Record<string, unknown>;
	deliveryMode?: DeliveryMode;
	webClientId?: string;
	images?: Array<{ data: string; mimeType: string }>;
};

const ACCEPTED_HOOK_EVENTS = new Set(["session-start", "stop", "session-end"]);

export class ControlSurfaceRuntime {
	readonly config: AutonomaConfig;
	readonly blackboard: BlackboardDatabase;
	readonly sessionState = new PiSessionState();
	readonly runtimeInstanceId = crypto.randomUUID();
	readonly startedAt = Date.now();
	readonly wsHub: WebSocketHub;
	readonly queue: TurnQueue;
	server?: http.Server;
	piSession?: any;
	piModelInfo?: { provider?: string; id?: string };
	private unsubscribePi?: () => void;
	private stopping = false;
	private maintenanceTimer?: NodeJS.Timeout;
	private whatsappStatusCache: {
		status: ControlSurfaceWhatsAppStatus;
		pid?: number;
		managedByControlSurface: true;
		requiresManualAuth?: boolean;
	} = {
		status: "stopped",
		managedByControlSurface: true,
	};

	constructor(config: AutonomaConfig = loadConfig()) {
		this.config = config;
		this.blackboard = openBlackboard(config.blackboardPath);
		this.wsHub = new WebSocketHub(this.handleWebSocketMessage.bind(this));
		this.queue = new TurnQueue({
			process: this.processQueueItem.bind(this),
			onDepthChange: (depth) => this.sessionState.setQueueDepth(depth),
			onItemStart: (item) => {
				this.sessionState.setBusy(true, item);
				this.wsHub.broadcast({ type: "queue_item_start", item });
			},
			onItemEnd: (item, error) => {
				this.sessionState.setBusy(false);
				this.wsHub.broadcast({
					type: "queue_item_end",
					itemId: item.id,
					error: error instanceof Error ? error.message : error ? String(error) : undefined,
				});
			},
		});
	}

	attachServer(server: http.Server): void {
		this.server = server;
	}

	async start(): Promise<void> {
		this.ensurePidFile();
		reconcilePreviousPiSessions(this.blackboard, "orchestrator", this.runtimeInstanceId, "restart");

		const created = await createAutonomaAgent({
			config: this.config,
			customTools: this.createCustomTools(),
		});
		this.piSession = created.session;
		this.piModelInfo = created.modelInfo;
		this.sessionState.initialize(created.session.sessionId, created.session.sessionFile, created.session.messages.length);
		upsertPiSession(this.blackboard, {
			piSessionId: created.session.sessionId,
			role: "orchestrator",
			status: "waiting_for_user",
			runtimeInstanceId: this.runtimeInstanceId,
			pid: process.pid,
			sessionFile: created.session.sessionFile,
			cwd: process.env.HOME ?? process.cwd(),
			agentDir: this.config.controlSurfaceAgentDir,
			modelProvider: created.modelInfo.provider,
			modelId: created.modelInfo.id,
			thinkingLevel: this.config.piThinkingLevel,
			startedAt: new Date(this.startedAt).toISOString(),
			lastEventAt: new Date().toISOString(),
		});
		this.unsubscribePi = subscribeToPiSession(created.session, this.sessionState, this.blackboard, this.wsHub);
		await this.ensureWhatsAppDaemon();
		await this.refreshWhatsAppStatus();
		this.startMaintenanceLoop();
		this.log(`runtime started on ${this.config.controlSurfaceHost}:${this.config.controlSurfacePort}`);
	}

	async stop(reason: string = "shutdown", crash: boolean = false): Promise<void> {
		if (this.stopping) return;
		this.stopping = true;
		this.log(`runtime stopping: ${reason}`);
		this.queue.stop();
		if (this.maintenanceTimer) clearInterval(this.maintenanceTimer);
		try {
			this.unsubscribePi?.();
		} catch {
			// ignore
		}
		if (this.piSession) {
			endPiSession(
				this.blackboard,
				this.piSession.sessionId,
				crash ? "crashed" : "ended",
				reason,
				new Date().toISOString(),
			);
			try {
				this.piSession.dispose?.();
			} catch {
				// ignore
			}
		}
		try {
			await this.stopWhatsAppDaemon();
			await this.refreshWhatsAppStatus();
		} catch {
			// ignore
		}
		try {
			this.wsHub.closeAll();
		} catch {
			// ignore
		}
		await new Promise<void>((resolve) => {
			if (!this.server) return resolve();
			this.server.close(() => resolve());
		});
		try {
			if (fs.existsSync(this.config.controlSurfacePidPath)) fs.unlinkSync(this.config.controlSurfacePidPath);
		} catch {
			// ignore
		}
		this.blackboard.close();
	}

	enqueue(input: EnqueueInput): { ok: true; queued: true; queueDepth: number; item: QueueItem } {
		const images = input.images?.map((img) => ({ type: "image" as const, data: img.data, mimeType: img.mimeType }));
		const item: QueueItem = {
			id: crypto.randomUUID(),
			source: input.source,
			text: input.text,
			metadata: input.metadata,
			receivedAt: new Date().toISOString(),
			webClientId: input.webClientId,
			deliveryMode: input.deliveryMode ?? "followUp",
			images: images?.length ? images : undefined,
		};
		const queueDepth = this.queue.enqueue(item);
		this.log(`queued ${item.source} item ${item.id} depth=${queueDepth}`);
		return { ok: true, queued: true, queueDepth, item };
	}

	handleHook(eventName: string, payload: Record<string, unknown>): HookResponse {
		const normalized = eventName.toLowerCase();
		if (!ACCEPTED_HOOK_EVENTS.has(normalized)) {
			return { ok: true, filtered: true };
		}

		const sessionId = pickString(payload, ["session_id", "sessionId"]);
		if (!sessionId) {
			return { ok: true, filtered: true };
		}

		const piSessionId = this.piSession?.sessionId;
		const isOwnPiSession = piSessionId && sessionId === piSessionId;

		if (normalized === "session-start") {
			// Gate: only track sessions that declared AUTONOMA_AGENT_MANAGED=1
			const agentManaged = payload.agent_managed === true || payload.agent_managed === 1;
			if (!agentManaged && !isOwnPiSession) {
				return { ok: true, filtered: true };
			}
			// Write session to blackboard
			insertSession(this.blackboard, {
				session_id: sessionId,
				cwd: pickString(payload, ["cwd"]),
				model: pickString(payload, ["model"]),
				permission_mode: pickString(payload, ["permission_mode", "permissionMode"]),
				source: pickString(payload, ["source"]),
				transcript_path: pickString(payload, ["transcript_path", "transcriptPath"]),
				agent_managed: agentManaged,
				launch_id: pickString(payload, ["launch_id", "launchId", "AUTONOMA_LAUNCH_ID"]),
				tmux_session: pickString(payload, ["tmux_session", "tmuxSession", "AUTONOMA_TMUX_SESSION"]),
				task_description: pickString(payload, ["task_description", "taskDescription", "AUTONOMA_TASK_DESCRIPTION"]),
				todoist_task_id: pickString(payload, ["todoist_task_id", "todoistTaskId", "AUTONOMA_TODOIST_TASK_ID"]),
				pi_session_id: pickString(payload, ["pi_session_id", "piSessionId", "AUTONOMA_PI_SESSION_ID"]),
				workstream_id: pickString(payload, ["workstream_id", "workstreamId", "AUTONOMA_WORKSTREAM_ID"]),
			});
		} else {
			// For stop/session-end, only process known sessions
			if (!isOwnPiSession) {
				const known = getSessionById(this.blackboard, sessionId);
				if (!known) {
					return { ok: true, filtered: true };
				}
			}

			if (normalized === "stop") {
				updateSessionStop(this.blackboard, sessionId);
			} else if (normalized === "session-end") {
				const reason = pickString(payload, ["reason", "stop_reason", "session_end_reason"]) || "ended";
				markSessionEnded(this.blackboard, sessionId, reason);
			}
		}

		// Only forward "stop" events to Pi — that's when a session goes idle and Pi needs to decide next steps.
		// session-start and session-end are bookkeeping only (already written to SQLite above).
		if (normalized !== "stop") {
			return { ok: true, queued: false, bookkeeping: true };
		}

		const text = formatHookMessage(normalized, payload);
		const queued = this.enqueue({
			text,
			source: "hook",
			metadata: { event: normalized, ...payload },
			deliveryMode: "followUp",
		});
		return { ok: true, queued: true, queueDepth: queued.queueDepth };
	}

	getStatus(): StatusResponse {
		const snapshot = this.sessionState.getSnapshot();
		const whatsapp = this.getWhatsAppStatusSnapshot();
		const blackboardStatus = pingBlackboard(this.blackboard) ? "ok" : "error";
		return {
			ok: true,
			pid: process.pid,
			uptime: Math.floor((Date.now() - this.startedAt) / 1000),
			pi: {
				sessionId: snapshot.sessionId,
				sessionFile: snapshot.sessionFile,
				messageCount: this.piSession?.messages?.length ?? snapshot.messageCount,
				lastPromptAt: snapshot.lastPromptAt,
				queueDepth: snapshot.queueDepth,
				busy: snapshot.busy,
			},
			whatsapp: {
				status: whatsapp.status,
				pid: whatsapp.pid ?? null,
				managedByControlSurface: whatsapp.managedByControlSurface,
				requiresManualAuth: whatsapp.requiresManualAuth,
			},
			blackboard: blackboardStatus,
		};
	}

	getSessionList(): SessionListItem[] {
		return listSessions(this.blackboard);
	}

	async getTranscript(sessionId: string, cursor?: string, limit: number = 50): Promise<SessionTranscriptResponse> {
		const session = getSessionById(this.blackboard, sessionId);
		if (!session?.transcriptPath) {
			return {
				sessionId,
				transcriptPath: null,
				oldestFirst: true as const,
				items: [],
			};
		}
		return readTranscriptPage(sessionId, session.transcriptPath, cursor ?? "0", limit);
	}

	async directSessionMessage(sessionId: string, text: string): Promise<DirectSessionMessageResponse> {
		return directSessionMessage(this, sessionId, text);
	}

	async startWhatsAppDaemon(): Promise<RuntimeWhatsAppStartResponse> {
		const existing = await getDaemonStatus();
		if (existing) {
			this.whatsappStatusCache = this.mapDaemonStatus(existing);
			return { ok: true, ...this.whatsappStatusCache };
		}
		await startDaemonProcess();
		const daemon = await waitForDaemonReady();
		this.whatsappStatusCache = this.mapDaemonStatus(daemon);
		return { ok: true, ...this.whatsappStatusCache };
	}

	async stopWhatsAppDaemon(): Promise<RuntimeWhatsAppStopResponse> {
		const daemon = await stopDaemonProcess();
		this.whatsappStatusCache = this.mapDaemonStatus(daemon);
		return { ok: true, ...this.whatsappStatusCache };
	}

	handleUpgrade(req: http.IncomingMessage, socket: net.Socket, head: Buffer | undefined): boolean {
		return this.wsHub.handleUpgrade(req, socket, head, this.config.controlSurfaceToken);
	}

	private async processQueueItem(item: QueueItem): Promise<void> {
		if (!this.piSession) throw new Error("Pi session not initialized");
		const piSessionId = this.piSession.sessionId;

		// FR-3: Turn starts → set Pi status to 'active'
		const promptAt = this.sessionState.notePrompt(this.piSession.messages.length);
		touchPiPrompt(this.blackboard, piSessionId, promptAt, "active");

		if (this.piSession.isStreaming) {
			await this.piSession.prompt(item.text, {
				streamingBehavior: item.deliveryMode ?? "followUp",
				images: item.images,
			});
		} else {
			await this.piSession.prompt(item.text, { images: item.images });
		}
		this.sessionState.noteEvent(this.piSession.messages.length);

		// FR-3: Turn ends → transition to waiting_for_sessions or waiting_for_user
		this.transitionPiAfterTurn(piSessionId);

		// Auto-surface final assistant message to WhatsApp
		const finalText = this.extractFinalAssistantText();
		if (finalText) {
			try {
				await this.sendWhatsAppCommand({
					command: "send",
					text: `*B-bot:*\n---\n${finalText}`,
					contextRef: null,
				});
				this.wsHub.broadcast({ type: "pi_surfaced", content: finalText, timestamp: new Date().toISOString() });
			} catch (error) {
				this.log(`auto-surface to WhatsApp failed: ${error instanceof Error ? error.message : String(error)}`);
			}
		}
	}

	/**
	 * FR-3: After a Pi turn ends, check managed CC sessions to determine next state.
	 * If active managed sessions exist → waiting_for_sessions
	 * If none → waiting_for_user
	 */
	private transitionPiAfterTurn(piSessionId: string): void {
		try {
			// TODO: countActiveManagedSessionsByPi is being created by another agent in sessions.ts
			// Once available, uncomment the import at top and use:
			// const activeCount = countActiveManagedSessionsByPi(this.blackboard, piSessionId);
			// For now, query directly as a temporary bridge:
			const row = this.blackboard.prepare(
				`SELECT COUNT(*) as count FROM sessions
				 WHERE pi_session_id = ? AND status IN ('working', 'idle') AND agent_managed = 1`,
			).get(piSessionId) as { count: number } | undefined;
			const activeCount = row?.count ?? 0;

			const nextStatus = activeCount > 0 ? "waiting_for_sessions" : "waiting_for_user";
			updatePiSessionStatus(this.blackboard, piSessionId, nextStatus);
		} catch (error) {
			this.log(`pi state transition failed: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	private extractFinalAssistantText(): string | undefined {
		if (!this.piSession?.messages?.length) return undefined;
		// Walk backwards to find the last assistant message
		for (let i = this.piSession.messages.length - 1; i >= 0; i--) {
			const msg = this.piSession.messages[i] as Record<string, unknown> | undefined;
			if (!msg || msg.role !== "assistant") continue;
			const content = msg.content;
			if (typeof content === "string" && content.trim()) return content.trim();
			if (Array.isArray(content)) {
				// Extract text blocks, skip tool_use blocks
				const textParts = content
					.filter((block: any) => block?.type === "text" && typeof block.text === "string")
					.map((block: any) => block.text)
					.join("");
				if (textParts.trim()) return textParts.trim();
			}
			return undefined;
		}
		return undefined;
	}

	private createCustomTools(): Array<any> {
		return [
			{
				name: "query_blackboard",
				label: "Query Blackboard",
				description: "Run read-only SQL against the Autonoma blackboard.",
				parameters: {
					type: "object",
					properties: {
						sql: { type: "string", description: "SELECT or PRAGMA SQL statement" },
					},
					required: ["sql"],
					additionalProperties: false,
				},
				execute: async (_toolCallId: string, params: any) => {
					const rows = this.queryBlackboard(params.sql);
					return { content: [{ type: "text", text: JSON.stringify(rows, null, 2) }], details: rows };
				},
			},
			{
				name: "reload_resources",
				label: "Reload Resources",
				description: "Reload skills, extensions, prompts, context files, and system prompt. Use after skills or AGENTS.md files have been added or changed on disk.",
				parameters: {
					type: "object",
					properties: {},
					additionalProperties: false,
				},
				execute: async () => {
					if (!this.piSession) {
						return { content: [{ type: "text", text: "Error: Pi session not initialized" }], details: {} };
					}
					await this.piSession.reload();
					return {
						content: [{ type: "text", text: "Resources reloaded. Skills, extensions, prompts, context files, and system prompt have been refreshed." }],
						details: { reloadedAt: new Date().toISOString() },
					};
				},
			},
			{
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
					if (!this.piSession) {
						return { content: [{ type: "text", text: "Error: Pi session not initialized" }], details: {} };
					}
					const result = executeCloseWorkstream(this.blackboard, this.piSession.sessionId, params.workstream_id);
					return { content: [{ type: "text", text: result.message }], details: result };
				},
			},
		];
	}

	private queryBlackboard(sql: string): Array<Record<string, unknown>> {
		const normalized = String(sql ?? "").trim().replace(/;+\s*$/, "");
		if (!normalized) throw new Error("SQL is required");
		if (!/^(select|pragma)\b/i.test(normalized)) {
			throw new Error("query_blackboard only allows SELECT and PRAGMA");
		}
		if (normalized.includes(";")) {
			throw new Error("multiple SQL statements are not allowed");
		}
		return this.blackboard.prepare(normalized).all() as Array<Record<string, unknown>>;
	}

	private async sendWhatsAppCommand(command: Record<string, unknown>): Promise<any> {
		try {
			const response = await sendDaemonCommand(command as any);
			if (response.daemon) {
				this.whatsappStatusCache = this.mapDaemonStatus(response.daemon);
			}
			return response;
		} catch {
			await this.startWhatsAppDaemon();
			const response = await sendDaemonCommand(command as any);
			if (response.daemon) {
				this.whatsappStatusCache = this.mapDaemonStatus(response.daemon);
			}
			return response;
		}
	}

	private getWhatsAppStatusSnapshot(): {
		status: ControlSurfaceWhatsAppStatus;
		pid?: number;
		managedByControlSurface: true;
		requiresManualAuth?: boolean;
	} {
		return this.whatsappStatusCache;
	}

	private mapDaemonStatus(daemon?: { status: ControlSurfaceWhatsAppStatus; pid?: number; requiresManualAuth?: boolean }): {
		status: ControlSurfaceWhatsAppStatus;
		pid?: number;
		managedByControlSurface: true;
		requiresManualAuth?: boolean;
	} {
		if (!daemon) {
			return { status: "stopped", managedByControlSurface: true };
		}

		return {
			status: daemon.status,
			pid: daemon.pid,
			managedByControlSurface: true,
			requiresManualAuth: daemon.requiresManualAuth,
		};
	}

	private async refreshWhatsAppStatus(): Promise<void> {
		this.whatsappStatusCache = this.mapDaemonStatus(await getDaemonStatus());
	}

	private async ensureWhatsAppDaemon(): Promise<void> {
		await this.refreshWhatsAppStatus();
		if (this.whatsappStatusCache.status !== "stopped") return;
		try {
			await this.startWhatsAppDaemon();
		} catch (error) {
			this.log(`whatsapp start skipped: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	private startMaintenanceLoop(): void {
		this.maintenanceTimer = setInterval(async () => {
			try {
				pingBlackboard(this.blackboard);
				await this.refreshWhatsAppStatus();
				markStaleSessions(this.blackboard, this.config.stallMinutes, this.config.toolTimeoutMinutes);
				const idleBefore = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
				const oldSessions = findIdleCleanupCandidates(this.blackboard, idleBefore);
				for (const session of oldSessions) {
					if (session.tmuxSession) {
						try {
							await killTmuxSession(session.tmuxSession);
						} catch {
							// ignore
						}
					}
					markSessionEnded(this.blackboard, session.sessionId, "idle_timeout");
				}
				const snapshot = this.sessionState.getSnapshot();
				if (snapshot.busy && snapshot.currentTurnStartedAt) {
					const age = Date.now() - Date.parse(snapshot.currentTurnStartedAt);
					if (age > this.config.toolTimeoutMinutes * 60_000) {
						this.log(`queue turn appears stuck for ${Math.round(age / 1000)}s`);
					}
				}
			} catch (error) {
				this.log(`maintenance error: ${error instanceof Error ? error.message : String(error)}`);
			}
		}, 60_000);
	}

	private ensurePidFile(): void {
		const existingPid = readPid(this.config.controlSurfacePidPath);
		if (existingPid && isPidRunning(existingPid)) {
			throw new Error(`control surface already running with pid ${existingPid}`);
		}
		fs.mkdirSync(path.dirname(this.config.controlSurfacePidPath), { recursive: true });
		fs.writeFileSync(this.config.controlSurfacePidPath, `${process.pid}\n`, "utf8");
	}

	private log(message: string): void {
		const line = `[${new Date().toISOString()}] ${message}`;
		console.log(line);
		fs.appendFileSync(this.config.controlSurfaceLogPath, `${line}\n`, "utf8");
	}

	private async handleWebSocketMessage(
		client: WebSocketClient,
		data: ControlSurfaceWebSocketClientEvent | unknown,
	): Promise<void> {
		if (!data || typeof data !== "object") return;
		const payload = data as ControlSurfaceWebSocketClientEvent;
		if (payload.type === "message" && typeof payload.text === "string") {
			// Route through classifier
			let routerPrefix = "";
			let routerMeta: Record<string, unknown> = {};
			if (this.config.geminiApiKey) {
				try {
					const { classifyMessage } = await import("./router/classify.ts");
					const result = await classifyMessage(payload.text, this.blackboard, this.config.geminiApiKey, this.config.projectsDir);
					routerMeta = { router_action: result.action, router_is_work: result.isWorkMessage };
					if (result.workstream) {
						routerMeta.workstream_id = result.workstream.id;
						routerMeta.workstream_name = result.workstream.name;
						const parts = [
							`[Workstream: "${result.workstream.name}" (${result.workstream.id.slice(0, 8)})]`,
							result.action === "created" ? " [NEW]" : "",
							result.workstream.repo_path ? ` [repo: ${result.workstream.repo_path}]` : "",
							result.workstream.worktree_path ? ` [worktree: ${result.workstream.worktree_path}]` : "",
							"\n",
						];
						routerPrefix = parts.join("");
					}
				} catch (error) {
					this.log(`router classification failed: ${error instanceof Error ? error.message : String(error)}`);
				}
			}

			const queued = this.enqueue({
				text: `${routerPrefix}[Web] User: \"${payload.text}\"`,
				source: "web",
				metadata: { via: "ws", ...routerMeta },
				webClientId: client.id,
				deliveryMode: payload.deliveryMode === "steer" ? "steer" : "followUp",
				images: Array.isArray(payload.images) ? payload.images : undefined,
			});
			this.wsHub.send(client.id, { type: "message_queued", itemId: queued.item.id, queueDepth: queued.queueDepth });

			// Mirror web user message to WhatsApp for complete conversation record
			try {
				await this.sendWhatsAppCommand({
					command: "send",
					text: `*User (web):*\n---\n${payload.text}`,
					contextRef: null,
				});
			} catch (error) {
				this.log(`mirror web message to WhatsApp failed: ${error instanceof Error ? error.message : String(error)}`);
			}
		}
	}
}

function formatHookMessage(eventName: string, payload: Record<string, unknown>): string {
	const sessionId = pickString(payload, ["session_id", "sessionId"]);
	const cwd = pickString(payload, ["cwd"]);
	const transcript = pickString(payload, ["transcript_path", "transcriptPath"]);
	const tmuxSession = pickString(payload, ["tmux_session", "tmuxSession", "AUTONOMA_TMUX_SESSION"]);
	const project = pickString(payload, ["project", "project_label", "projectLabel"]);
	const reason = pickString(payload, ["reason", "stop_reason", "session_end_reason"]);
	const agentManaged = payload.agent_managed === true || payload.agentManaged === true || payload.agent_managed === 1 || payload.agentManaged === 1;
	const lines = [
		`[Hook: ${humanizeHookEvent(eventName)}] ${hookVerb(eventName)}`,
		sessionId ? `Session ID: ${sessionId}` : undefined,
		project ? `Project: ${project}` : undefined,
		cwd ? `CWD: ${cwd}` : undefined,
		transcript ? `Transcript: ${transcript}` : undefined,
		eventName === "session-start" ? `Agent managed: ${agentManaged ? "yes" : "no"}` : undefined,
		tmuxSession ? `Tmux session: ${tmuxSession}` : undefined,
		reason ? `Reason: ${reason}` : undefined,
	].filter(Boolean);
	return lines.join("\n");
}

function pickString(payload: Record<string, unknown>, keys: string[]): string | undefined {
	for (const key of keys) {
		const value = payload[key];
		if (typeof value === "string" && value.trim()) return value;
	}
	return undefined;
}

function humanizeHookEvent(eventName: string): string {
	return eventName
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("");
}

function hookVerb(eventName: string): string {
	switch (eventName) {
		case "session-start":
			return "Claude Code session started.";
		case "stop":
			return "Claude Code session stopped.";
		case "session-end":
			return "Claude Code session ended.";
		case "subagent-start":
			return "Claude subagent started.";
		case "subagent-stop":
			return "Claude subagent stopped.";
		default:
			return "Hook event received.";
	}
}

function readPid(pidPath: string): number | undefined {
	try {
		if (!fs.existsSync(pidPath)) return undefined;
		const value = Number(fs.readFileSync(pidPath, "utf8").trim());
		return Number.isFinite(value) ? value : undefined;
	} catch {
		return undefined;
	}
}

function isPidRunning(pid: number): boolean {
	try {
		process.kill(pid, 0);
		return true;
	} catch {
		return false;
	}
}
