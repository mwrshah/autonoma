# Spec: Installer / Uninstaller

Permission-gated, manifest-tracked install and removal of Autonoma's external config modifications. Uninstaller first.

## Scope

Two bash scripts (`install.sh`, `uninstall.sh`) and a manifest (`~/.autonoma/manifest.json`). Dependencies: `jq` (required), `plutil` and `launchctl` (macOS), `crontab` (Linux), `shasum` or equivalent SHA-256 tool.

### What Gets Installed

1. **Claude Code hooks** — matcher groups appended to `~/.claude/settings.json` for 8 events
2. **launchd plist** — `~/Library/LaunchAgents/com.autonoma.scheduler.plist` (macOS)
3. **Linux crontab** — entry marked `# autonoma-scheduler`
4. **Autonoma-owned runtime files** — hook scripts, shared writers, cron script, startup scripts, WhatsApp runtime files, config/bootstrap files under `~/.autonoma/`

### Files Touched

| File | Type | Owned? |
|------|------|--------|
| `~/.claude/settings.json` | JSON merge (append to arrays) | No — shared |
| `~/Library/LaunchAgents/com.autonoma.scheduler.plist` | File create | Yes |
| `~/.autonoma/manifest.json` | File create/update | Yes |
| `~/.autonoma/hooks/*.sh` | File create | Yes |
| `~/.autonoma/scripts/*` | File create | Yes |
| `~/.autonoma/cron/autonoma-checkin.sh` | File create | Yes |
| `~/.autonoma/bin/autonoma-up` | File create | Yes |
| `~/.autonoma/whatsapp/*` | File create | Yes |

---

## FR-1: Manifest Tracking

### Consequential Interface: Manifest Schema

The manifest must record every external modification with enough detail to reverse it, including before/after file checksums for drift detection and a `version` field for forward compatibility.

```json
{
  "version": "1",
  "autonoma_version": "0.1.0",
  "installed_at": "2026-03-07T14:30:00+05:00",
  "targets": {
    "~/.claude/settings.json": {
      "type": "json-merge",
      "modifications": [
        {
          "id": "hook:<EventName>",
          "action": "append",
          "content": { "<exact matcher group object>": true },
          "content_sha256": "<hash>"
        }
      ],
      "checksums": {
        "algorithm": "sha256",
        "file_before_install": "<hash>",
        "file_after_install": "<hash>"
      }
    },
    "~/Library/LaunchAgents/com.autonoma.scheduler.plist": {
      "type": "file-create",
      "modifications": [
        { "id": "launchd:scheduler", "action": "insert", "content_sha256": "<hash>" }
      ],
      "checksums": {
        "algorithm": "sha256",
        "file_before_install": null,
        "file_after_install": "<hash>"
      }
    }
  }
}
```

Target paths are stored with `~` for portability and resolved at runtime.

---

## FR-2: Uninstaller (implement first)

### Hooks Uninstall

Read manifest; if empty or missing, no-op. For `settings.json`: validate JSON, compute current hash, compare with `file_after_install` to detect drift. Match each manifest modification against current file content. Show diff, confirm, atomic write (`jq` to tmpfile then `mv`), update manifest.

Drift handling:
- no drift: silent removal
- drift but entries intact: remove ours, warn
- entries modified or removed externally: warn, skip, require confirmation
- file missing or malformed: abort

### Cron Uninstall (macOS + Linux)

- **macOS:** boot out the launchd job, confirm, remove plist, update manifest.
- **Linux:** remove only the marked `# autonoma-scheduler` crontab entry, preserve all unrelated crontab lines, update manifest.

### Meta Uninstall

After hooks and cron: optionally remove `~/.autonoma/` entirely with confirmation.

### Success Criteria

- double-uninstall is a no-op
- removes only Autonoma's entries
- never corrupts `settings.json`
- drift warns but does not block

---

## FR-3: Installer

### Pre-flight

Verify `jq` is available. Ensure `~/.autonoma/`, `~/.autonoma/hooks/`, `~/.autonoma/scripts/`, `~/.autonoma/cron/`, and `~/.autonoma/logs/` exist.

### Hooks Install

Read or create `~/.claude/settings.json` (default `{}`). Abort on malformed JSON. Compute `file_before_install` hash. For each of 8 events, build a matcher group with empty matcher and command pointing to an **absolute hook script path** in `~/.autonoma/hooks/`. Check for existing Autonoma entries by command-path prefix; skip if identical, append if absent. Show diff, confirm, atomic write, record in manifest with `file_after_install` hash.

