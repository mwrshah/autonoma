import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import {
  createAutonomaApiClient,
  type AutonomaApiClient,
  type ControlSurfaceSettings,
} from "~/lib/api";
import { AutonomaWsClient } from "~/lib/ws";

const STORAGE_KEY = "autonoma.web.control-surface";

function getDefaultSettings(): ControlSurfaceSettings {
  if (typeof window === "undefined") {
    return {
      baseUrl: "http://127.0.0.1:18820",
      token: "",
      useStubFallback: true,
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ControlSurfaceSettings>;
      return {
        baseUrl:
          parsed.baseUrl ||
          import.meta.env.VITE_AUTONOMA_BASE_URL ||
          "http://127.0.0.1:18820",
        token:
          parsed.token || import.meta.env.VITE_AUTONOMA_TOKEN || "",
        useStubFallback: parsed.useStubFallback ?? true,
      };
    }
  } catch {
    // Ignore corrupted storage.
  }

  return {
    baseUrl:
      import.meta.env.VITE_AUTONOMA_BASE_URL || "http://127.0.0.1:18820",
    token: import.meta.env.VITE_AUTONOMA_TOKEN || "",
    useStubFallback: true,
  };
}

type ControlSurfaceContextValue = {
  settings: ControlSurfaceSettings;
  updateSettings: (next: Partial<ControlSurfaceSettings>) => void;
  apiClient: AutonomaApiClient;
  wsClient: AutonomaWsClient;
};

const ControlSurfaceContext =
  createContext<ControlSurfaceContextValue | null>(null);

export function ControlSurfaceProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<ControlSurfaceSettings>(
    () => getDefaultSettings(),
  );
  const settingsRef = useRef(settings);
  const didMountRef = useRef(false);

  useEffect(() => {
    settingsRef.current = settings;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings]);

  const apiClient = useMemo(
    () => createAutonomaApiClient(() => settingsRef.current),
    [],
  );
  const wsClient = useMemo(
    () => new AutonomaWsClient(() => settingsRef.current),
    [],
  );

  useEffect(() => {
    wsClient.connect();
    return () => {
      wsClient.disconnect();
    };
  }, [wsClient]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    wsClient.reconnect();
  }, [settings.baseUrl, settings.token, settings.useStubFallback, wsClient]);

  const value = useMemo<ControlSurfaceContextValue>(
    () => ({
      settings,
      updateSettings: (next) =>
        setSettings((current) => ({ ...current, ...next })),
      apiClient,
      wsClient,
    }),
    [apiClient, settings, wsClient],
  );

  return (
    <ControlSurfaceContext.Provider value={value}>
      {children}
    </ControlSurfaceContext.Provider>
  );
}

export function useControlSurface(): ControlSurfaceContextValue {
  const value = useContext(ControlSurfaceContext);
  if (!value) {
    throw new Error(
      "useControlSurface must be used within ControlSurfaceProvider",
    );
  }
  return value;
}
