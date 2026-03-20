# Feature: Installer / Uninstaller

Permission-gated, manifest-tracked modification of external configs and deployment of the `~/.autonoma/` runtime tree. Every change reversible in one command. Uninstaller written and tested before installer.

## Problem

Autonoma modifies files it doesn't own: `~/.claude/settings.json` (hooks) and scheduler integration files (`launchd` on macOS, `systemd --user` on Linux). It also deploys a runtime tree to `~/.autonoma/` containing hooks, scripts, config, and WhatsApp integration files. Changes must coexist with existing config and be removable without artifacts.

## Goals

1. Deploy runtime files to `~/.autonoma/` (hooks, scripts, bin, cron, WhatsApp, source files)
2. Bootstrap `~/.autonoma/config.json` and `~/.autonoma/whatsapp/config.json`
3. Initialize the blackboard database
4. Install Claude Code hook entries in `~/.claude/settings.json` pointing to `~/.autonoma/hooks/`
5. Install scheduler entries (launchd plist on macOS, `systemd --user` timer on Linux) — opt-in via `--with-scheduler`
6. Show exact proposed changes; proceed only on explicit confirmation
7. Record all external modifications in `~/.autonoma/manifest.json`
8. Surgical uninstaller: removes only Autonoma's entries
9. Meta uninstall: one-command complete removal

## CLI

**Installer** (`node .autonoma/install.mjs`):
- `--dry-run` — show what would change without writing
- `--yes` — skip confirmation prompts
- `--with-scheduler` / `--enable-scheduler` — install scheduler entries (off by default)
- `--without-scheduler` / `--skip-scheduler` — explicitly skip scheduler (default)

**Uninstaller** (`node ~/.autonoma/uninstall.mjs`):
- `--dry-run` — show what would change without writing
- `--yes` — skip confirmation prompts
- `--meta` — full removal including `~/.autonoma/` runtime tree (default)
- `--external-only` — remove hooks and scheduler but preserve `~/.autonoma/`

## Design

### Identification

Hook commands point to `~/.autonoma/hooks/*` (path-based). Manifest records exact inserted objects — uninstaller matches on path prefix and manifest content.

### Runtime Deployment

The installer syncs the full runtime tree into `~/.autonoma/`:
- **Top-level**: `install.mjs`, `uninstall.mjs`, `VERSION`
- **Hooks**: `hooks/hook-post.mjs`
- **Scripts**: `scripts/init-db.sh`, `scripts/runtime-common.sh`
- **Bin**: `bin/autonoma-up`, `bin/autonoma-wa`
- **Cron** (when `--with-scheduler`): `cron/autonoma-checkin.sh`, `cron/scheduler.sh`, `cron/com.autonoma.scheduler.plist`
- **WhatsApp**: `whatsapp/cli.js`, `whatsapp/daemon.js`, `whatsapp/run-entry.js`, `whatsapp/README.md`, `whatsapp/config.json.example`
- **Source**: `src/blackboard/schema.sql`

Obsolete files from previous installer versions (legacy shell scripts, Python dispatch scripts) are removed automatically. The project root is recorded at `~/.autonoma/source-root` so future installs can locate the repo.

### Config Bootstrap

Creates or updates `~/.autonoma/config.json` with defaults for:
- Control surface: `controlSurfaceHost`, `controlSurfacePort`, `controlSurfaceToken`
- Pi: `piModel`, `piThinkingLevel`
- Runtime: `stallMinutes`, `toolTimeoutMinutes`, `claudeCliCommand`
- Blackboard: `blackboardPath`
- WhatsApp: `whatsappAuthDir`, `whatsappSocketPath`, `whatsappPidPath`, `whatsappCliPath`, `whatsappDaemonPath`
- Paths: `projectRoot`, `sourceRoot`, `controlSurfaceCommand`

Also syncs `VITE_AUTONOMA_BASE_URL` and `VITE_AUTONOMA_TOKEN` to `web/.env` so the frontend can authenticate with the control surface.

### WhatsApp Config Bootstrap

If `~/.autonoma/whatsapp/config.json` does not exist, interactively prompts for a pairing phone number and creates the config with `recipientJid`, `pairingPhoneNumber`, and `typingDelayMs`.

### Blackboard Initialization

Runs `scripts/init-db.sh` to create the SQLite blackboard database at the configured `blackboardPath`.

### Manifest (`~/.autonoma/manifest.json`)

Target-keyed structure tracking all external modifications:

```
{
  version: "1",
  autonoma_version: "<from VERSION>",
  installed_at: "<ISO timestamp>",
  targets: {
    "<file-path>": {
      type: "<external-config | owned-tree>",
      modifications: [{ id, action, content, content_sha256 }],
      checksums: {
        algorithm: "sha256",
        file_before_install: "<hash>",
        file_after_install: "<hash>"
      }
    }
  }
}
```

Targets include `~/.claude/settings.json` (hooks), scheduler unit paths, and `~/.autonoma` (owned-tree snapshot of the entire runtime directory). Checksums enable drift detection during uninstall — the uninstaller warns if `settings.json` was modified externally since installation.

### Claude Code Hooks

**Install:** Read `~/.claude/settings.json` → for each event (SessionStart, Stop, SessionEnd) register a hook group (`{ matcher: "", hooks: [{ type: "command", command: "node ~/.autonoma/hooks/hook-post.mjs <event-slug>", async: true, timeout: 15 }] }`) → show diff → confirm → write + update manifest. Deprecated hook events (PreToolUse, PostToolUse, PostToolUseFailure, SubagentStart, SubagentStop) from previous installs are cleaned up automatically.

**Uninstall:** Read manifest → detect drift via checksum comparison → remove entries matching `~/.autonoma/hooks/` prefix (both direct path and `node <path>` forms) → show changes → confirm → write + clear manifest.

### Scheduler

Opt-in via `--with-scheduler` (skipped by default).

- **macOS**: `~/Library/LaunchAgents/com.autonoma.scheduler.plist`
- **Linux**: `~/.config/systemd/user/autonoma-scheduler.service` + `autonoma-scheduler.timer`

### Meta Uninstall (`node ~/.autonoma/uninstall.mjs`)

Runs hooks uninstaller → scheduler uninstaller → legacy crontab cleanup (removes `# autonoma-scheduler` entries from user crontab) → cleanup empty manifest → graceful stop (`autonoma-up stop`) → removes `~/.autonoma/` (with confirmation). Use `--external-only` to remove hooks and scheduler but preserve the runtime tree.

### Logging

Both scripts log to `~/.autonoma/logs/install.log` with automatic rotation at 10 MB.

## External Files Touched

- `~/.claude/settings.json`
- `~/Library/LaunchAgents/com.autonoma.scheduler.plist` (macOS) or `~/.config/systemd/user/autonoma-scheduler.{service,timer}` (Linux)
- `~/.autonoma/manifest.json`
- `~/.autonoma/config.json`
- `~/.autonoma/whatsapp/config.json`
- `~/.autonoma/blackboard.db`
- `web/.env` (when project root is available)

## Constraints

- Uninstaller-first: removal code before installation code
- Idempotent: double-install doesn't duplicate; double-uninstall doesn't error
- Permission-gated: every modification requires confirmation
- macOS first, Linux follows
