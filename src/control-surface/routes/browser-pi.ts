import type http from "node:http";
import { readPiHistory, readPiHistoryFromMessages } from "../pi/history.ts";
import type { PiHistoryResponse } from "../../contracts/index.ts";
import type { ControlSurfaceRuntime } from "../runtime.ts";
import { sendJson } from "./_shared.ts";

export async function handleBrowserPiHistoryRoute(
  runtime: ControlSurfaceRuntime,
  _request: http.IncomingMessage,
  response: http.ServerResponse,
) {
  const snapshot = runtime.sessionState.getSnapshot();
  if (!snapshot.sessionId) {
    const body: PiHistoryResponse = {
      sessionId: null,
      sessionFile: snapshot.sessionFile ?? null,
      items: [],
    };
    return sendJson(response, 200, body);
  }

  if (runtime.piSession?.sessionId === snapshot.sessionId && Array.isArray(runtime.piSession.messages)) {
    const body = readPiHistoryFromMessages(snapshot.sessionId, snapshot.sessionFile ?? null, runtime.piSession.messages);
    if (body.items.length > 0 || !snapshot.sessionFile) {
      return sendJson(response, 200, body);
    }
  }

  if (!snapshot.sessionFile) {
    const body: PiHistoryResponse = {
      sessionId: snapshot.sessionId,
      sessionFile: null,
      items: [],
    };
    return sendJson(response, 200, body);
  }

  const body = await readPiHistory(snapshot.sessionId, snapshot.sessionFile);
  return sendJson(response, 200, body);
}
