import type {
  DirectMessageResponse,
  PiHistoryResponse,
  QueueMessageResponse,
  SessionDetailResponse,
  SessionListResponse,
  StatusResponse,
  TranscriptPage,
} from "./types";

export type ControlSurfaceSettings = {
  baseUrl: string;
  token: string;
  useStubFallback: boolean;
};

export type AutonomaApiClient = ReturnType<typeof createAutonomaApiClient>;

export function createAutonomaApiClient(
  getSettings: () => ControlSurfaceSettings,
) {
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const { baseUrl, token } = getSettings();
    const url = `${baseUrl.replace(/\/$/, "")}${path}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers as Record<string, string> | undefined),
    };

    const response = await fetch(url, { ...init, headers });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  }

  return {
    getStatus: () => request<StatusResponse>("/status"),

    listSessions: () => request<SessionListResponse>("/api/sessions"),

    getSessionDetail: (sessionId: string) =>
      request<SessionDetailResponse>(`/api/sessions/${sessionId}`),

    getTranscript: (
      sessionId: string,
      cursor?: string,
      limit = 25,
    ) => {
      const params = new URLSearchParams({ limit: String(limit) });
      if (cursor) params.set("cursor", cursor);
      return request<TranscriptPage>(
        `/api/sessions/${sessionId}/transcript?${params}`,
      );
    },

    queueMessage: (body: {
      text: string;
      source: string;
      deliveryMode: string;
    }) =>
      request<QueueMessageResponse>("/message", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    sendDirectSessionMessage: (sessionId: string, text: string) =>
      request<DirectMessageResponse>(`/sessions/${sessionId}/message`, {
        method: "POST",
        body: JSON.stringify({ text }),
      }),

    getPiHistory: () => request<PiHistoryResponse>("/api/pi/history"),

    startWhatsApp: () =>
      request<{ ok: boolean }>("/runtime/whatsapp/start", { method: "POST" }),

    stopWhatsApp: () =>
      request<{ ok: boolean }>("/runtime/whatsapp/stop", { method: "POST" }),
  };
}
