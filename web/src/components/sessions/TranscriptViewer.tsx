import { useInfiniteQuery } from "@tanstack/react-query";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useControlSurface } from "../../hooks/use-control-surface";
import type { TranscriptItem } from "../../lib/types";
import { formatDateTime, prettifyJson } from "../../lib/utils";
import { Button } from "../ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";

function TranscriptRow({ item }: { item: TranscriptItem }) {
  if (item.kind === "message" && item.role) {
    return (
      <div className={`chat-bubble chat-${item.role}`}>
        <div className="row row-between gap-sm wrap align-center">
          <strong>{item.role}</strong>
          <span className="tiny muted">{formatDateTime(item.timestamp ?? undefined)}</span>
        </div>
        <div className="markdown-body">
          <Markdown remarkPlugins={[remarkGfm]}>{item.text ?? ""}</Markdown>
        </div>
      </div>
    );
  }

  if (item.kind === "tool_call" || item.kind === "tool_result") {
    return (
      <div className="tool-event">
        <div className="row row-between gap-sm wrap align-center">
          <strong>
            {item.toolName || item.title || "tool"} · {item.kind === "tool_call" ? "start" : "end"}
          </strong>
          <span className="tiny muted">{formatDateTime(item.timestamp ?? undefined)}</span>
        </div>
        {item.text ? <pre>{item.text}</pre> : null}
        {Object.keys(item.metadata).length > 0 ? <pre>{prettifyJson(item.metadata)}</pre> : null}
      </div>
    );
  }

  return (
    <div className="event-row">
      <div className="row row-between gap-sm wrap align-center">
        <strong>{item.title || item.rawType || item.kind}</strong>
        <span className="tiny muted">{formatDateTime(item.timestamp ?? undefined)}</span>
      </div>
      {item.text ? <p>{item.text}</p> : null}
      {Object.keys(item.metadata).length > 0 ? <pre>{prettifyJson(item.metadata)}</pre> : null}
    </div>
  );
}

export function TranscriptViewer({ sessionId }: { sessionId: string }) {
  const { apiClient } = useControlSurface();

  const query = useInfiniteQuery({
    queryKey: ["transcript", sessionId],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => apiClient.getTranscript(sessionId, pageParam, 25),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transcript preview</CardTitle>
        <CardDescription>
          Paginated oldest-first transcript chunks from GET /api/sessions/:sessionId/transcript.
        </CardDescription>
      </CardHeader>
      <CardContent className="stack gap-md">
        {query.isPending ? <p className="muted">Loading transcript…</p> : null}
        {query.isError ? <p className="error-text">Failed to load transcript preview.</p> : null}
        <div className="stack gap-sm transcript-list">
          {items.map((item) => (
            <TranscriptRow key={item.id} item={item} />
          ))}
          {!query.isPending && items.length === 0 ? <p className="muted">No transcript items available.</p> : null}
        </div>
        <div className="row row-between gap-sm wrap align-center">
          <p className="muted tiny">Large transcripts stay paginated; the browser never assumes the full JSONL fits in memory.</p>
          {query.hasNextPage ? (
            <Button disabled={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()} variant="secondary">
              {query.isFetchingNextPage ? "Loading…" : "Load next chunk"}
            </Button>
          ) : (
            <span className="muted tiny">End of preview</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
