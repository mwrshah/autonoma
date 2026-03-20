/**
 * Lazy-load and register the pi-web-ui Lit web components.
 * Components are defined in ../pi-web-ui/chat-components.ts.
 */

let initPromise: Promise<void> | null = null;
let initError: unknown = null;

export function ensurePiWebUiReady(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await import("../pi-web-ui/chat-components");
    } catch (error) {
      initError = error;
      throw error;
    }
  })();

  return initPromise;
}

export function getPiWebUiInitError(): unknown {
  return initError;
}
