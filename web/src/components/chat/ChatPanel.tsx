import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useControlSurface } from "~/hooks/use-control-surface";
import {
  timelineToAgentMessages,
  buildStreamingAssistantMessage,
  pendingToolCallsFromTimeline,
} from "~/lib/pi-web-ui-bridge";
import type {
  ChatTimelineItem,
  ChatTimelineTool,
  ConnectionState,
  DeliveryMode,
} from "~/lib/types";
import { createId, extractToolName, parseUserMessageSource } from "~/lib/utils";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { PiMessageList } from "./PiMessageList";
import { PiStreamingMessage } from "./PiStreamingMessage";

const initialTimeline: ChatTimelineItem[] = [];

function connectionLabel(state: ConnectionState): string {
  switch (state) {
    case "connected":
      return "Live";
    case "connecting":
      return "Connecting";
    case "reconnecting":
      return "Reconnecting";
    case "stub":
      return "Stub";
    default:
      return "Offline";
  }
}

function connectionVariant(
  state: ConnectionState,
): "success" | "warning" | "muted" | "default" {
  switch (state) {
    case "connected":
      return "success";
    case "connecting":
    case "reconnecting":
      return "warning";
    default:
      return "muted";
  }
}

type StatusPill = { id: string; label: string; variant?: "info" | "error" };

