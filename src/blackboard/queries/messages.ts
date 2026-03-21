import type { BlackboardDatabase } from "../db.ts";
import type { MessageRow, UnifiedMessageSource } from "../../contracts/index.ts";
import { insertMessage as writeMessage, type InsertMessageInput } from "../writers/message-writer.ts";

export function insertMessage(db: BlackboardDatabase, input: InsertMessageInput): MessageRow {
  return writeMessage(db, input);
}

export function persistInboundMessage(
  db: BlackboardDatabase,
  opts: {
    source: UnifiedMessageSource;
    content: string;
    sender?: string;
    workstreamId?: string;
    metadata?: Record<string, unknown>;
  },
): MessageRow {
  return writeMessage(db, {
    source: opts.source,
    direction: "inbound",
    content: opts.content,
    sender: opts.sender,
    workstreamId: opts.workstreamId,
    metadata: opts.metadata,
  });
}

export function persistOutboundMessage(
  db: BlackboardDatabase,
  opts: {
    source: UnifiedMessageSource;
    content: string;
    workstreamId?: string;
    metadata?: Record<string, unknown>;
  },
): MessageRow {
  return writeMessage(db, {
    source: opts.source,
    direction: "outbound",
    content: opts.content,
    sender: "pi",
    workstreamId: opts.workstreamId,
    metadata: opts.metadata,
  });
}

export function getRecentMessages(db: BlackboardDatabase, limit: number = 50): MessageRow[] {
  return db.prepare(
    "SELECT * FROM messages ORDER BY created_at DESC LIMIT ?",
  ).all(limit) as unknown as MessageRow[];
}

export function getMessagesBySource(db: BlackboardDatabase, source: UnifiedMessageSource, limit: number = 50): MessageRow[] {
  return db.prepare(
    "SELECT * FROM messages WHERE source = ? ORDER BY created_at DESC LIMIT ?",
  ).all(source, limit) as unknown as MessageRow[];
}

export function getMessagesByWorkstream(db: BlackboardDatabase, workstreamId: string, limit: number = 100): MessageRow[] {
  return db.prepare(
    "SELECT * FROM messages WHERE workstream_id = ? ORDER BY created_at ASC LIMIT ?",
  ).all(workstreamId, limit) as unknown as MessageRow[];
}
