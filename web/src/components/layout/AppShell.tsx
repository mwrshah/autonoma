import { useEffect, useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { useControlSurface } from "~/hooks/use-control-surface";
import type { ConnectionState } from "~/lib/types";
import { Sidebar } from "./Sidebar";
import { SettingsDrawer } from "./SettingsDrawer";

export function AppShell() {
  const { wsClient } = useControlSurface();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    wsClient.connectionState,
  );

  useEffect(() => {
    return wsClient.subscribeConnection(setConnectionState);
  }, [wsClient]);

  return (
    <div className="grid grid-cols-[240px_1fr] h-screen overflow-hidden">
      <Sidebar
        connectionState={connectionState}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="flex flex-col min-h-0 overflow-hidden">
        <Outlet />
      </main>

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
