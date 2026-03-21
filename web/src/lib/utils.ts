/** Merge class names, filtering out falsy values. */
export function cn(...inputs: (string | false | null | undefined)[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatDuration(seconds: number | undefined | null): string {
  if (seconds == null || seconds < 0) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatDateTime(iso: string | undefined | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function formatRelativeTime(iso: string | undefined | null): string {
  if (!iso) return "—";
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch {
    return iso;
  }
}

export function prettifyJson(value: unknown): string {
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function safeJsonParse<T>(raw: string | null | undefined): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

import type { MessageSource } from "./types";

/**
 * Parse source label and clean content from Pi-formatted user messages.
 * Formats: `[WhatsApp] User (ref:XXXXX): text`, `[Web] User: "text"`, `[Hook: EventName] text`
 */
export function parseUserMessageSource(
  content: string,
  metadata?: { source?: string },
): {
  source: MessageSource;
  cleanContent: string;
} {
  // Legacy format: [WhatsApp] User (ref:XXXXX): text
  const waMatch = content.match(
    /^\[WhatsApp\] User(?:\s*\(ref:[^)]*\))?:\s*(.*)/s,
  );
  if (waMatch) return { source: "whatsapp", cleanContent: waMatch[1] };

  // Legacy format: [Web] User: "text"
  const webMatch = content.match(/^\[Web\] User:\s*"(.*)"/s);
  if (webMatch) return { source: "web", cleanContent: webMatch[1] };

  // Hook messages (unchanged format)
  const hookMatch = content.match(/^\[Hook(?::\s*[^\]]+)?\]\s*(.*)/s);
  if (hookMatch) return { source: "hook", cleanContent: hookMatch[1] };

  // Cron messages: [Cron stale session check] ..., [Cron idle check] ...
  const cronMatch = content.match(/^\[Cron\s[^\]]*\]\s*(.*)/s);
  if (cronMatch) return { source: "cron", cleanContent: cronMatch[1] };

  // Legacy cron: [Cron] text
  const cronLegacy = content.match(/^\[Cron\]\s*(.*)/s);
  if (cronLegacy) return { source: "cron", cleanContent: cronLegacy[1] };

  // Clean messages (no prefix): use metadata for source attribution
  if (metadata?.source === "whatsapp" || metadata?.source === "hook" || metadata?.source === "cron") {
    return { source: metadata.source, cleanContent: content };
  }

  return { source: "web", cleanContent: content };
}

export function extractToolName(event: unknown): string {
  if (typeof event === "object" && event !== null) {
    const record = event as Record<string, unknown>;
    if (typeof record.tool_name === "string") return record.tool_name;
    if (typeof record.toolName === "string") return record.toolName;
    if (typeof record.tool === "string") return record.tool;
  }
  return "unknown";
}