### Consequential Interface: Hook Matcher Group Shape

```json
{
  "matcher": "",
  "hooks": [
    { "type": "command", "command": "/absolute/path/.autonoma/hooks/<event>.sh" }
  ]
}
```

Empty matcher fires on all occurrences; scripts filter internally. **Decision:** use absolute paths, not `$HOME`.

### Cron Install (macOS + Linux)

#### macOS
Generate plist from template with absolute paths. Validate with `plutil -lint`. Ensure `~/Library/LaunchAgents/` exists. Copy plist (`644`), boot out if loaded, bootstrap, record in manifest.

**Decision:** schedule every 10 minutes.

#### Linux
Install one marked user crontab entry that runs:

```cron
*/10 * * * * /bin/bash "$HOME/.autonoma/cron/autonoma-checkin.sh" # autonoma-scheduler
```

The installer must preserve non-Autonoma crontab lines and only add/update the marked Autonoma line.

### Hook Scripts (8 events)

| Event | Script | Purpose |
|-------|--------|---------|
| `SessionStart` | `session-start.sh` | Record session start and launch metadata |
| `PreToolUse` | `pre-tool-use.sh` | Record tool use start |
| `PostToolUse` | `post-tool-use.sh` | Record tool completion |
| `PostToolUseFailure` | `post-tool-use-failure.sh` | Record tool failure |
| `Stop` | `stop.sh` | Record agent stop |
| `SessionEnd` | `session-end.sh` | Record session end |
| `SubagentStart` | `subagent-start.sh` | Record subagent spawn |
| `SubagentStop` | `subagent-stop.sh` | Record subagent completion |

All scripts:
1. read JSON from stdin
2. call `~/.autonoma/scripts/bb-write.py`
3. read `~/.autonoma/config.json` for `controlSurfacePort` and `controlSurfaceToken`
4. best-effort POST the same payload to `/hook/:event`
5. exit `0` without blocking Claude Code

This means the hooks do not require installer-injected environment variables for control-surface config.

### Shared Runtime Files

Installer also deploys:
- `~/.autonoma/scripts/bb-write.py`
- `~/.autonoma/scripts/init-db.sh`
- `~/.autonoma/cron/autonoma-checkin.sh`
- `~/.autonoma/bin/autonoma-up`
- WhatsApp runtime files under `~/.autonoma/whatsapp/`
- `~/.autonoma/config.json` bootstrap if missing

### Success Criteria

- double-install doesn't duplicate
- shows diff, requires confirmation
- creates valid manifest for uninstaller
- hook scripts are executable and non-blocking

---

## FR-4: Permission Gating

Every modification shows a sorted diff and prompts `Apply these changes? [y/N]` by default. `--yes` skips confirmation; `--dry-run` shows changes without writing.

---

## FR-5: Idempotency

| Operation | Behavior |
|-----------|----------|
| Install (same version, already installed) | No-op |
| Install (different version) | Update entries + manifest |
| Uninstall (not installed) | No-op |
| Uninstall (entries externally removed) | Warn, clear manifest |
| Install (partial manual removal) | Re-add missing entries only |

---

## File Layout

```text
~/.autonoma/
  install.sh
  uninstall.sh
  manifest.json
  config.json
  bin/autonoma-up
  hooks/{session-start,pre-tool-use,post-tool-use,post-tool-use-failure,stop,session-end,subagent-start,subagent-stop}.sh
  scripts/{bb-write.py,init-db.sh}
  cron/autonoma-checkin.sh
  whatsapp/*
  logs/install.log
```

## Implementation Order

1. manifest schema (FR-1)
2. hooks uninstaller (FR-2)
3. cron uninstaller (FR-2)
4. hooks installer (FR-3)
5. cron installer (FR-3)
6. shared runtime file deployment (FR-3)
7. permission gating + dry-run (FR-4)
8. idempotency edge cases (FR-5)
9. meta uninstall

---

## Locked Decisions

- version source is `.autonoma/VERSION`
- logs use simple size-based rotation in v1: rotate at 10MB and keep 1 backup
- upgrades always re-deploy Autonoma-owned runtime files
- v1 uses a single startup wrapper at `~/.autonoma/bin/autonoma-up`
