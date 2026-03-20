import type http from "node:http";
import type {
  DeliveryMode,
  MessageRequest,
  MessageResponse,
  MessageSource,
} from "../../contracts/index.ts";
import type { ControlSurfaceRuntime } from "../runtime.ts";
import { classifyMessage } from "../router/classify.ts";
import { readJsonBody, requireBearer, sendJson } from "./_shared.ts";

export async function handleMessageRoute(runtime: ControlSurfaceRuntime, req: http.IncomingMessage, res: http.ServerResponse) {
  if (!requireBearer(req, runtime.config.controlSurfaceToken)) {
    return sendJson(res, 401, { ok: false, error: "unauthorized" });
  }

  const body = await readJsonBody<MessageRequest>(req);
  if (!body.text || typeof body.text !== "string") {
    return sendJson(res, 400, { ok: false, error: "text is required" });
  }

  const source = normalizeSource(body.source);
  const deliveryMode: DeliveryMode = body.deliveryMode === "steer" ? "steer" : "followUp";
  const formatted = formatInboundMessage(body.text, source, body.metadata);

  // Router: classify human messages against workstreams (hooks/cron bypass)
  let routerPrefix = "";
  let workstreamMeta: Record<string, unknown> = {};
  if (source === "web" || source === "whatsapp") {
    const classification = await routeMessage(runtime, body.text);
    if (classification) {
      routerPrefix = classification.prefix;
      workstreamMeta = classification.metadata;
    }
  }

  const queued = runtime.enqueue({
    text: routerPrefix + formatted,
    source,
    metadata: { ...body.metadata, ...workstreamMeta },
    deliveryMode,
    images: Array.isArray(body.images) ? body.images : undefined,
  });

  const response: MessageResponse = { ok: true, queued: true, queueDepth: queued.queueDepth };
  return sendJson(res, 200, response);
}

async function routeMessage(
  runtime: ControlSurfaceRuntime,
  rawText: string,
): Promise<{ prefix: string; metadata: Record<string, unknown> } | null> {
  const { geminiApiKey, projectsDir } = runtime.config;
  if (!geminiApiKey) return null;

  try {
    const result = await classifyMessage(rawText, runtime.blackboard, geminiApiKey, projectsDir);
    const meta: Record<string, unknown> = {
      router_action: result.action,
      router_is_work: result.isWorkMessage,
    };
    if (result.workstream) {
      meta.workstream_id = result.workstream.id;
      meta.workstream_name = result.workstream.name;
      const parts = [
        `[Workstream: "${result.workstream.name}" (${result.workstream.id.slice(0, 8)})]`,
        result.action === "created" ? " [NEW]" : "",
        result.workstream.repo_path ? ` [repo: ${result.workstream.repo_path}]` : "",
        result.workstream.worktree_path ? ` [worktree: ${result.workstream.worktree_path}]` : "",
        "\n",
      ];
      return { prefix: parts.join(""), metadata: meta };
    }
    return { prefix: "", metadata: meta };
  } catch {
    return null;
  }
}

function normalizeSource(source?: string): MessageSource {
  switch (source) {
    case "whatsapp":
    case "hook":
    case "cron":
      return source;
    default:
      return "web";
  }
}

function formatInboundMessage(text: string, source: MessageSource, metadata?: Record<string, unknown>): string {
  if (source === "cron" || source === "hook") {
    return text;
  }
  if (source === "whatsapp") {
    const contextRef =
      typeof metadata?.contextRef === "string"
        ? metadata.contextRef
        : typeof metadata?.context_ref === "string"
          ? metadata.context_ref
          : undefined;
    const refTag = contextRef ? ` (ref:${contextRef.slice(-5).toUpperCase()})` : "";
    return `[WhatsApp] User${refTag}: ${text}`;
  }
  if (source === "web") {
    return `[Web] User: \"${text}\"`;
  }
  return text;
}
