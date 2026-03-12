/**
 * React wrapper for pi-web-ui's <message-list> Lit web component.
 *
 * Imperatively manages the Lit element lifecycle since custom elements
 * need property (not attribute) assignment for complex types like arrays.
 */
import { useEffect, useRef, useState } from "react";
import type { AgentMessage } from "@mariozechner/pi-agent-core";
import { ensurePiWebUiReady, getPiWebUiInitError } from "../../lib/pi-web-ui-init";

export function PiMessageList({
  messages,
  isStreaming = false,
}: {
  messages: AgentMessage[];
  isStreaming?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    ensurePiWebUiReady()
      .then(() => {
        if (cancelled) return;
        console.log("[PiMessageList] pi-web-ui ready");
        setReady(true);
      })
      .catch((initError) => {
        if (cancelled) return;
        console.log("[PiMessageList] pi-web-ui initialization failed", initError);
        setError(initError);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const container = containerRef.current;
    if (!container) return;

    if (!elementRef.current) {
      const el = document.createElement("message-list");
      el.style.display = "block";
      container.appendChild(el);
      elementRef.current = el;
      console.log("[PiMessageList] created <message-list>");
    }

    const el = elementRef.current as any;
    el.messages = messages;
    el.tools = [];
    el.pendingToolCalls = new Set<string>();
    el.isStreaming = isStreaming;
  }, [ready, messages, isStreaming]);

  useEffect(() => {
    return () => {
      elementRef.current = null;
    };
  }, []);

  if (error) {
    const initDetails = getPiWebUiInitError();
    return (
      <div className="error-text tiny" style={{ padding: "1rem" }}>
        Pi Web UI failed to initialize. Check the browser console.
        {initDetails instanceof Error ? <div>{initDetails.message}</div> : null}
      </div>
    );
  }

  if (!ready) {
    return <div className="muted tiny" style={{ padding: "1rem" }}>Loading chat UI…</div>;
  }

  return <div ref={containerRef} style={{ minHeight: "2rem" }} />;
}
