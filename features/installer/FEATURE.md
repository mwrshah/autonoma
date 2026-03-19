# Feature: Installer / Uninstaller

Permission-gated, manifest-tracked modification of external configs. Every change reversible in one command. Uninstaller written and tested before installer.

## Problem

Autonoma modifies files it doesn't own: `~/.claude/settings.json` (hooks) and scheduler integration files (`launchd` on macOS, `systemd --user` on Linux). Changes must coexist with existing config and be removable without artifacts.

## Goals

1. Install Claude Code hook entries in `~/.claude/settings.json` pointing to `~/.autonoma/hooks/`
2. Install scheduler entries (launchd plist on macOS, `systemd --user` timer on Linux)
3. Show exact proposed changes; proceed only on explicit confirmation
4. Record all external modifications in `~/.autonoma/manifest.json`
5. Surgical uninstaller: removes only Autonoma's entries
6. Meta uninstall: one-command complete removal

## Design

### Identification

Hook commands point to `~/.autonoma/hooks/*` (path-based). Manifest records exact inserted objects — uninstaller matches on path prefix and manifest content.

### Manifest (`~/.autonoma/manifest.json`)

Records: hook entries added (exact objects), scheduler entries (plist path or systemd unit paths), timestamp, Autonoma version.

### Claude Code Hooks

**Install:** Read `~/.claude/settings.json` → for each event (SessionStart, Stop, SessionEnd) register a command entry (`node ~/.autonoma/hooks/hook-post.mjs <event-slug>`) → show diff → confirm → write + update manifest. Any deprecated hook events from previous installs are cleaned up automatically.

**Uninstall:** Read manifest → remove entries matching `~/.autonoma/hooks/` prefix (both direct path and `node <path>` forms) → show changes → confirm → write + clear manifest.

### Scheduler

- **macOS**: `~/Library/LaunchAgents/com.autonoma.scheduler.plist`
- **Linux**: `~/.config/systemd/user/autonoma-scheduler.service` + `autonoma-scheduler.timer`

### Meta Uninstall (`node ~/.autonoma/uninstall.mjs`)

Runs hooks uninstaller → scheduler uninstaller → optionally removes `~/.autonoma/` (with confirmation).

## External Files Touched

- `~/.claude/settings.json`
- `~/Library/LaunchAgents/com.autonoma.scheduler.plist` (macOS) or `~/.config/systemd/user/autonoma-scheduler.{service,timer}` (Linux)
- `~/.autonoma/manifest.json`

## Constraints

- Uninstaller-first: removal code before installation code
- Idempotent: double-install doesn't duplicate; double-uninstall doesn't error
- Permission-gated: every modification requires confirmation
- macOS first, Linux follows
