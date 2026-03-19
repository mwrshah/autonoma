import { Badge } from "~/components/ui/Badge";
import { prettifyJson } from "~/lib/utils";
import type { ChatTimelineTool } from "~/lib/types";

export function ToolEventList({ items }: { items: ChatTimelineTool[] }) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-lg border border-border p-3 space-y-2"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="muted">
                {item.phase === "start" ? "start" : "end"}
              </Badge>
              <span className="text-sm font-medium">{item.tool}</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground/60">
              {new Date(item.createdAt).toLocaleTimeString()}
            </span>
          </div>
          {item.toolUseId && (
            <p className="text-[10px] font-mono text-muted-foreground/50">
              {item.toolUseId}
            </p>
          )}
          {item.args !== undefined && (
            <pre className="rounded-md bg-background border border-border p-2 text-xs font-mono overflow-auto max-h-32">
              {prettifyJson(item.args)}
            </pre>
          )}
          {item.result !== undefined && (
            <pre className="rounded-md bg-background border border-border p-2 text-xs font-mono overflow-auto max-h-32">
              {prettifyJson(item.result)}
            </pre>
          )}
          {item.isError && (
            <p className="text-xs text-destructive">Tool reported an error.</p>
          )}
        </div>
      ))}
    </div>
  );
}
