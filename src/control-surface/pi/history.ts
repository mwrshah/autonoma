import fs from "node:fs";
import { createReadStream } from "node:fs";
import readline from "node:readline";
import type { PiHistoryItem, PiHistoryResponse } from "../../contracts/index.ts";

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function isoTimestamp(...candidates: unknown[]): string {
  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number" && Number.isFinite(value)) return new Date(value).toISOString();
  }
  return new Date().toISOString();
}

function firstText(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value;
  if (Array.isArray(value)) {
    const joined = value.map((item) => firstText(item)).filter((item): item is string => Boolean(item)).join("\n");
    return joined.trim() ? joined : undefined;
  }
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  return [record.text, record.message, record.content, record.summary, record.error]
    .map((item) => firstText(item))
    .find((item): item is string => Boolean(item));
}

function pushMessage(
  items: PiHistoryItem[],
  id: string,
  role: "user" | "assistant" | "system",
  content: string,
  createdAt: string,
  suffix = "message",
): void {
  const normalized = content.trim();
  if (!normalized) return;
  items.push({
    id: `${id}:${suffix}`,
    kind: "message",
    role,
    content: normalized,
    createdAt,
  });
}

function parseMessageContent(
  items: PiHistoryItem[],
  messageId: string,
  role: "user" | "assistant" | "system",
  createdAt: string,
  content: unknown,
): void {
  if (!Array.isArray(content)) {
    const text = firstText(content);
    if (text) pushMessage(items, messageId, role, text, createdAt);
    return;
  }

  let textBuffer: string[] = [];
  let toolIndex = 0;
  let messageIndex = 0;

  const flushText = () => {
    if (textBuffer.length === 0) return;
    pushMessage(items, messageId, role, textBuffer.join(""), createdAt, `message-${messageIndex}`);
    textBuffer = [];
    messageIndex += 1;
  };

  for (const block of content) {
    const record = asRecord(block);
    const type = typeof record.type === "string" ? record.type : undefined;

    if (type === "text" && typeof record.text === "string") {
      textBuffer.push(record.text);
      continue;
    }

    if (type === "toolCall") {
      flushText();
      items.push({
        id: `${messageId}:tool-start-${toolIndex}`,
        kind: "tool",
        tool: typeof record.name === "string" && record.name.trim() ? record.name : "unknown_tool",
        phase: "start",
        toolUseId: typeof record.id === "string" ? record.id : undefined,
        args: record.arguments,
        createdAt,
      });
      toolIndex += 1;
      continue;
    }
  }

  flushText();
}

function parseMessageRecord(messageRecord: Record<string, unknown>, createdAt: string, messageId: string, items: PiHistoryItem[]): void {
  const role = messageRecord.role;

  if (role === "user" || role === "assistant" || role === "system") {
    parseMessageContent(items, messageId, role, createdAt, messageRecord.content);
    return;
  }

  if (role === "toolResult") {
    const resultText = firstText(messageRecord.content);
    items.push({
      id: `${messageId}:tool-end`,
      kind: "tool",
      tool:
        typeof messageRecord.toolName === "string" && messageRecord.toolName.trim()
          ? messageRecord.toolName
          : "unknown_tool",
      phase: "end",
      toolUseId: typeof messageRecord.toolCallId === "string" ? messageRecord.toolCallId : undefined,
      result: messageRecord.details ?? resultText,
      isError: Boolean(messageRecord.isError),
      createdAt,
    });
  }
}

/**
 * Keep only the last assistant message per turn (before each user message or end of list).
 * This mirrors the live path where only `pi_surfaced` (the final assistant text) is shown.
 */
function keepOnlySurfacedAssistant(items: PiHistoryItem[]): PiHistoryItem[] {
  const result: PiHistoryItem[] = [];
  let lastAssistantIdx = -1;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const isAssistantMsg = item.kind === "message" && item.role === "assistant";
    const isUserMsg = item.kind === "message" && item.role === "user";

    if (isAssistantMsg) {
      lastAssistantIdx = i;
      continue; // defer — only emit the last one per turn
    }

    if (isUserMsg && lastAssistantIdx >= 0) {
      result.push(items[lastAssistantIdx]);
      lastAssistantIdx = -1;
    }

    result.push(item);
  }

  // Flush trailing assistant message (last turn with no following user message)
  if (lastAssistantIdx >= 0) {
    result.push(items[lastAssistantIdx]);
  }

  return result;
}

function parseHistoryLine(line: string, lineNumber: number, items: PiHistoryItem[]): void {
  const parsed = JSON.parse(line) as Record<string, unknown>;
  if (parsed.type !== "message") return;

  const messageRecord = asRecord(parsed.message);
  const createdAt = isoTimestamp(messageRecord.timestamp, parsed.timestamp);
  const messageId = typeof parsed.id === "string" && parsed.id.trim() ? parsed.id : `line-${lineNumber}`;
  parseMessageRecord(messageRecord, createdAt, messageId, items);
}

export function readPiHistoryFromMessages(
  sessionId: string,
  sessionFile: string | null,
  messages: Array<unknown>,
): PiHistoryResponse {
  const items: PiHistoryItem[] = [];

  messages.forEach((message, index) => {
    const record = asRecord(message);
    const createdAt = isoTimestamp(record.timestamp);
    const messageId = typeof record.id === "string" && record.id.trim() ? record.id : `memory-${index}`;
    parseMessageRecord(record, createdAt, messageId, items);
  });

  return {
    sessionId,
    sessionFile,
    items: keepOnlySurfacedAssistant(items),
  };
}

export async function readPiHistory(sessionId: string, sessionFile: string): Promise<PiHistoryResponse> {
  if (!fs.existsSync(sessionFile)) {
    return {
      sessionId,
      sessionFile,
      items: [],
    };
  }

  const stream = createReadStream(sessionFile, { encoding: "utf8" });
  const lines = readline.createInterface({ input: stream, crlfDelay: Infinity });
  const items: PiHistoryItem[] = [];
  let lineNumber = 0;

  try {
    for await (const rawLine of lines) {
      lineNumber += 1;
      const line = rawLine.trim();
      if (!line) continue;
      try {
        parseHistoryLine(line, lineNumber, items);
      } catch {
        // Ignore malformed lines and continue reading the session.
      }
    }
  } finally {
    lines.close();
    stream.close();
  }

  return {
    sessionId,
    sessionFile,
    items: keepOnlySurfacedAssistant(items),
  };
}
