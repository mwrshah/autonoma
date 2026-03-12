# Autonoma

Autonoma is a long-running orchestration runtime for Claude Code.

It keeps a single embedded Pi agent alive inside a localhost control surface, tracks machine state in SQLite, watches Claude Code sessions through hooks and tmux, and exposes user-facing channels through WhatsApp and a thin web app.

This repo is currently meant to be run by **cloning the repo locally** and setting up the runtime on your machine. It is **not packaged as a standalone bundled app yet**.

## What runs where

Autonoma is not one monolith. It is a small group of cooperating parts:

| Component | What it is | Language / runtime | Long-running? | Source of truth |
|---|---|---:|---:|---|
| Control surface | Main backend runtime. Hosts Pi, HTTP API, WebSocket hub, turn queue, and runtime supervision. | TypeScript / Node.js | Yes | `src/control-surface/**` |
| Pi agent | Embedded inside the control surface. Not in the web app. | Pi SDK in Node.js | Lives inside control surface | `src/control-surface/pi/**` |
| Blackboard | Shared SQLite state store. | TypeScript + SQL | No separate daemon | `src/blackboard/**`, `src/contracts/blackboard-schema.sql` |
| Claude/tmux bridge | Launches Claude Code sessions, inspects tmux, sends direct messages safely. | TypeScript / Node.js + tmux | No separate daemon | `src/claude-sessions/**` |
| WhatsApp daemon | Separate process that maintains the WhatsApp connection and local IPC. Owned by the control surface at runtime. | TypeScript / Node.js | Yes | `src/whatsapp/**` |
| Web app | Thin browser client talking to the control surface over HTTP + WebSocket. | TypeScript / React / TanStack Start | Separate dev server in development | `web/**` |
| Hooks / cron / wrappers | Installed machine-side entrypoints. Hook shell scripts are thin wrappers around a Python dispatcher that writes blackboard state and forwards to the control surface. Cron wakes the system. Wrappers start/stop the runtime. | Bash wrappers + Python helpers | Hooks: no. Cron: scheduled. Wrappers: on demand. | `.autonoma/**` |

## Important architecture facts

- **The Pi agent lives in the control surface**, not in the web app.
- **The control surface is the main program**. It is a separate long-running Node.js process.
- **WhatsApp is a separate process**, but it is runtime-owned by the control surface.
- **tmux is required**. Autonoma does not bundle tmux.
- **Claude Code CLI is required**. Autonoma does not bundle it.
- **`projectRoot` / `sourceRoot` mean the Autonoma source checkout**, i.e. the repo used to run the control surface and WhatsApp code. They are **not** the working directory for Claude sessions.
- **Claude Code session tracking is machine-wide through hooks**. If the global Claude hooks are installed, sessions started in other directories are still recorded with their own `cwd` values. Direct tmux control is strongest for Autonoma-launched sessions because those are tagged with a tmux session name.
- **Python is only used for small helper scripts** under `.autonoma/scripts/`; there is no Python service architecture here.

## Current repo status

This repo already contains working code for:

- blackboard / SQLite state
- control surface server and Pi runtime
- tmux / Claude session bridge
- cron recovery loop
- WhatsApp daemon + CLI
- thin web app
- installer / uninstaller / startup wrappers

The runtime is still best treated as a **developer/operator setup**, not a polished packaged product.

---

# Prerequisites

Install these before trying to run Autonoma.

## Required

- **Node.js 22+**
- **pnpm**
- **tmux**
- **Claude Code CLI** available as `claude`
- **jq**
- **sqlite3**
- **python3**

## Required for WhatsApp

- a working terminal session for manual auth
- ability to run `autonoma-wa auth`

## Optional but useful

- `uv` for Python lint/audit tooling
- a modern browser for the web UI

## Quick sanity checks

```bash
node -v
pnpm -v
tmux -V
claude --version
jq --version
sqlite3 --version
python3 --version
```

If any of these are missing, fix that first.

---

# Repo layout

## Runtime source

- `src/control-surface/**` — backend runtime and Pi host
- `src/blackboard/**` — SQLite layer
- `src/claude-sessions/**` — tmux / Claude integration
- `src/whatsapp/**` — WhatsApp daemon / CLI / IPC
- `src/contracts/**` — shared API and runtime contracts
- `web/**` — browser client

## Installed runtime assets

- `.autonoma/install.sh`
- `.autonoma/uninstall.sh`
- `.autonoma/init.sh`
- `.autonoma/bin/autonoma-up`
- `.autonoma/bin/autonoma-wa`
- `.autonoma/hooks/**`
- `.autonoma/scripts/**`
- `.autonoma/cron/**`

These are the files deployed into `~/.autonoma/`.

Hook runtime details:

