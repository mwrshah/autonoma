import type http from "node:http";
import type { ClaudeHookPayload, HookResponse, HookRouteEventName } from "../../contracts/index.ts";
import type { ControlSurfaceRuntime } from "../runtime.ts";
import { readJsonBody, requireBearer, sendJson } from "./_shared.ts";

export async function handleHookRoute(
  runtime: ControlSurfaceRuntime,
  req: http.IncomingMessage,
  res: http.ServerResponse,
  eventName: HookRouteEventName,
) {
  if (!requireBearer(req, runtime.config.controlSurfaceToken)) {
    return sendJson(res, 401, { ok: false, error: "unauthorized" });
  }
  const payload = await readJsonBody<ClaudeHookPayload>(req);
  const result: HookResponse = runtime.handleHook(eventName, payload);
  return sendJson(res, 200, result);
}
