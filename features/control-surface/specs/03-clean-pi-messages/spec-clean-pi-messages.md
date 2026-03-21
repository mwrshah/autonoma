# Spec: Clean Pi Messages — Separate Transport Metadata from Conversational Content

## Problem

Every human message reaching Pi has transport metadata baked into the prompt text. The WebSocket handler (`runtime.ts:722`) produces:

```
[Workstream: "fix-auth-bug" (abc12345)] [NEW] [repo: /home/mas/development/autonoma]
[Web] User: "ok please fix the auth bug"
```

The HTTP `/message` route (`routes/message.ts:38`) does the same for WhatsApp:

```
[Workstream: "fix-auth-bug" (abc12345)]
[WhatsApp] User (ref:ABC12): ok please fix the auth bug
```

These decorations — source prefix (`[Web] User:`, `[WhatsApp] User:`), quote wrapping, workstream prefix, repo/worktree labels — are permanently embedded in Pi's conversation history. This causes:

1. **Context window pollution**: Every user message carries 100–200 characters of repetitive metadata. Over a long session this adds up to significant wasted context.
2. **Context transfer complexity**: Multi-Pi orchestration (spec 02) requires stripping these decorations when transferring conversation history to new orchestrator sessions. If messages were clean, no stripping is needed.
3. **Redundant information**: Orchestrators already know their workstream via `OrchestratorContext` in the system prompt. The per-message workstream prefix is redundant. In multi-Pi, routing ensures messages reach the correct session — the workstream prefix becomes doubly redundant.
4. **Parsing burden**: The web client has `parseUserMessageSource()` (`web/src/lib/utils.ts:81-100`) that regex-strips these decorations for display. This parser exists solely to undo decoration that shouldn't have been there.
5. **Format inconsistency**: Web messages are quote-wrapped (`"text"`), WhatsApp messages are not. Cron messages use `[Cron stale session check]` but the web parser expects `[Cron]` — a bug caused by ad-hoc formatting.

The metadata these decorations carry (source, workstream ID, router action) already exists as structured data in `QueueItem.source` and `QueueItem.metadata`. The decorations duplicate it as unstructured text.

## Approach

### Principle: user text stays clean, context goes in a structured header

Pi's message array should contain the user's actual words. Transport metadata (source, workstream routing) is passed as a structured header block prepended to the prompt text, clearly separated from the user's message. Hook and cron messages are unchanged — their formatted content IS the message.

### Role-dependent formatting

Different Pi roles need different context per-message:

**Orchestrators** receive minimal context. They know their workstream from the system prompt. A new user message looks like:

```
ok please fix the auth bug
```

No source label, no workstream prefix. Just the user's words. The orchestrator doesn't need to know whether the message came from web or WhatsApp — it responds the same way.

**Default agent** receives a lightweight structured header when the router provides workstream context, because the default agent handles multiple workstreams (or in multi-Pi, it handles non-workstream messages but may see workstream references in conversation). The header uses XML for machine-readability:

```
<context source="web" workstream="fix-auth-bug" workstream_id="abc12345" action="matched" />

ok please fix the auth bug
```

When there's no workstream (non-work messages), just the source:

```
<context source="whatsapp" />

what's on my Todoist for today?
```

The `<context>` tag is a single self-closing line — minimal overhead, machine-parseable, clearly not part of the user's words.

### What doesn't change

- **Hook messages**: `formatHookMessage()` produces structured content (`[Hook: Stop] Claude Code session stopped.\nSession ID: ...`). This is the message body, not a decoration. Unchanged.
- **Cron messages**: `[Cron stale session check]` and `[Cron idle check]` prefixes are content-bearing descriptions. Unchanged.
- **WhatsApp mirroring**: Web messages mirrored to WhatsApp (`runtime.ts:733`) use `*User (web):*\n---\n${payload.text}` — this is a separate send to the WhatsApp daemon, independent of what Pi sees. Unchanged.
- **Message persistence**: `persistInboundMessage()` records messages as-received. The clean text + structured metadata is cleaner data for the messages table too.

### Impact on existing consumers

- **`parseUserMessageSource()`** in the web client: Currently regex-strips decorations for display. With clean messages, user messages need no stripping. The parser becomes a passthrough for user messages. Source information would come from message metadata (already stored on the queue item and persisted to the messages table), not from parsing the message text. The parser can remain for backward compatibility with existing session history but new messages won't need it.
- **Pi history API**: `readPiHistoryFromMessages()` returns messages as-stored. Clean messages improve the `"input"` mode output — no stripping logic needed for context transfer (spec 02).
- **System prompts**: The orchestrator and default agent prompts mention that messages arrive from multiple sources. Update to reflect the new `<context>` header format for the default agent, and note that orchestrators receive raw text.

---

## Functional Requirements

### FR-1: Clean user message text in enqueue paths

**WebSocket handler** (`runtime.ts:handleWebSocketMessage()`):