export function ChatPanel() {
  const { apiClient, wsClient } = useControlSurface();
  const [draft, setDraft] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("followUp");
  const [timeline, setTimeline] = useState<ChatTimelineItem[]>(initialTimeline);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    wsClient.connectionState,
  );
  const [isSending, setIsSending] = useState(false);
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [statusPills, setStatusPills] = useState<StatusPill[]>([]);
  const activeAssistantId = useRef<string | null>(null);
  const sentTextsRef = useRef<Set<string>>(new Set());
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isAtBottomRef = useRef(true);

  const addPill = (pill: StatusPill) =>
    setStatusPills((prev) => {
      const next = [...prev.filter((p) => p.id !== pill.id), pill];
      return next.slice(-6);
    });

  const removePill = (id: string) =>
    setStatusPills((prev) => prev.filter((p) => p.id !== id));

  const agentMessages = useMemo(
    () => timelineToAgentMessages(timeline),
    [timeline],
  );

  const pendingToolCalls = useMemo(
    () => pendingToolCallsFromTimeline(timeline),
    [timeline],
  );

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
        setTimeline((current) => [...history.items, ...current]);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [apiClient]);

  // WebSocket events
  useEffect(() => {
    const unsubscribe = wsClient.subscribe((message) => {
      if (message.type === "connected") {
        addPill({
          id: "ws-connected",
          label: `WS ${message.clientId.slice(0, 8)}`,
        });
        return;
      }

      if (message.type === "message_queued") {
        addPill({
          id: `queued-${message.itemId}`,
          label: `Queued (${message.queueDepth})`,
        });
        return;
      }

      if (message.type === "queue_item_start") {
        const sourceLabel =
          message.item.source === "whatsapp" ? "WhatsApp" :
          message.item.source === "hook" ? "Hook" :
          message.item.source === "cron" ? "Cron" : "Web";
        addPill({
          id: `processing-${message.item.id}`,
          label: `Processing ${sourceLabel} message`,
          variant: message.item.source !== "web" ? "info" : undefined,
        });
        return;
      }

      if (message.type === "queue_item_end") {
        removePill(`processing-${message.itemId}`);
        removePill(`queued-${message.itemId}`);
        if (message.error) {
          addPill({
            id: `error-${message.itemId}`,
            label: message.error,
            variant: "error",
          });
        }
        return;
      }

      if (message.type === "text_delta") {
        setStreamingText((prev) => (prev ?? "") + message.delta);
        return;
      }

      if (message.type === "message_end") {
        const content = message.content || "";

        if (message.role === "user") {
          // Deduplicate: skip user messages this client already displayed optimistically.
          // The backend wraps web messages as: [Web] User: "text"
          for (const sent of sentTextsRef.current) {
            if (content === `[Web] User: "${sent}"`) {
              sentTextsRef.current.delete(sent);
              return;
            }
          }
          if (content.trim()) {
            const parsed = parseUserMessageSource(content);
            setTimeline((current) => [
              ...current,
              {
                id: createId("user"),
                kind: "message",
                role: "user",
                content: parsed.cleanContent,
                source: parsed.source,
                createdAt: message.timestamp ?? new Date().toISOString(),
              },
            ]);
          }
          return;
        }

        setStreamingText(null);
        activeAssistantId.current = null;
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

      if (
        message.type === "tool_execution_start" ||
        message.type === "tool_execution_end"
      ) {
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
              ? (message.args ??
                eventRecord?.arguments ??
                eventRecord?.args ??
                eventRecord?.toolArguments)
              : undefined,
          result:
            message.type === "tool_execution_end"
              ? (message.result ??
                eventRecord?.result ??
                eventRecord?.output ??
                eventRecord?.toolResult)
              : undefined,
          isError:
            message.type === "tool_execution_end"
              ? message.isError
              : undefined,
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
        addPill({
          id: createId("error"),
          label: message.message,
          variant: "error",
        });
      }
    });

    const unsubscribeConnection = wsClient.subscribeConnection(
      setConnectionState,
    );
    return () => {
      unsubscribe();
      unsubscribeConnection();
    };
  }, [wsClient]);

  // Track whether the user is at the bottom of the scroll container
  const handleScroll = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const threshold = 50;
    isAtBottomRef.current =
      el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Auto-scroll only when user is already at the bottom
  useEffect(() => {
    const el = viewportRef.current;
    if (!el || !isAtBottomRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [agentMessages, streamingText, timeline]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    setIsSending(true);
    setDraft("");
    isAtBottomRef.current = true;

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
    sentTextsRef.current.add(text);

    try {
      await wsClient.sendMessage(text, deliveryMode);
    } catch {
      const response = await apiClient.queueMessage({
        text,
        source: "web",
        deliveryMode,
      });
      addPill({
        id: createId("http-queued"),
        label: `Queued via HTTP (${response.queueDepth})`,
      });
    } finally {
      setIsSending(false);
    }
  }

  // Ctrl+Enter to send
  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      void handleSubmit(event as unknown as FormEvent);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0">
        <h1 className="text-sm font-semibold text-foreground">Pi</h1>
        <div className="flex items-center gap-2">
          {statusPills.length > 0 && (
            <div className="flex items-center gap-1.5">
              {statusPills.map((pill) => (
                <Badge
                  key={pill.id}
                  variant={pill.variant === "error" ? "error" : "muted"}
                >
                  {pill.label}
                </Badge>
              ))}
            </div>
          )}
          <Badge variant={connectionVariant(connectionState)}>
            {connectionLabel(connectionState)}
          </Badge>
        </div>
      </div>

      {/* Message area — fills all available space */}
      <div
        ref={viewportRef}
        className="flex-1 overflow-auto px-6 py-4 space-y-3"
      >
        <PiMessageList
          messages={agentMessages}
          isStreaming={streamingText !== null}
          pendingToolCalls={pendingToolCalls}
        />
        <PiStreamingMessage
          message={streamingMessage}
          visible={streamingText !== null}
        />
      </div>

      {/* Input area — pinned to bottom */}
      <div className="shrink-0 border-t border-border px-6 py-3">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              placeholder="Message Pi..."
              className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-24 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-2">
              <select
                value={deliveryMode}
                onChange={(e) =>
                  setDeliveryMode(e.target.value as DeliveryMode)
                }
                className="text-[10px] text-muted-foreground bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value="followUp">followUp</option>
                <option value="steer">steer</option>
              </select>
              <Button
                type="submit"
                size="sm"
                disabled={isSending || !draft.trim()}
              >
                {isSending ? "..." : "Send"}
              </Button>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground/50">
            <span className="font-medium text-muted-foreground/70">Web channel</span>
            {" "}&middot; Ctrl+Enter to send &middot; Pi sees all channels (WhatsApp, Hooks, Cron)
          </p>
        </form>
      </div>
    </div>
  );
}
