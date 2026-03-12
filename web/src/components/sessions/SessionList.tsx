import { Link } from "@tanstack/react-router";
import type { SessionSummary } from "../../lib/types";
import { formatDateTime, formatRelativeTime } from "../../lib/utils";
import { Badge } from "../ui/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";

function statusClass(status: SessionSummary["status"]): string {
  return `status-${status}`;
}

export function SessionList({
  items,
  selectedSessionId,
  title = "Claude sessions",
  description = "Latest sessions from the control surface browser API.",
}: {
  items: SessionSummary[];
  selectedSessionId?: string;
  title?: string;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="session-list">
          {items.length === 0 ? <p className="muted">No sessions found.</p> : null}
          {items.map((session) => (
            <Link
              key={session.sessionId}
              className={`session-row ${selectedSessionId === session.sessionId ? "session-row-active" : ""}`}
              params={{ sessionId: session.sessionId }}
              to="/sessions/$sessionId"
            >
              <div className="row row-between gap-sm wrap align-center">
                <div className="stack gap-xs grow">
                  <div className="row gap-sm wrap align-center">
                    <strong>{session.taskDescription || session.sessionId}</strong>
                    <Badge className={statusClass(session.status)}>{session.status}</Badge>
                  </div>
                  <span className="muted tiny">{session.project}</span>
                </div>
                <div className="session-row-meta">
                  <span className="mono tiny">{session.tmuxSession || "no tmux"}</span>
                  <span className="muted tiny">{formatRelativeTime(session.lastEventAt)}</span>
                </div>
              </div>
              <div className="session-grid two-col compact">
                <div>
                  <span className="label">Last event</span>
                  <div>{formatDateTime(session.lastEventAt)}</div>
                </div>
                <div>
                  <span className="label">Transcript</span>
                  <div className="truncate">{session.transcriptPath || "—"}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
