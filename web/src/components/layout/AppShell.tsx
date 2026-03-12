import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useControlSurface } from "../../hooks/use-control-surface";
import { formatDuration } from "../../lib/utils";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/Input";

function NavLink({ to, children }: { to: "/" | "/sessions"; children: string }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const active = to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <Link className={`nav-link ${active ? "nav-link-active" : ""}`} to={to}>
      {children}
    </Link>
  );
}

export function AppShell() {
  const { apiClient, settings, updateSettings } = useControlSurface();

  const statusQuery = useQuery({
    queryKey: ["status"],
    queryFn: () => apiClient.getStatus(),
    refetchInterval: 5_000,
  });

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-main">
          <div>
            <p className="eyebrow">Autonoma</p>
            <h1>Web App thin client</h1>
          </div>
          <div className="row gap-sm wrap align-center">
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/sessions">Sessions</NavLink>
          </div>
        </div>

        <div className="header-grid">
          <Card>
            <CardHeader>
              <CardTitle>Control surface</CardTitle>
            </CardHeader>
            <CardContent className="stack gap-sm">
              <label className="field">
                <span className="field-label">Base URL</span>
                <Input
                  value={settings.baseUrl}
                  onChange={(event) => updateSettings({ baseUrl: event.target.value })}
                  placeholder="http://127.0.0.1:18820"
                />
              </label>
              <label className="field">
                <span className="field-label">Bearer token</span>
                <Input
                  type="password"
                  value={settings.token}
                  onChange={(event) => updateSettings({ token: event.target.value })}
                  placeholder="controlSurfaceToken"
                />
              </label>
              <label className="checkbox-row">
                <input
                  checked={settings.useStubFallback}
                  onChange={(event) => updateSettings({ useStubFallback: event.target.checked })}
                  type="checkbox"
                />
                <span>Use stub API/stream fallback when localhost is unavailable</span>
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Runtime health</CardTitle>
            </CardHeader>
            <CardContent className="stack gap-sm">
              {statusQuery.isPending ? <p className="muted">Loading /status…</p> : null}
              {statusQuery.data ? (
                <>
                  <div className="row gap-sm wrap align-center">
                    <Badge>{statusQuery.data.source ?? "live"}</Badge>
                    <Badge>{statusQuery.data.blackboard}</Badge>
                    <Badge>{statusQuery.data.whatsapp.status}</Badge>
                  </div>
                  <div className="session-grid three-col compact">
                    <div>
                      <span className="label">PID</span>
                      <div>{statusQuery.data.pid ?? "—"}</div>
                    </div>
                    <div>
                      <span className="label">Uptime</span>
                      <div>{formatDuration(statusQuery.data.uptime)}</div>
                    </div>
                    <div>
                      <span className="label">Queue depth</span>
                      <div>{statusQuery.data.pi?.queueDepth ?? 0}</div>
                    </div>
                    <div>
                      <span className="label">Pi session</span>
                      <div className="truncate mono">{statusQuery.data.pi?.sessionId || "—"}</div>
                    </div>
                    <div>
                      <span className="label">Pi busy</span>
                      <div>{statusQuery.data.pi?.busy ? "yes" : "no"}</div>
                    </div>
                    <div>
                      <span className="label">Messages</span>
                      <div>{statusQuery.data.pi?.messageCount ?? 0}</div>
                    </div>
                  </div>
                </>
              ) : null}
              <div className="row row-end">
                <Button onClick={() => statusQuery.refetch()} variant="secondary">
                  Refresh status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      <main className="page-container">
        <Outlet />
      </main>
    </div>
  );
}
