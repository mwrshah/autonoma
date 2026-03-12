import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useControlSurface } from "../../hooks/use-control-surface";
import type { SessionDetail as SessionDetailType, TmuxSessionInspection } from "../../lib/types";
import { formatDateTime, safeJsonParse } from "../../lib/utils";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Textarea } from "../ui/Textarea";

export function SessionDetail({
  session,
  tmux,
}: {
  session: SessionDetailType;
  tmux?: TmuxSessionInspection | null;
}) {
  const { apiClient } = useControlSurface();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (text: string) => apiClient.sendDirectSessionMessage(session.sessionId, text),
    onSuccess: (result) => {
      if (result.ok) {
        void queryClient.invalidateQueries({ queryKey: ["session", session.sessionId] });
        void queryClient.invalidateQueries({ queryKey: ["sessions"] });
        void queryClient.invalidateQueries({ queryKey: ["transcript", session.sessionId] });
        setResultMessage(`Delivered via ${result.delivery}.`);
        setDraft("");
        return;
      }

      const suffix = result.reason ? ` (${result.reason})` : "";
      setResultMessage(`Not delivered${suffix}.`);
    },
  });

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setResultMessage(null);
    await mutation.mutateAsync(text);
  }

  return (
    <div className="stack gap-md">
      <Card>
        <CardHeader>
          <div className="row row-between gap-sm wrap align-start">
            <div>
              <CardTitle>{session.taskDescription || session.sessionId}</CardTitle>
              <CardDescription>{session.project}</CardDescription>
            </div>
            <Badge className={`status-${session.status}`}>{session.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="stack gap-md">
          <div className="session-grid three-col">
            <div>
              <span className="label">Tmux session</span>
              <div className="mono">{session.tmuxSession || "—"}</div>
            </div>
            <div>
              <span className="label">Last event</span>
              <div>{formatDateTime(session.lastEventAt)}</div>
            </div>
            <div>
              <span className="label">Started</span>
              <div>{formatDateTime(session.startedAt)}</div>
            </div>
            <div>
              <span className="label">Transcript path</span>
              <div className="truncate mono">{session.transcriptPath || "—"}</div>
            </div>
            <div>
              <span className="label">CWD</span>
              <div className="truncate mono">{session.cwd || "—"}</div>
            </div>
            <div>
              <span className="label">Model</span>
              <div>{session.model || "—"}</div>
            </div>
          </div>

          {tmux ? (
            <div className="stack gap-sm">
              <div>
                <h3 className="subheading">Tmux inspection</h3>
                <p className="muted tiny">Extra live state returned by GET /api/sessions/:sessionId.</p>
              </div>
              <div className="session-grid three-col compact">
                <div>
                  <span className="label">Exists</span>
                  <div>{tmux.exists ? "yes" : "no"}</div>
                </div>
                <div>
                  <span className="label">Attached</span>
                  <div>{tmux.attached ? "yes" : "no"}</div>
                </div>
                <div>
                  <span className="label">Pane state</span>
                  <div>{tmux.pane?.uiState || "—"}</div>
                </div>
                <div>
                  <span className="label">Current command</span>
                  <div className="truncate mono">{tmux.pane?.currentCommand || "—"}</div>
                </div>
                <div>
                  <span className="label">Pane target</span>
                  <div className="mono">{tmux.pane?.target || "—"}</div>
                </div>
                <div>
                  <span className="label">Pane PID</span>
                  <div>{tmux.pane?.panePid ?? "—"}</div>
                </div>
              </div>
              {tmux.pane?.capture ? <pre>{tmux.pane.capture}</pre> : null}
            </div>
          ) : null}

          <form className="stack gap-sm" onSubmit={handleSubmit}>
            <div>
              <h3 className="subheading">Direct session message</h3>
              <p className="muted tiny">
                Sends POST /sessions/:sessionId/message. The control surface decides whether tmux injection is safe.
              </p>
            </div>
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={3}
              placeholder="Please continue with spec 02."
            />
            <div className="row row-between gap-sm wrap align-center">
              <div className="muted tiny">Idle sessions can inject. Busy or stale sessions fail closed.</div>
              <Button disabled={mutation.isPending || !draft.trim()} type="submit">
                {mutation.isPending ? "Sending…" : "Send direct message"}
              </Button>
            </div>
            {resultMessage ? <div className="notice">{resultMessage}</div> : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent blackboard events</CardTitle>
          <CardDescription>Latest event rows surfaced by GET /api/sessions/:sessionId.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="stack gap-sm">
            {session.recentEvents.length === 0 ? <p className="muted">No recent events.</p> : null}
            {session.recentEvents.map((event) => {
              const parsed = safeJsonParse<Record<string, unknown>>(event.payload);
              return (
                <div key={event.id} className="event-row">
                  <div className="row row-between gap-sm wrap align-center">
                    <div className="row gap-sm wrap align-center">
                      <strong>{event.event_name}</strong>
                      {event.tool_name ? <Badge>{event.tool_name}</Badge> : null}
                    </div>
                    <span className="muted tiny">{formatDateTime(event.timestamp)}</span>
                  </div>
                  {parsed ? <pre>{JSON.stringify(parsed, null, 2)}</pre> : event.payload ? <pre>{event.payload}</pre> : null}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
