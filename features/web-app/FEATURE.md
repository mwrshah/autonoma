# Feature: Web App

Thin browser client for Autonoma: chat with the control-surface Pi agent, session dashboard, transcript viewer, direct session messaging, runtime controls.

## Problem

Terminal limits you to one tmux session at a time; transcripts are raw JSONL; no overview exists. The web app is the single pane of glass — talk to the orchestrator, see all sessions, inspect history, message sessions directly.

## Goals

1. Conversational interface to the Pi orchestrator via the control surface
2. Session overview showing status, task, worktree, last activity per session
3. Transcript viewing — render JSONL as readable conversation
4. Direct interaction — send messages to a specific Claude Code session via the control surface
5. Near-real-time blackboard reflection
6. Hand-rolled with TanStack Start + custom Tailwind UI — no prebuilt agent UI framework
7. Image attachments — clipboard paste, drag-drop, file picker
8. Theme system — light, dark, and system-preference modes
9. Runtime dashboard — Pi agent status, workstream summary, WhatsApp daemon controls
10. Multi-source message tracking — origin badges for web, whatsapp, hook, cron
11. Delivery modes — followUp vs steer for message intent

## Design

### Architecture

The web app is a **thin client** — no hosted Pi, no `createAgentSession()`, no duplicated orchestration logic.

Stack: **TanStack Start**, **hand-rolled Tailwind UI components**, **Lit web components** (pi-web-ui) for chat rendering, markdown via `marked` (chat) and `react-markdown` + `remark-gfm` (transcripts), syntax highlighting via `highlight.js`.

```text
Browser UI (React) ──renders──> Pi-Web-UI (Lit components) ──renders──> Chat messages
Browser UI (React) ──HTTP / WS──> Control Surface ──> Embedded Pi + Blackboard + tmux + WhatsApp
```

**Control surface owns:** the only embedded Pi session, WebSocket streaming of responses/tool activity, session/message APIs, blackboard access, tmux interactions.

**Web app owns:** rendering, local UI state, bearer-token usage for localhost requests, message composition, and lightweight runtime controls.

### Pi-Web-UI Bridge

Chat rendering uses Lit web components from `@mariozechner/pi-agent-core`, embedded inside React. A bridge layer (`web/src/lib/pi-web-ui-bridge.ts`) converts the internal `ChatTimelineItem[]` format to the Pi SDK's `AgentMessage[]` format. Lit components are lazy-loaded on demand (`web/src/lib/pi-web-ui-init.ts`) and mounted via React refs in `PiMessageList`. Tool call/result activity renders inline within the message stream. Streaming deltas are handled by `PiStreamingMessage`.

### Real-Time Updates

WebSocket for Pi chat streaming (responses, tool activity) with auto-reconnect and exponential backoff. TanStack Query polling (5–10s) for session status and runtime endpoints.

### Settings & Configuration

Settings drawer (`SettingsDrawer`) for control surface URL, bearer token, theme selection, and stub fallback mode. Theme persisted to localStorage with system-preference detection (`use-theme` hook).

## Dependencies

- Control Surface (embedded Pi host, API, WS)
- Blackboard (session state, transcript paths)
- tmux session tooling via control-surface endpoints
- `@mariozechner/pi-agent-core` (Lit web components, Pi SDK types)

## Constraints

- localhost only for v1
- large transcripts (100MB+) without loading full file at once
- browser remains a client, not an orchestrator
- no prebuilt agent UI dependency in v1
