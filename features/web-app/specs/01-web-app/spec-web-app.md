# Spec: Web App

Thin, localhost-only browser client for Autonoma built with **TanStack Start** and **shadcn/ui**. Talks to the control surface over HTTP and WebSocket.

## Context

Autonoma's backend: the **control surface** (sole embedded Pi host), a **blackboard** (shared state), and Claude Code sessions in **tmux**. The frontend needs custom chat, tool-call rendering, transcript inspection, and session controls — a hand-rolled UI fits better than a prebuilt agent framework.

## Stack

- **Framework:** TanStack Start
- **UI:** shadcn/ui (Radix primitives underneath)
- **Markdown:** `react-markdown` + `remark-gfm`
- **Realtime:** native WebSocket to control surface
- **Data fetching:** TanStack Query where helpful

**Non-goals (v1):** no embedded Pi in the web app, no CopilotKit / assistant-ui / Open WebUI, no AI-specific frontend framework unless a later phase proves it necessary.

## TanStack Start Features We Are Not Centering in v1

TanStack Start is a full-stack framework, but Autonoma is using it primarily as a **thin client shell** over the control surface.

That means these Start capabilities are **available** but are **not the primary architecture** for v1:
- **Server functions** are not the main backend contract for Pi, blackboard, tmux, or transcript access; the control surface API is.
- **Server routes / API routes** are not where orchestration logic lives; orchestration stays in the control surface.
- **Database integration through Start** is not part of the web app architecture; browser-visible data comes from the control surface, not a web-app-owned DB layer.
- **Framework-owned auth stacks** are not the main plan; browser auth must align with control-surface auth, not become a separate app backend.
- **Custom server entry / request middleware** may be used later for thin concerns, but not to recreate backend orchestration inside the web app.
- **SEO-heavy features** like sitemaps, aggressive prerendering, and content-collection-style publishing are not core to localhost v1.
- **Markdown-content pipelines for static docs/blogs** are not the target use case; the web app mainly renders runtime chat and transcript markdown.

The main Start value in v1 is:
- route structure
- document/app shell
- code-splitting
- execution-boundary discipline between browser-safe and server-safe code
- optional SSR or selective SSR where it genuinely helps

## Goals

1. Chat with the Pi orchestrator via the control surface
2. View Claude Code sessions with their status, task, and activity
3. Render markdown responses cleanly
4. Render tool calls/results with visibility into arguments and output
5. Inspect session details and transcript summaries
6. Send direct messages to a selected Claude Code session
7. Stay thin — no duplicated orchestration logic in the frontend

## Architecture

```text
TanStack Start app
  ├─ routes, layouts, local UI state
  ├─ WebSocket client to control surface
  ├─ HTTP calls to control surface endpoints
  └─ hand-rolled React components

Control Surface
  ├─ embedded Pi agent
  ├─ blackboard access
  ├─ tmux/session management
  └─ event streaming to browser
```

## Functional Requirements

### FR-1: Realtime Chat with Control Surface

WebSocket connection to the control surface handles:
- sending user chat messages to Pi
- receiving streamed Pi text deltas, tool execution events, turn completions
- receiving session-related events if exposed

The browser handles rendering and local UI state only; the control surface is the orchestration source of truth.

V1 delivery behavior:
- web messages default to `followUp`
- the UI may expose an explicit operator toggle for `steer`
- the API contract stays explicit so the control surface, not the browser, decides how to apply the message to the active Pi session

V1 auth model is intentionally minimal:
- localhost-only app
- no multi-user auth/session system yet
- browser sends the same configured bearer token used elsewhere
- think of that token as a local password for now
- the protocol stays token-based so a real JWT/auth layer can replace it later without changing request shapes

### FR-2: Session Browsing and Inspection

The web app surfaces Claude Code session data from the blackboard: session identity, status, task, worktree, last activity, transcript path. Users can select a session to inspect details and view its transcript.

V1 actions:
- inspect latest output
- send direct message
- start/stop WhatsApp daemon from runtime controls

Kill/restart Claude sessions is deferred to future phases.

### FR-3: Transcript View

Readable transcript view for a selected Claude Code session:
- fetch transcript metadata/parsed preview through the control surface
- render a readable message/event list
- lazy-load large transcripts (don't assume they fit in memory)

### FR-4: Data Boundaries

The browser never talks directly to SQLite, tmux, or WhatsApp — all interactions go through the control surface. This centralizes auth, keeps system access server-side, and keeps the frontend portable.

### FR-5: State Management

Lightest reasonable model:
- **TanStack Query** for cacheable request/response data
- **Component/local state** for UI state (selection, drafts, temporary render state)
- No large global store until a real need appears

V1 update policy:
- active Pi chat/tool events stream over WebSocket
- session list/detail and runtime status are lightly polled over HTTP (for example every 5-10 seconds while visible)
- transcript pages/chunks load on demand over HTTP

### FR-6: v1 Scope Boundary

**Included:** chat with Pi, markdown rendering, tool-call visualization, session browsing/inspection, direct session messaging, runtime status indication, basic WhatsApp daemon controls.

**Deferred:** slash commands, advanced file picker, deep transcript analytics, multi-user support, remote hosting, browser QR/pairing UX for WhatsApp auth.

## Consequential Interface: Control Surface API

Minimum browser-facing surface for v1:

### Auth header
All mutating requests send:

```text
Authorization: Bearer {controlSurfaceToken}
```

### WebSocket
Connect to:

```text
ws://127.0.0.1:{port}/ws?token={controlSurfaceToken}
```

Browser → control surface:

```json
{ "type": "message", "text": "What's the status of the search UI session?", "deliveryMode": "followUp" }
```

Control surface → browser:

```json
{ "type": "text_delta", "delta": "The search UI session " }
{ "type": "tool_execution_start", "tool": "query_blackboard" }
{ "type": "tool_execution_end", "tool": "query_blackboard" }
{ "type": "turn_end" }
```

### Session list
```text
GET /api/sessions
```

Response shape:

```json
{
  "items": [
    {
      "sessionId": "abc-123",
      "status": "working",
      "project": "github.com/user/repo",
      "taskDescription": "search UI",
      "tmuxSession": "auto-search-ui",
      "lastEventAt": "2026-03-07T18:30:00Z"
    }
  ]
}
```

### Session detail
```text
GET /api/sessions/:sessionId
```

### Transcript preview
```text
GET /api/sessions/:sessionId/transcript?cursor=...&limit=...
```

Response shape is chunked/paginated, oldest-first, and must not assume the whole transcript fits in memory.

### Direct session message
```text
POST /sessions/:sessionId/message
```

Body:

```json
{ "text": "Please continue with spec 02." }
```

V1 delivery contract:
- control surface resolves the target tmux session from the blackboard
- checks whether the target session is inject-safe before sending anything
- injects text into the live Claude Code session via tmux send-keys only when the session is idle
- returns `delivery: "tmux_send_keys"` on success, otherwise a busy/not-delivered response

### Runtime controls
```text
POST /runtime/whatsapp/start
POST /runtime/whatsapp/stop
```

The browser assumes the control surface owns all server-side behavior.

## Locked Decisions

- transcript preview is paginated and oldest-first in v1
- the browser uses the same localhost bearer token as other callers in v1
- web-to-Pi messages default to `followUp`, with optional UI support for explicit `steer`
- direct session messaging must respect busy/ambiguous session state and fail closed
