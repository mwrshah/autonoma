import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ClipboardEvent } from "react";
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
  ImageAttachment,
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
  const [pendingImages, setPendingImages] = useState<ImageAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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

  // Scroll viewport to bottom (used on mount and after history hydration)
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = viewportRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  // Hydrate from history on mount, then scroll to bottom
  useEffect(() => {
    let cancelled = false;
    void apiClient
      .getPiHistory()
      .then((history) => {
        if (cancelled) return;
        setTimeline((current) => [...history.items, ...current]);
        scrollToBottom();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [apiClient, scrollToBottom]);

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

  function addImageFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!imageFiles.length) return;
    for (const file of imageFiles) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        if (base64) {
          setPendingImages((prev) => [...prev, { data: base64, mimeType: file.type }]);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function removeImage(index: number) {
    setPendingImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    const images = pendingImages.length ? [...pendingImages] : undefined;
    if (!text && !images?.length) return;

    setIsSending(true);
    setDraft("");
    setPendingImages([]);
    isAtBottomRef.current = true;

    setTimeline((current) => [
      ...current,
      {
        id: createId("user"),
        kind: "message",
        role: "user",
        content: text || "(image)",
        images,
        createdAt: new Date().toISOString(),
      },
    ]);
    if (text) sentTextsRef.current.add(text);

    try {
      await wsClient.sendMessage(text || "(image)", deliveryMode, images);
    } catch {
      const response = await apiClient.queueMessage({
        text: text || "(image)",
        source: "web",
        deliveryMode,
        images,
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

  function handlePaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const items = event.clipboardData?.items;
    if (!items) return;
    const imageFiles: File[] = [];
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) imageFiles.push(file);
      }
    }
    if (imageFiles.length) {
      event.preventDefault();
      addImageFiles(imageFiles);
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
          {pendingImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {pendingImages.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={`data:${img.mimeType};base64,${img.data}`}
                    alt="Pending attachment"
                    className="w-16 h-16 object-cover rounded-lg border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              rows={3}
              placeholder="Message Pi..."
              className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-32 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) addImageFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                title="Attach image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              </button>
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
                disabled={isSending || (!draft.trim() && !pendingImages.length)}
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
