import { Badge } from "../ui/Badge";
import { prettifyJson } from "../../lib/utils";
import type { ChatTimelineTool } from "../../lib/types";

export function ToolEventList({ items }: { items: ChatTimelineTool[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="stack gap-sm">
      {items.map((item) => (
        <div key={item.id} className="tool-event">
          <div className="row row-between gap-sm wrap">
            <div className="row gap-sm wrap align-center">
              <Badge>{item.phase === "start" ? "Tool start" : "Tool end"}</Badge>
              <strong>{item.tool}</strong>
            </div>
            <span className="muted mono tiny">{new Date(item.createdAt).toLocaleTimeString()}</span>
          </div>
          {item.toolUseId ? <div className="muted tiny mono">toolUseId: {item.toolUseId}</div> : null}
          {item.args !== undefined ? <pre>{prettifyJson(item.args)}</pre> : null}
          {item.result !== undefined ? <pre>{prettifyJson(item.result)}</pre> : null}
          {item.isError ? <div className="error-text tiny">Tool execution reported an error.</div> : null}
        </div>
      ))}
    </div>
  );
}
