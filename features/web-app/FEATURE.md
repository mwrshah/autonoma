# Feature: Web App

Thin browser client for Autonoma: chat with the control-surface Pi agent, session dashboard, transcript viewer, direct session messaging.

## Problem

Terminal limits you to one tmux session at a time; transcripts are raw JSONL; no overview exists. The web app is the single pane of glass — talk to the orchestrator, see all sessions, inspect history, message sessions directly.

## Goals

1. Conversational interface to the Pi orchestrator via the control surface
2. Session overview showing status, task, worktree, last activity per session
3. Transcript viewing — render JSONL as readable conversation
4. Direct interaction — send messages to a specific Claude Code session via the control surface
5. Near-real-time blackboard reflection
6. Hand-rolled with TanStack Start + shadcn/ui — no prebuilt agent UI framework

## Design

### Architecture

The web app is a **thin client** — no hosted Pi, no `createAgentSession()`, no duplicated orchestration logic.

Stack: **TanStack Start**, **shadcn/ui** (Radix underneath), markdown via `react-markdown` + `remark-gfm`.

```text
Browser UI ──HTTP / WS──> Control Surface ──> Embedded Pi + Blackboard + tmux + WhatsApp
```

**Control surface owns:** the only embedded Pi session, WebSocket streaming of responses/tool activity, session/message APIs, blackboard access, tmux interactions.

**Web app owns:** rendering, local UI state, bearer-token usage for localhost requests, message composition, and lightweight runtime controls.

### Real-Time Updates

v1: control surface WebSocket stream for chat responses and tool activity. Session state may be streamed or lightly polled depending on the backend contract.

## Dependencies

- Control Surface (embedded Pi host, API, WS)
- Blackboard (session state, transcript paths)
- tmux session tooling via control-surface endpoints

## Constraints

- localhost only for v1
- large transcripts (100MB+) without loading full file at once
- browser remains a client, not an orchestrator
- no prebuilt agent UI dependency in v1
