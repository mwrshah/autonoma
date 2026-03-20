import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useControlSurface } from "~/hooks/use-control-surface";
import type {
  ChatTimelineItem,
  ChatTimelineMessage,
  ChatTimelineTool,
  ConnectionState,
  DeliveryMode,
  MessageSource,
} from "~/lib/types";
import { createId, extractToolName, parseUserMessageSource } from "~/lib/utils";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";

/* ── Types ── */

type SurfaceEntry = {
  id: string;
  timestamp: string;
} & (
  | { kind: "inbound"; source: MessageSource; content: string }
  | { kind: "outbound"; channel: "whatsapp" | "all"; content: string }
  | { kind: "hook"; eventName: string; detail: string }
  | { kind: "pi-response"; content: string }
);

/* ── Helpers ── */

const SOURCE_COLORS: Record<MessageSource, string> = {
  whatsapp: "bg-emerald-500",
  web: "bg-orange-400",
  hook: "bg-violet-500",
  cron: "bg-cyan-500",
};

const SOURCE_LABELS: Record<MessageSource, string> = {
  whatsapp: "WhatsApp",
  web: "Web",
  hook: "Hook",
  cron: "Cron",
};

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function timelineToSurfaceEntries(timeline: ChatTimelineItem[]): SurfaceEntry[] {
  const entries: SurfaceEntry[] = [];

  for (const item of timeline) {
    if (item.kind === "divider") continue;

    if (item.kind === "message" && item.role === "user") {
      const msg = item as ChatTimelineMessage;
      const parsed = msg.source
        ? { source: msg.source, cleanContent: msg.content }
        : parseUserMessageSource(msg.content);
      entries.push({
        id: item.id,
        timestamp: item.createdAt,
        kind: "inbound",
        source: parsed.source,
        content: parsed.cleanContent,
      });
      continue;
    }

    if (item.kind === "message" && item.role === "assistant") {
      entries.push({
        id: item.id,
        timestamp: item.createdAt,
        kind: "pi-response",
        content: item.content,
      });
      continue;
    }

    if (item.kind === "tool") {
      const tool = item as ChatTimelineTool;

      // Show send_whatsapp as outgoing WhatsApp messages
      if (tool.tool === "send_whatsapp" && tool.phase === "start") {
        const args =
          tool.args && typeof tool.args === "object"
            ? (tool.args as Record<string, unknown>)
            : {};
        const text = String(args.text ?? "");
        if (text) {
          entries.push({
            id: item.id,
            timestamp: item.createdAt,
            kind: "outbound",
            channel: "whatsapp",
            content: text,
          });
        }
        continue;
      }

      // Show send_to_user as outgoing to all channels
      if (tool.tool === "send_to_user" && tool.phase === "start") {
        const args =
          tool.args && typeof tool.args === "object"
            ? (tool.args as Record<string, unknown>)
            : {};
        const text = String(args.text ?? args.message ?? "");
        if (text) {
          entries.push({
            id: item.id,
            timestamp: item.createdAt,
            kind: "outbound",
            channel: "all",
            content: text,
          });
        }
        continue;
      }

      // Show hook events
      if (tool.tool === "hook") {
        const args =
          tool.args && typeof tool.args === "object"
            ? (tool.args as Record<string, unknown>)
            : {};
        entries.push({
          id: item.id,
          timestamp: item.createdAt,
          kind: "hook",
          eventName: String(args.event ?? tool.tool),
          detail: String(args.detail ?? args.text ?? ""),
        });
        continue;
      }

      // Skip other tool calls — they belong in the Pi Agent view
    }
  }

  return entries;
}

/* ── Entry Renderers ── */

function InboundEntry({ entry }: { entry: SurfaceEntry & { kind: "inbound" } }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0 w-16">
        <span className="text-[10px] text-muted-foreground/60">{formatTime(entry.timestamp)}</span>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${SOURCE_COLORS[entry.source]}`} />
          <span className="text-[10px] font-medium text-muted-foreground">
            {SOURCE_LABELS[entry.source]}
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-0 rounded-lg border border-border bg-card px-3 py-2">
        <p className="text-sm text-foreground whitespace-pre-wrap break-words">
          {entry.content}
        </p>
      </div>
    </div>
  );
}

function OutboundEntry({ entry }: { entry: SurfaceEntry & { kind: "outbound" } }) {
  const isWhatsApp = entry.channel === "whatsapp";
  return (
    <div className="flex gap-3 items-start">
      <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0 w-16">
        <span className="text-[10px] text-muted-foreground/60">{formatTime(entry.timestamp)}</span>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isWhatsApp ? "bg-emerald-500" : "bg-blue-500"}`} />
          <span className="text-[10px] font-medium text-muted-foreground">
            {isWhatsApp ? "WA Out" : "Notify"}
          </span>
        </div>
      </div>
      <div
        className={`flex-1 min-w-0 rounded-lg border px-3 py-2 ${
          isWhatsApp
            ? "border-emerald-500/25 bg-emerald-500/5"
            : "border-blue-500/25 bg-blue-500/5"
        }`}
      >
        <p className="text-sm text-foreground whitespace-pre-wrap break-words">
          {entry.content}
        </p>
      </div>
    </div>
  );
}