- `.autonoma/hooks/*.sh` map Claude hook events to stable installed command paths
- `.autonoma/scripts/hook-dispatch.sh` is a thin shell wrapper that `exec`s Python
- `.autonoma/scripts/hook_dispatch.py` reads hook JSON once, writes to SQLite, and conditionally POSTs to the control surface
- `.autonoma/scripts/bb_write.py` contains the importable blackboard writer used by the dispatcher
- `.autonoma/scripts/bb-write.py` remains as a compatibility CLI wrapper

---

# First-time setup

## 1) Clone the repo

```bash
git clone <repo-url>
cd autonoma
```

## 2) Install Node dependencies

From repo root:

```bash
pnpm install
```

Install the web app dependencies too:

```bash
pnpm --dir web install
```

## 3) Initialize the local runtime directory

This copies runtime assets from `.autonoma/` into `~/.autonoma/`.

```bash
./.autonoma/init.sh
```

## 4) Run the installer

This:
- deploys runtime files into `~/.autonoma/`
- bootstraps config files
- prompts for a WhatsApp phone number for initial pairing bootstrap (optional; you can skip and fill it in later)
- initializes the blackboard
- installs Claude Code hooks into `~/.claude/settings.json` with async background execution and explicit timeouts
- installs the scheduler (`launchd` on macOS, `crontab` on Linux)

```bash
~/.autonoma/install.sh
```

Use `--dry-run` first if you want to inspect the changes:

```bash
~/.autonoma/install.sh --dry-run
```

## 5) Review generated config

Main config:

```bash
~/.autonoma/config.json
```

WhatsApp config:

```bash
~/.autonoma/whatsapp/config.json
```

You will usually want to verify at least:

- `controlSurfaceHost`
- `controlSurfacePort`
- `controlSurfaceToken`
- `piModel` (default: `claude-opus-4-6`)
- `claudeCliCommand` (default: `claude --dangerously-skip-permissions`)
- `projectRoot` / `sourceRoot` (should point at this Autonoma checkout)
- `~/.autonoma/whatsapp/config.json` values, especially `pairingPhoneNumber` and `recipientJid`

## 6) Authenticate WhatsApp manually (optional, but needed for the channel)

```bash
~/.autonoma/bin/autonoma-wa auth
```

Or for pairing-code mode:

```bash
~/.autonoma/bin/autonoma-wa auth --pairing-code
```

Auth state is stored under:

```text
~/.autonoma/whatsapp/auth/
```

---

# Starting the system

## Control surface

Preferred runtime wrapper:

```bash
~/.autonoma/bin/autonoma-up start
```

Check status:

```bash
~/.autonoma/bin/autonoma-up status
```

This wrapper is responsible for:
- finding the control-surface command
- starting the control surface
- handling stale pid cleanup
- logging
- retries on startup
- graceful shutdown via `/stop`

## Web app (development)

The web app is **not currently managed by `autonoma-up`**. In development, run it separately:

```bash
pnpm --dir web dev
```

Open:

```text
http://127.0.0.1:3188
```

## Cron / scheduler

If installed, the scheduler will periodically run:

```text
~/.autonoma/cron/autonoma-checkin.sh
```

That script may restart the control surface if the machine state is actionable and the runtime is down.

---

# Stopping the system cleanly

This matters because Autonoma has dependent processes.

## Stop the control surface and runtime-owned children

```bash
~/.autonoma/bin/autonoma-up stop
```

This is the main clean shutdown path.

It should:
- call `POST /stop` on the control surface when possible
- let the control surface mark Pi ended
- stop managed background processes, including WhatsApp
- remove pid metadata

## Stop WhatsApp explicitly

Usually not necessary if the control surface shuts down cleanly, but available if needed:

```bash
~/.autonoma/bin/autonoma-wa stop
```

## Important: stopping is not the same as disabling restart

If you installed the scheduler, stopping the runtime does **not** permanently disable Autonoma. The scheduler may bring it back later.

### If you want the whole system fully down
Use the uninstaller:

```bash
~/.autonoma/uninstall.sh
```

And for full removal of `~/.autonoma/` too:

```bash
~/.autonoma/uninstall.sh --meta
```

That removes:
- Claude hooks added by Autonoma
- launchd / crontab scheduler entries added by Autonoma
- optionally the runtime directory itself

## Current limitation

There is not yet a dedicated **single “pause everything but keep it installed”** command.

Today the clean choices are:
- **temporary stop**: `~/.autonoma/bin/autonoma-up stop`
- **full shutdown and prevent restart**: `~/.autonoma/uninstall.sh`

---

# What gets installed into your home directory

Autonoma deploys into:

```text
~/.autonoma/
```

Important subpaths:

```text
~/.autonoma/
  config.json
  manifest.json
  blackboard.db
  logs/
  bin/
    autonoma-up
    autonoma-wa
  hooks/
  scripts/
  cron/
  control-surface/
  whatsapp/
```

