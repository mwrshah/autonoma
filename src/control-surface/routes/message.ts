import type http from "node:http";
import type {
  DeliveryMode,
  MessageRequest,
  MessageResponse,
  MessageSource,
} from "../../contracts/index.ts";
import type { ControlSurfaceRuntime } from "../runtime.ts";
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
  const queued = runtime.enqueue({
    text: formatted,
    source,
    metadata: body.metadata,
    deliveryMode,
    images: Array.isArray(body.images) ? body.images : undefined,
  });

  const response: MessageResponse = { ok: true, queued: true, queueDepth: queued.queueDepth };
  return sendJson(res, 200, response);
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
