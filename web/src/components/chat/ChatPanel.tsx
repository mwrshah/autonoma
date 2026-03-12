import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useControlSurface } from "../../hooks/use-control-surface";
import {
  timelineToAgentMessages,
  buildStreamingAssistantMessage,
} from "../../lib/pi-web-ui-bridge";
import type {
  ChatTimelineItem,
  ChatTimelineTool,
  ConnectionState,
  DeliveryMode,
} from "../../lib/types";
import { createId, extractToolName } from "../../lib/utils";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Textarea } from "../ui/Textarea";
import { PiMessageList } from "./PiMessageList";
import { PiStreamingMessage } from "./PiStreamingMessage";

const initialTimeline: ChatTimelineItem[] = [];

function connectionLabel(state: ConnectionState): string {
  switch (state) {
    case "connected":
      return "Live WS";
    case "connecting":
      return "Connecting";
    case "reconnecting":
      return "Reconnecting";
    case "stub":
      return "Stub stream";
    default:
      return "Offline";
  }
}

type StatusPill = { id: string; label: string; variant?: "info" | "error" };

export function ChatPanel() {
  const { apiClient, wsClient } = useControlSurface();
  const [draft, setDraft] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("followUp");
  const [timeline, setTimeline] = useState<ChatTimelineItem[]>(initialTimeline);
  const [connectionState, setConnectionState] = useState<ConnectionState>(wsClient.connectionState);
  const [isSending, setIsSending] = useState(false);
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [statusPills, setStatusPills] = useState<StatusPill[]>([]);
  const activeAssistantId = useRef<string | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const addPill = (pill: StatusPill) =>
    setStatusPills((prev) => {
      const next = [...prev.filter((p) => p.id !== pill.id), pill];
      return next.slice(-6); // keep last 6
    });

  const removePill = (id: string) =>
    setStatusPills((prev) => prev.filter((p) => p.id !== id));

  // Convert timeline to AgentMessage format for pi-web-ui rendering
  const agentMessages = useMemo(() => timelineToAgentMessages(timeline), [timeline]);

  // Build streaming message for the live assistant response
  const streamingMessage = useMemo(
    () => (streamingText ? buildStreamingAssistantMessage(streamingText) : null),
    [streamingText],
  );

  // Hydrate from history on mount
  useEffect(() => {
    let cancelled = false;

    void apiClient
      .getPiHistory()
      .then((history) => {
        if (cancelled) return;
        setTimeline((current) => {
          return [...history.items, ...current];
        });
      })
      .catch(() => {
        // Keep the live stream even if history hydration fails.
      });

    return () => {
      cancelled = true;
    };
  }, [apiClient]);

  // Subscribe to WebSocket events
  useEffect(() => {
    const unsubscribe = wsClient.subscribe((message) => {
      if (message.type === "connected") {
        addPill({ id: "ws-connected", label: `WS ${message.clientId.slice(0, 8)}` });
        return;
      }

      if (message.type === "message_queued") {
        addPill({ id: `queued-${message.itemId}`, label: `Queued (depth ${message.queueDepth})` });
        return;
      }

      if (message.type === "queue_item_start") {
        addPill({ id: `processing-${message.item.id}`, label: `Processing ${message.item.source} turn` });
        return;
      }

      if (message.type === "queue_item_end") {
        removePill(`processing-${message.itemId}`);
        removePill(`queued-${message.itemId}`);
        if (message.error) {
          addPill({ id: `error-${message.itemId}`, label: `Error: ${message.error}`, variant: "error" });
        }
        return;
      }

      if (message.type === "text_delta") {
        setStreamingText((prev) => (prev ?? "") + message.delta);
        return;
      }

      if (message.type === "message_end") {
        if (message.role !== "assistant") return;

        // Finalize streaming text into a timeline message
        setStreamingText(null);
        activeAssistantId.current = null;

        const content = message.content || "";
        if (content.trim()) {
          setTimeline((current) => [
            ...current,
            {
              id: createId("assistant"),
              kind: "message",
              role: "assistant",
              content,
              createdAt: message.timestamp ?? new Date().toISOString(),
            },
          ]);
        }
        return;
      }

      if (message.type === "tool_execution_start" || message.type === "tool_execution_end") {
        const eventRecord =
          message.event && typeof message.event === "object"
            ? (message.event as Record<string, unknown>)
            : undefined;

        const toolEvent: ChatTimelineTool = {
          id: createId("tool"),
          kind: "tool",
          tool: message.tool || extractToolName(message.event),
          phase: message.type === "tool_execution_start" ? "start" : "end",
          toolUseId: message.toolUseId,
          args:
            message.type === "tool_execution_start"
              ? message.args ??
                eventRecord?.arguments ??
                eventRecord?.args ??
                eventRecord?.toolArguments
              : undefined,
          result:
            message.type === "tool_execution_end"
              ? message.result ??
                eventRecord?.result ??
                eventRecord?.output ??
                eventRecord?.toolResult
              : undefined,
          isError: message.type === "tool_execution_end" ? message.isError : undefined,
          createdAt: message.timestamp ?? new Date().toISOString(),
        };

        setTimeline((current) => [...current, toolEvent]);
        return;
      }

      if (message.type === "turn_end") {
        setStreamingText(null);
        activeAssistantId.current = null;

        setTimeline((current) => [
          ...current,
          {
            id: createId("divider-turn-end"),
            kind: "divider",
            createdAt: new Date().toISOString(),
          },
        ]);
        return;
      }

      if (message.type === "error") {
        addPill({ id: createId("error"), label: message.message, variant: "error" });
      }
    });

    const unsubscribeConnection = wsClient.subscribeConnection(setConnectionState);
    return () => {
      unsubscribe();
      unsubscribeConnection();
    };
  }, [wsClient]);

  // Auto-scroll when messages or streaming text change
  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    element.scrollTop = element.scrollHeight;
  }, [agentMessages, streamingText]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    setIsSending(true);
    setDraft("");

    setTimeline((current) => [
      ...current,
      {
        id: createId("user"),
        kind: "message",
        role: "user",
        content: text,
        createdAt: new Date().toISOString(),
      },
    ]);

    try {
      await wsClient.sendMessage(text, deliveryMode);
    } catch {
      const response = await apiClient.queueMessage({
        text,
        source: "web",
        deliveryMode,
      });

      addPill({ id: createId("http-queued"), label: `Queued via HTTP (depth ${response.queueDepth})` });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Card className="chat-panel">
      <CardHeader>
        <div className="row row-between gap-sm wrap align-start">
          <div>
            <CardTitle>Pi chat</CardTitle>
            <CardDescription>
              Thin-client chat over the control surface WebSocket stream.
            </CardDescription>
          </div>
          <Badge>{connectionLabel(connectionState)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="stack gap-md">
        {statusPills.length > 0 && (
          <div className="row gap-xs wrap status-pills">
            {statusPills.map((pill) => (
              <Badge key={pill.id} className={pill.variant === "error" ? "badge-error" : "badge-muted"}>
                {pill.label}
              </Badge>
            ))}
          </div>
        )}
        <div ref={viewportRef} className="chat-log">
          <PiMessageList messages={agentMessages} isStreaming={streamingText !== null} />
          <PiStreamingMessage
            message={streamingMessage}
            visible={streamingText !== null}
          />
        </div>

        <form className="stack gap-sm" onSubmit={handleSubmit}>
          <div className="row gap-sm wrap align-center">
            <label className="field-inline">
              <span className="field-label">Delivery</span>
              <select
                className="select"
                value={deliveryMode}
                onChange={(event) => setDeliveryMode(event.target.value as DeliveryMode)}
              >
                <option value="followUp">followUp</option>
                <option value="steer">steer</option>
              </select>
            </label>
            <p className="muted tiny">Default is followUp. Use steer only for operator overrides.</p>
          </div>
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={4}
            placeholder="Ask Pi about active sessions, transcript previews, or runtime state…"
          />
          <div className="row row-between gap-sm wrap align-center">
            <p className="muted tiny">
              Messages stream over /ws. If the socket is unavailable, the UI falls back to POST
              /message.
            </p>
            <Button disabled={isSending || !draft.trim()} type="submit">
              {isSending ? "Sending…" : "Send to Pi"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