External files touched:

- `~/.claude/settings.json`
- `~/Library/LaunchAgents/com.autonoma.scheduler.plist` on macOS
- user crontab entry on Linux

The installer tracks these changes in:

```text
~/.autonoma/manifest.json
```

Hook execution model after install:

- Claude invokes `~/.autonoma/hooks/*.sh`
- those wrappers call `~/.autonoma/scripts/hook-dispatch.sh`
- the shell wrapper immediately hands off to `~/.autonoma/scripts/hook_dispatch.py`
- the Python dispatcher reads the JSON payload once, writes the event into the configured `blackboardPath`, and only attempts the HTTP forward when the control surface PID file points to a live process
- when no listener is present, the dispatcher logs `post_status=skip` instead of spinning on shell string handling

---

# Main runtime commands

## Installer lifecycle

```bash
~/.autonoma/init.sh
~/.autonoma/install.sh
~/.autonoma/uninstall.sh
~/.autonoma/uninstall.sh --meta
```

## Control surface lifecycle

```bash
~/.autonoma/bin/autonoma-up start
~/.autonoma/bin/autonoma-up status
~/.autonoma/bin/autonoma-up stop
~/.autonoma/bin/autonoma-up restart
```

## WhatsApp lifecycle

```bash
~/.autonoma/bin/autonoma-wa start
~/.autonoma/bin/autonoma-wa status
~/.autonoma/bin/autonoma-wa stop
~/.autonoma/bin/autonoma-wa auth
~/.autonoma/bin/autonoma-wa auth --pairing-code
```

## App dev commands

From repo root:

```bash
pnpm run control-surface
pnpm run web:dev
pnpm run web:build
```

---

# Logs and state

## Logs

Installed runtime logs live under:

```text
~/.autonoma/logs/
```

Common files:

- `control-surface.log`
- `cron.log`
- `install.log`
- `whatsapp.log`
- `hooks.log`
- `hooks-errors.log`

## SQLite blackboard

```text
~/.autonoma/blackboard.db
```

## Pi runtime state

```text
~/.autonoma/control-surface/
```

Includes:
- `server.pid`
- session files
- agent resources

## WhatsApp state

```text
~/.autonoma/whatsapp/
```

Includes:
- daemon pid/socket files
- auth state
- config

---

# Development notes

## Source of truth

- `src/**` is the source of truth for runtime logic
- `web/**` is the browser client
- `.autonoma/**` is the deploy/install/runtime-asset layer
- `features/**` contains the architecture/spec docs

## Current packaging model

Right now, this repo is designed around:
- cloning the repo
- installing prerequisites manually
- deploying runtime scripts into `~/.autonoma/`
- running the control surface from the checked-out repo

It is **not yet a standalone bundled app**.

---

# Troubleshooting

## `autonoma-up start` fails

Check:

- `~/.autonoma/config.json`
- `~/.autonoma/logs/control-surface.log`
- that `node`, `claude`, `tmux`, `jq`, `sqlite3`, and `python3` are available
- that repo dependencies were installed with `pnpm install`

## WhatsApp auth errors

Run:

```bash
~/.autonoma/bin/autonoma-wa auth
```

and re-link the session.

## Hooks appear not to fire

Check:
- `~/.claude/settings.json`
- `~/.autonoma/hooks/*`
- `~/.autonoma/scripts/hook_dispatch.py`
- `~/.autonoma/logs/hooks.log`
- `~/.autonoma/logs/hooks-errors.log`

Expected behavior:

- hook entries are installed as async command hooks with a `15` second timeout
- `hooks.log` should show `post_status=200` when the control surface accepts the event
- `hooks.log` should show `post_status=skip` when the control surface is down or not yet listening
- `hooks-errors.log` should only contain malformed payload or transient network warnings, not repeated `curl` connection spam

## Runtime keeps coming back after stop

That usually means the scheduler is still installed.

To fully prevent restart:

```bash
~/.autonoma/uninstall.sh
```

---

# Audit commands

Install tooling:

```bash
pnpm install
uv sync --dev
```

Run audits:

```bash
pnpm run audit
pnpm run audit:ts
pnpm run audit:py
pnpm run audit:shell
```

---

# Summary

If you are setting up Autonoma from a repo clone:

1. install prerequisites
2. `pnpm install`
3. `pnpm --dir web install`
4. `./.autonoma/init.sh`
5. `~/.autonoma/install.sh`
6. `~/.autonoma/bin/autonoma-up start`
7. optionally `~/.autonoma/bin/autonoma-wa auth`
8. optionally `pnpm --dir web dev`

If you want to bring the system down safely:

- stop runtime: `~/.autonoma/bin/autonoma-up stop`
- full disable / remove scheduler + hooks: `~/.autonoma/uninstall.sh`
