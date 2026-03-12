# Feature: Installer / Uninstaller

Permission-gated, manifest-tracked modification of external configs. Every change reversible in one command. Uninstaller written and tested before installer.

## Problem

Autonoma modifies files it doesn't own: `~/.claude/settings.json` (hooks) and system cron (launchd/crontab). Changes must coexist with existing config and be removable without artifacts.

## Goals

1. Install Claude Code hook entries in `~/.claude/settings.json` pointing to `~/.autonoma/hooks/`
2. Install cron entries (launchd plist on macOS, crontab on Linux)
3. Show exact proposed changes; proceed only on explicit confirmation
4. Record all external modifications in `~/.autonoma/manifest.json`
5. Surgical uninstaller: removes only Autonoma's entries
6. Meta uninstall: one-command complete removal

## Design

### Identification

Hook commands point to `~/.autonoma/hooks/*` (path-based). Manifest records exact inserted objects — uninstaller matches on path prefix and manifest content.

### Manifest (`~/.autonoma/manifest.json`)

Records: hook entries added (exact objects), cron entries (plist path or crontab text), timestamp, Autonoma version.

### Claude Code Hooks

**Install:** Read `~/.claude/settings.json` → for each event (SessionStart, PreToolUse, PostToolUse, PostToolUseFailure, Stop, SessionEnd, SubagentStart, SubagentStop) check for existing `~/.autonoma/hooks/` entry → append if absent → show diff → confirm → write + update manifest.

**Uninstall:** Read manifest → remove entries matching `~/.autonoma/hooks/` prefix → show changes → confirm → write + clear manifest.

### Cron

- **macOS**: `~/Library/LaunchAgents/com.autonoma.scheduler.plist`
- **Linux**: crontab entry marked `# autonoma-scheduler`

### Meta Uninstall (`~/.autonoma/uninstall.sh`)

Runs hooks uninstaller → cron uninstaller → optionally removes `~/.autonoma/` (with confirmation).

## External Files Touched

- `~/.claude/settings.json`
- `~/Library/LaunchAgents/com.autonoma.scheduler.plist` (macOS) or crontab (Linux)
- `~/.autonoma/manifest.json`

## Constraints

- Uninstaller-first: removal code before installation code
- Idempotent: double-install doesn't duplicate; double-uninstall doesn't error
- Permission-gated: every modification requires confirmation
- macOS first, Linux follows
