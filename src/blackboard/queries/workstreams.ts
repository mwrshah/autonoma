import crypto from "node:crypto";
import type { BlackboardDatabase } from "../db.ts";
import type { WorkstreamRow } from "../../contracts/index.ts";

export function listOpenWorkstreams(db: BlackboardDatabase): WorkstreamRow[] {
	return db
		.prepare("SELECT * FROM workstreams ORDER BY created_at DESC")
		.all() as unknown as WorkstreamRow[];
}

export function getWorkstreamById(db: BlackboardDatabase, id: string): WorkstreamRow | null {
	const row = db.prepare("SELECT * FROM workstreams WHERE id = ?").get(id) as unknown as WorkstreamRow | undefined;
	return row ?? null;
}

export function getWorkstreamByName(db: BlackboardDatabase, name: string): WorkstreamRow | null {
	const row = db
		.prepare("SELECT * FROM workstreams WHERE name = ? COLLATE NOCASE")
		.get(name) as unknown as WorkstreamRow | undefined;
	return row ?? null;
}

export function insertWorkstream(db: BlackboardDatabase, name: string): WorkstreamRow {
	const id = crypto.randomUUID();
	db.prepare("INSERT INTO workstreams (id, name) VALUES (?, ?)").run(id, name);
	return getWorkstreamById(db, id)!;
}
