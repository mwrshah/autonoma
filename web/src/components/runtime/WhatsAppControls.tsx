import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useControlSurface } from "../../hooks/use-control-surface";
import type { StatusResponse } from "../../lib/types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";

export function WhatsAppControls({ status }: { status?: StatusResponse }) {
  const { apiClient } = useControlSurface();
  const queryClient = useQueryClient();

  const startMutation = useMutation({
    mutationFn: () => apiClient.startWhatsApp(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["status"] }),
  });

  const stopMutation = useMutation({
    mutationFn: () => apiClient.stopWhatsApp(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["status"] }),
  });

  const daemonStatus = status?.whatsapp.status ?? "unknown";

  return (
    <Card>
      <CardHeader>
        <div className="row row-between gap-sm wrap align-start">
          <div>
            <CardTitle>WhatsApp runtime</CardTitle>
            <CardDescription>Manual auth stays terminal-driven in v1. The browser only controls runtime start/stop.</CardDescription>
          </div>
          <Badge>{daemonStatus}</Badge>
        </div>
      </CardHeader>
      <CardContent className="stack gap-sm">
        <div className="session-grid two-col compact">
          <div>
            <span className="label">Daemon PID</span>
            <div>{status?.whatsapp.pid ?? "—"}</div>
          </div>
          <div>
            <span className="label">Runtime ownership</span>
            <div>{status?.whatsapp.managedByControlSurface ? "control surface" : "unknown"}</div>
          </div>
        </div>
        <div className="row gap-sm wrap">
          <Button disabled={startMutation.isPending || daemonStatus === "connected" || daemonStatus === "starting"} onClick={() => startMutation.mutate()}>
            {startMutation.isPending ? "Starting…" : "Start daemon"}
          </Button>
          <Button disabled={stopMutation.isPending || daemonStatus === "stopped"} onClick={() => stopMutation.mutate()} variant="secondary">
            {stopMutation.isPending ? "Stopping…" : "Stop daemon"}
          </Button>
        </div>
        {startMutation.error ? <p className="error-text">Failed to start WhatsApp daemon.</p> : null}
        {stopMutation.error ? <p className="error-text">Failed to stop WhatsApp daemon.</p> : null}
      </CardContent>
    </Card>
  );
}