function PiResponseEntry({ entry }: { entry: SurfaceEntry & { kind: "pi-response" } }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0 w-16">
        <span className="text-[10px] text-muted-foreground/60">{formatTime(entry.timestamp)}</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-[10px] font-medium text-muted-foreground">Pi</span>
        </div>
      </div>
      <div className="flex-1 min-w-0 rounded-lg border border-border bg-muted/30 px-3 py-2">
        <p className="text-sm text-foreground whitespace-pre-wrap break-words">
          {entry.content}
        </p>
      </div>
    </div>
  );
}

function HookEntry({ entry }: { entry: SurfaceEntry & { kind: "hook" } }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0 w-16">
        <span className="text-[10px] text-muted-foreground/60">{formatTime(entry.timestamp)}</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-violet-500" />
          <span className="text-[10px] font-medium text-muted-foreground">Hook</span>
        </div>
      </div>
      <div className="flex-1 min-w-0 rounded-lg border border-violet-500/25 bg-violet-500/5 px-3 py-2">
        <p className="text-xs font-medium text-muted-foreground mb-1">{entry.eventName}</p>
        {entry.detail && (
          <p className="text-sm text-foreground whitespace-pre-wrap break-words">
            {entry.detail}
          </p>
        )}
      </div>
    </div>
  );
}

function SurfaceEntryRenderer({ entry }: { entry: SurfaceEntry }) {
  switch (entry.kind) {
    case "inbound":
      return <InboundEntry entry={entry} />;
    case "outbound":
      return <OutboundEntry entry={entry} />;
    case "pi-response":
      return <PiResponseEntry entry={entry} />;
    case "hook":
      return <HookEntry entry={entry} />;
  }
}

/* ── Main Component ── */

export function InputSurface() {
  const { apiClient, wsClient } = useControlSurface();
  const [draft, setDraft] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("followUp");
  const [timeline, setTimeline] = useState<ChatTimelineItem[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    wsClient.connectionState,
  );
  const [isSending, setIsSending] = useState(false);
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const activeAssistantId = useRef<string | null>(null);
  const sentTextsRef = useRef<Set<string>>(new Set());
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isAtBottomRef = useRef(true);

  const entries = useMemo(() => timelineToSurfaceEntries(timeline), [timeline]);

  // Scroll viewport to bottom (used on mount and after history hydration)
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = viewportRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  // Hydrate from history, then scroll to bottom
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

  // WebSocket events — same as ChatPanel but we store into timeline
  useEffect(() => {
    const unsubscribe = wsClient.subscribe((message) => {
      if (message.type === "text_delta") {
        setStreamingText((prev) => (prev ?? "") + message.delta);
        return;
      }

      if (message.type === "message_end") {
        const content = message.content || "";
        if (message.role === "user") {
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

  // Scroll tracking
  const handleScroll = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    isAtBottomRef.current =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || !isAtBottomRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [entries, streamingText]);

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
        source: "web" as MessageSource,
        createdAt: new Date().toISOString(),
      },
    ]);
    sentTextsRef.current.add(text);

    try {
      await wsClient.sendMessage(text, deliveryMode);
    } catch {
      await apiClient.queueMessage({
        text,
        source: "web",
        deliveryMode,
      });
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      void handleSubmit(event as unknown as FormEvent);
    }
  }

  const connectionLabel =
    connectionState === "connected" ? "Live" :
    connectionState === "connecting" || connectionState === "reconnecting" ? "Connecting" :
    "Offline";
  const connectionVariant =
    connectionState === "connected" ? "success" as const :
    connectionState === "connecting" || connectionState === "reconnecting" ? "warning" as const :
    "muted" as const;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-foreground">Input Surface</h1>
          <p className="text-[10px] text-muted-foreground/60">All channels flowing through Pi</p>
        </div>
        <Badge variant={connectionVariant}>{connectionLabel}</Badge>
      </div>

      {/* Activity feed */}
      <div
        ref={viewportRef}
        className="flex-1 overflow-auto px-6 py-4 space-y-3"
      >
        {entries.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground/50">No activity yet</p>
          </div>
        )}
        {entries.map((entry) => (
          <SurfaceEntryRenderer key={entry.id} entry={entry} />
        ))}
        {streamingText && (
          <div className="flex gap-3 items-start animate-pulse">
            <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0 w-16">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-[10px] font-medium text-muted-foreground">Pi</span>
              </div>
            </div>
            <div className="flex-1 min-w-0 rounded-lg border border-border bg-muted/30 px-3 py-2">
              <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                {streamingText}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-border px-6 py-3">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Message Pi via Web..."
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
            {" "}&middot; Ctrl+Enter to send &middot; Messages from WhatsApp, Hooks, and Cron also appear here
          </p>
        </form>
      </div>
    </div>
  );
}
