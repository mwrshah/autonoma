# Autonoma — Features Overview

Orchestration layer above Claude Code. A long-running control surface hosts a single embedded Pi agent, tracks state in SQLite, drives work forward via scheduled check-ins, and communicates with the user over WhatsApp and a thin web client.

## What it does

An embedded Pi agent runs inside a central control surface (HTTP server). Claude Code sessions report lifecycle events via hooks that POST to the control surface, which gates on the `AUTONOMA_AGENT_MANAGED=1` environment variable and writes to SQLite only for managed sessions. A scheduled check-in runs periodically, checks the blackboard directly to classify the machine state, and only wakes Pi when there is something worth orchestrating: either the machine is in a true idle state with no active Claude work, or a Claude session looks suspiciously stale and needs Pi-led tmux verification. The user interacts via WhatsApp (primary) and a web dashboard. Pi sees all events in a single continuous session, uses custom tools plus existing skills, and decides what to do. Users can opt any manual session into tracking by launching with `AUTONOMA_AGENT_MANAGED=1 claude`.

## Architecture

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Thin Web App │  │ Scheduler    │  │  Hook Scripts │
│  (browser)   │  │ (launchd /   │  │  (cc events)  │
│              │  │ systemd)     │  │               │
└──────┬───────┘  └──────┬───────┘  └──────┬────────┘
       │ WS / HTTP       │ HTTP POST       │ HTTP POST
       ▼                 ▼                 ▼
┌──────────────────────────────────────────────────────┐
│              Control Surface (:18820)               │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │           Embedded Pi Agent (SDK)            │    │
│  │  Persistent session · auto-compacting        │    │
│  │  Serialized turn queue                       │    │
│  │  Tools: send_whatsapp, query_blackboard,     │    │
│  │         manage_session, launch_claude_code,  │    │
│  │         read, bash, grep                     │    │
│  │  Skills: Todoist + Autonoma workflows        │    │
│  └──────────────────────────────────────────────┘    │
│                         │                            │
└─────────────────────────┼────────────────────────────┘
             ┌────────────┼────────────┐
             ▼            ▼            ▼
    ┌────────────┐ ┌──────────────┐ ┌──────────────────────┐
    │  WhatsApp  │ │  Blackboard  │ │ Claude Code (tmux)   │
    │  Daemon    │ │   SQLite     │ │ Hook → POST → SQLite │
    │ (Baileys)  │ │              │ │                      │
    └────────────┘ └──────────────┘ └──────────────────────┘
```

## Features

| # | Feature | Purpose |
|---|---------|---------|
| 1 | [Installer / Uninstaller](installer/FEATURE.md) | Permission-gated, manifest-tracked modification of external configs. Uninstaller-first. |
| 2 | [Blackboard](blackboard/FEATURE.md) | SQLite state layer fed by Claude Code hooks and channel adapters. Tracks Claude Code sessions, Pi runtime sessions, events, messages, and pending actions. |
| 3 | [Cron Scheduler](cron-scheduler/FEATURE.md) | Periodic state check. Reads blackboard state, wakes Pi only when the machine is truly idle or when a Claude session looks stale enough to need Pi-led verification. |
| 4 | [WhatsApp Channel](whatsapp-channel/FEATURE.md) | Bidirectional Baileys messaging. Daemon maintains connection; forwards inbound to control surface and stores history in the blackboard. |
| 5 | [Web App](web-app/FEATURE.md) | Thin browser client for chat, session overview, transcript viewing, and direct session interaction through the control surface. |
| 6 | [Control Surface](control-surface/FEATURE.md) | HTTP server hosting the only embedded Pi agent. Central hub: all channels push events in, Pi acts through tools and skills. |

## Dependency Order

```
Installer → Blackboard → WhatsApp Channel ──┐
                                             ├─→ Control Surface → Cron Scheduler
                                   (none) ──┘                   → Web App
```

Installer configures hooks and scheduler entries. Blackboard needs installed hooks. WhatsApp daemon is a standalone transport that the control surface connects to. The control surface depends on the blackboard and WhatsApp daemon being available. The scheduler and the web app both talk to the control surface.

## State Glossary

Canonical runtime terms used across the specs:

### Claude Code session states

- **`working`** — the session appears active and is still inferencing or otherwise advancing work
- **`idle`** — the session exists but is not currently doing work; this also covers “waiting for input”
- **`stale`** — the session stopped advancing long enough that SQLite now marks it suspect and Pi should verify real tmux state
- **`ended`** — the session is finished or has been intentionally reconciled closed

Notes:
- Claude does **not** use a separate persisted `crashed` state in v1
- a session that has never been launched usually has **no row yet** rather than a special `not_started` status

### Pi runtime states

- **inactive** — no active Pi runtime row currently exists
- **`active`** — Pi runtime exists and is alive
- **`idle`** — Pi runtime is alive but not processing a turn; this also covers “waiting for input”
- **`ended`** — Pi runtime was intentionally closed
- **`crashed`** — Pi runtime was reconciled as abnormally terminated

Notes:
- Pi working/busy is usually exposed as live runtime status rather than a separate long-lived persisted state label
- Pi `crashed` is worth persisting because repeated abnormal exits are operationally useful to debug

## Design Principles

- **Single embedded Pi**: only the control surface hosts Pi. No second Pi session in the web app or scheduler.
- **Minimal footprint**: only `~/.claude/settings.json` and launchd/systemd entries touched outside Autonoma's directory.
- **Uninstaller-first**: removal scripts before installation scripts.
- **Pi is the brain**: orchestration intelligence lives in the embedded Pi session, not in disconnected wrappers.
- **Runtime is deterministic**: hooks, queueing, DB writes, retries, and sweeps are coded behavior; Pi decides actions and messaging.
- **Channels are transports**: WhatsApp, web app, hooks, and scheduled check-ins all push events into Pi.
- **Permission-gated**: Pi suggests actions, doesn't execute significant changes without user approval.
- **Namespaced**: all Autonoma artifacts are identifiable for clean removal.

## Quick Start

```bash
pnpm install
pnpm --dir web install
node .autonoma/install.mjs
~/.autonoma/bin/autonoma-up start
# optional
pnpm --dir web dev
~/.autonoma/bin/autonoma-wa auth
```
