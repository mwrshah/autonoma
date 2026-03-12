import type { DatabaseSync } from "node:sqlite";
import type {
  PendingActionRow,
  WhatsAppMessageDirection,
  WhatsAppMessageRow,
  WhatsAppMessageStatus,
} from "../../contracts/index.ts";
import {
  getLatestOutboundWithContext,
  getLatestPendingAction,
  getWhatsAppMessageByWaMessageId,
  listPendingInboundMessages,
} from "../queries/whatsapp.ts";
import { resolveLatestPendingAction, resolvePendingActionByContextRef } from "./pending-actions.ts";

type SqlDatabase = Pick<DatabaseSync, "prepare">;

type InsertWhatsAppMessageInput = {
  direction: WhatsAppMessageDirection;
  waMessageId?: string | null;
  remoteJid: string;
  body: string;
  contextRef?: string | null;
  status?: WhatsAppMessageStatus;
  errorMessage?: string | null;
  createdAt?: string;
  processedAt?: string | null;
};

function timestamp(value?: string): string {
  return value ?? new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

function getMessageById(db: SqlDatabase, id: number): WhatsAppMessageRow {
  return db.prepare("SELECT * FROM whatsapp_messages WHERE id = ?").get(id) as WhatsAppMessageRow;
}

function insertWhatsAppMessage(db: SqlDatabase, input: InsertWhatsAppMessageInput): WhatsAppMessageRow {
  const createdAt = timestamp(input.createdAt);
  const result = db.prepare(
    `INSERT INTO whatsapp_messages (
      direction,
      wa_message_id,
      remote_jid,
      body,
      context_ref,
      status,
      error_message,
      created_at,
      processed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    input.direction,
    input.waMessageId ?? null,
    input.remoteJid,
    input.body,
    input.contextRef ?? null,
    input.status ?? "pending",
    input.errorMessage ?? null,
    createdAt,
    input.processedAt ?? null,
  );

  return getMessageById(db, Number(result.lastInsertRowid));
}

export function createOutboundPendingMessage(
  db: SqlDatabase,
  input: Omit<InsertWhatsAppMessageInput, "direction" | "status">,
): WhatsAppMessageRow {
  return insertWhatsAppMessage(db, {
    ...input,
    direction: "outbound",
    status: "pending",
  });
}

export function markWhatsAppMessageSent(
  db: SqlDatabase,
  rowId: number,
  waMessageId: string,
  sentAt?: string,
): WhatsAppMessageRow {
  db.prepare(
    `UPDATE whatsapp_messages
     SET wa_message_id = ?,
         status = 'sent',
         error_message = NULL,
         created_at = COALESCE(created_at, ?)
     WHERE id = ?`
  ).run(waMessageId, timestamp(sentAt), rowId);

  return getMessageById(db, rowId);
}

export function markWhatsAppMessageDelivered(db: SqlDatabase, waMessageId: string): void {
  db.prepare(
    `UPDATE whatsapp_messages
     SET status = 'delivered'
     WHERE wa_message_id = ?
       AND direction = 'outbound'
       AND status IN ('pending', 'sent')`
  ).run(waMessageId);
}

export function markWhatsAppMessageFailed(db: SqlDatabase, rowId: number, errorMessage: string): WhatsAppMessageRow {
  db.prepare(
    `UPDATE whatsapp_messages
     SET status = 'failed',
         error_message = ?
     WHERE id = ?`
  ).run(errorMessage, rowId);

  return getMessageById(db, rowId);
}

export function resolveInboundContextRef(
  db: SqlDatabase,
  options: { quotedWaMessageId?: string | null; fallbackChannel?: string } = {},
): string | undefined {
  const quotedId = options.quotedWaMessageId?.trim();
  if (quotedId) {
    const quoted = getWhatsAppMessageByWaMessageId(db, quotedId);
    if (quoted?.context_ref) {
      return quoted.context_ref;
    }
  }

  const latestAction = getLatestPendingAction(db, options.fallbackChannel ?? "whatsapp");
  if (latestAction?.context_ref) {
    return latestAction.context_ref;
  }

  return getLatestOutboundWithContext(db)?.context_ref ?? undefined;
}

export function insertInboundWhatsAppMessage(
  db: SqlDatabase,
  input: Omit<InsertWhatsAppMessageInput, "direction" | "status"> & { status?: InsertWhatsAppMessageInput["status"] },
): WhatsAppMessageRow {
  return insertWhatsAppMessage(db, {
    ...input,
    direction: "inbound",
    status: input.status ?? "pending",
  });
}

function ackInboundMessages(
  db: SqlDatabase,
  rows: WhatsAppMessageRow[],
  processedAt?: string,
): { acked: WhatsAppMessageRow[]; resolvedActions: PendingActionRow[] } {
  if (rows.length === 0) {
    return { acked: [], resolvedActions: [] };
  }

  const effectiveProcessedAt = timestamp(processedAt);
  const acked: WhatsAppMessageRow[] = [];
  const resolvedActions: PendingActionRow[] = [];

  for (const row of rows) {
    db.prepare(
      `UPDATE whatsapp_messages
       SET status = 'processed',
           processed_at = ?
       WHERE id = ?`
    ).run(effectiveProcessedAt, row.id);

    acked.push(getMessageById(db, row.id));

    const payload = {
      reply: row.body,
      whatsappMessageId: row.wa_message_id,
      processedAt: effectiveProcessedAt,
    } satisfies Record<string, unknown>;

    const resolved = row.context_ref
      ? resolvePendingActionByContextRef(db, row.context_ref, payload, effectiveProcessedAt)
      : resolveLatestPendingAction(db, payload, effectiveProcessedAt);

    if (resolved) {
      resolvedActions.push(resolved);
    }
  }

  return { acked, resolvedActions };
}

export function pollPendingInboundMessages(
  db: SqlDatabase,
  options: { ack?: boolean; limit?: number } = {},
): {
  items: WhatsAppMessageRow[];
  acked: WhatsAppMessageRow[];
  resolvedActions: PendingActionRow[];
} {
  const items = listPendingInboundMessages(db, options.limit ?? 50);
  if (!options.ack) {
    return { items, acked: [], resolvedActions: [] };
  }

  const { acked, resolvedActions } = ackInboundMessages(db, items);
  return { items, acked, resolvedActions };
}
