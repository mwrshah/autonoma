import { useInfiniteQuery } from "@tanstack/react-query";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useControlSurface } from "~/hooks/use-control-surface";
import type { TranscriptItem } from "~/lib/types";
import { cn, formatDateTime, prettifyJson } from "~/lib/utils";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";

function TranscriptRow({ item }: { item: TranscriptItem }) {
  if (item.kind === "message" && item.role) {
    return (
      <div
        className={cn(
          "rounded-lg border border-border p-3",
          item.role === "user" && "bg-primary/5 border-primary/20",
          item.role === "assistant" && "bg-card",
          item.role === "system" && "bg-amber-500/5 border-amber-500/20",
        )}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-medium text-foreground">
            {item.role}
          </span>
          <span className="text-[10px] text-muted-foreground/60">
            {formatDateTime(item.timestamp ?? undefined)}
          </span>
        </div>
        <div className="markdown-body text-sm">
          <Markdown remarkPlugins={[remarkGfm]}>{item.text ?? ""}</Markdown>
        </div>
      </div>
    );
  }

  if (item.kind === "tool_call" || item.kind === "tool_result") {
    return (
      <div className="rounded-lg border border-border p-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">
              {item.toolName || item.title || "tool"}
            </span>
            <Badge variant="muted">
              {item.kind === "tool_call" ? "call" : "result"}
            </Badge>
          </div>
          <span className="text-[10px] text-muted-foreground/60">
            {formatDateTime(item.timestamp ?? undefined)}
          </span>
        </div>
        {item.text && (
          <pre className="rounded-md bg-background border border-border p-2 text-xs font-mono overflow-auto max-h-32">
            {item.text}
          </pre>
        )}
        {Object.keys(item.metadata).length > 0 && (
          <pre className="rounded-md bg-background border border-border p-2 text-xs font-mono overflow-auto max-h-32 mt-1">
            {prettifyJson(item.metadata)}
          </pre>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium">
          {item.title || item.rawType || item.kind}
        </span>
        <span className="text-[10px] text-muted-foreground/60">
          {formatDateTime(item.timestamp ?? undefined)}
        </span>
      </div>
      {item.text && <p className="text-sm mt-1">{item.text}</p>}
      {Object.keys(item.metadata).length > 0 && (
        <pre className="rounded-md bg-background border border-border p-2 text-xs font-mono overflow-auto max-h-32 mt-1">
          {prettifyJson(item.metadata)}
        </pre>
      )}
    </div>
  );
}

export function TranscriptViewer({ sessionId }: { sessionId: string }) {
  const { apiClient } = useControlSurface();

  const query = useInfiniteQuery({
    queryKey: ["transcript", sessionId],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      apiClient.getTranscript(sessionId, pageParam, 25),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transcript</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {query.isPending && (
            <p className="text-sm text-muted-foreground">
              Loading transcript...
            </p>
          )}
          {query.isError && (
            <p className="text-sm text-destructive">
              Failed to load transcript.
            </p>
          )}
          {items.map((item) => (
            <TranscriptRow key={item.id} item={item} />
          ))}
          {!query.isPending && items.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No transcript items.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 mt-4">
          <p className="text-[10px] text-muted-foreground/50">
            Paginated. The browser never loads the full JSONL.
          </p>
          {query.hasNextPage ? (
            <Button
              variant="secondary"
              size="sm"
              disabled={query.isFetchingNextPage}
              onClick={() => void query.fetchNextPage()}
            >
              {query.isFetchingNextPage ? "Loading..." : "Load more"}
            </Button>
          ) : (
            items.length > 0 && (
              <span className="text-[10px] text-muted-foreground/50">
                End of preview
              </span>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