Change the enqueue text from:
```typescript
text: `${routerPrefix}[Web] User: \"${payload.text}\"`
```
to the raw user text. The workstream prefix, source label, and quote wrapping are removed. Source and workstream metadata remain on `item.metadata` (already there today).

**HTTP /message route** (`routes/message.ts:handleMessageRoute()`):

`formatInboundMessage()` currently wraps web messages as `[Web] User: "text"` and WhatsApp as `[WhatsApp] User (ref:XXX): text`. Change to return the raw text for web and WhatsApp sources. Hook and cron sources continue to pass through unchanged.

The `routerPrefix` concatenation at line 38 is removed. Workstream metadata is already captured in `workstreamMeta` and merged into `item.metadata`.

### FR-2: Structured context header in processQueueItem()

**New function** — `formatPromptWithContext(item: QueueItem, role: "default" | "orchestrator"): string`

This function takes the queue item (with clean text and structured metadata) and produces the final prompt string for `session.prompt()`:

- **For orchestrators**: Return `item.text` unchanged. The orchestrator's system prompt provides all workstream context.
- **For the default agent**: Prepend a `<context>` header line if metadata contains routing information:
  - Always include `source` attribute
  - Include `workstream`, `workstream_id`, `action` attributes when present
  - Separate header from text with a blank line
- **For hooks and cron** (`item.source === "hook" || "cron"`): Return `item.text` unchanged. These messages are already formatted as structured content by `formatHookMessage()` and the cron route.

```typescript
// Consequential interface — the shape that determines prompt formatting
type PromptContext = {
  source: QueueSource;
  workstreamId?: string;
  workstreamName?: string;
  routerAction?: string;
};
```

### FR-3: Remove decoration logic from inbound paths

**`formatInboundMessage()`** in `routes/message.ts`:

- Web and WhatsApp sources return the raw text (no `[Web] User:` wrapper, no `[WhatsApp] User:` wrapper, no quote wrapping)
- Hook and cron sources continue unchanged
- The WhatsApp `contextRef` tag (`ref:XXXXX`) moves to `item.metadata` if not already there — it's a transport detail, not content

**Router prefix construction** in `handleWebSocketMessage()` and `routeMessage()`:

- Stop building the `routerPrefix` string entirely. The workstream metadata is already captured in `routerMeta` / `workstreamMeta` and stored on `item.metadata`.
- The prefix construction code (building `[Workstream: ...]` with `[NEW]`, `[repo: ...]`, `[worktree: ...]`) is removed.

### FR-4: Update web client source detection

**`parseUserMessageSource()`** in `web/src/lib/utils.ts`:

The function must handle both old-format messages (existing session history) and new clean messages:

- Existing regex patterns remain for backward compatibility with historical messages
- For clean messages (no prefix match), the source should be determined from message metadata rather than defaulting to `"web"`
- The Pi history API (`/api/pi/history`) should include the source in its response items, derived from the queue item's source field. This allows the web client to attribute messages without parsing the text.

### FR-5: Update system prompts

**Default agent prompt** (`system-prompts/default-agent.ts`):

Update the section about message sources to describe the `<context>` header format:
- Messages from users include a `<context />` line with source and optional workstream attributes
- Hook and cron messages retain their existing `[Hook: ...]` and `[Cron ...]` formats

**Orchestrator prompt** (`system-prompts/orchestrator.ts`):

Update to note that user messages arrive as raw text without source or workstream prefixes. The orchestrator's workstream context is in the system prompt. Source labels are omitted because the orchestrator responds identically regardless of channel.

### FR-6: Fix cron source detection in web client

**Existing bug**: The web client parser expects `[Cron] text` but the server sends `[Cron stale session check] ...` and `[Cron idle check] ...`. Fix the parser regex to match the actual format:

```
/^\[Cron\s[^\]]*\]\s*(.*)/s
```

This is a standalone bugfix that can land independently.

---

## Acceptance Criteria

1. User messages in Pi's session history contain raw text — no `[Web] User:`, `[WhatsApp] User:`, quote wrapping, or `[Workstream: ...]` prefixes
2. Default agent receives a `<context source="..." ... />` header line before user text, separated by a blank line
3. Orchestrators receive raw user text with no header (workstream context is in system prompt)
4. Hook and cron messages are unchanged — their formatted content IS the message
5. `QueueItem.metadata` carries source, workstream ID, workstream name, and router action as structured fields (already true today — no regression)
6. WhatsApp mirroring continues to work — the mirror sends raw text to WhatsApp daemon, independent of Pi's prompt format
7. Web client correctly identifies message sources for both old-format (historical) and new clean messages
8. Cron messages correctly parse as `source: "cron"` in the web client (bug fix)
9. Context transfer in spec 02 (multi-Pi) works without any text stripping — clean messages are transfer-ready
10. System prompts for both default agent and orchestrator document the new message format

## Files Likely Touched

### Runtime & Routes
- `src/control-surface/runtime.ts` — `handleWebSocketMessage()`: remove decoration, call `formatPromptWithContext()` in `processQueueItem()`
- `src/control-surface/routes/message.ts` — `formatInboundMessage()`: return raw text for web/WhatsApp; `routeMessage()`: stop building prefix string
- `src/control-surface/queue/turn-queue.ts` — No changes (metadata already flows through)

### New/Updated Modules
- `src/control-surface/pi/format-prompt.ts` — New file: `formatPromptWithContext()` function

### System Prompts
- `src/control-surface/pi/system-prompts/default-agent.ts` — Document `<context>` header format
- `src/control-surface/pi/system-prompts/orchestrator.ts` — Note raw text format

### Web Client
- `web/src/lib/utils.ts` — `parseUserMessageSource()`: fix cron regex, handle clean messages gracefully
- Possibly `web/src/lib/types.ts` — if source needs to come from message metadata instead of text parsing

### History API
- `src/control-surface/pi/history.ts` — Consider including source metadata in history response items (enables web client source attribution without text parsing)
