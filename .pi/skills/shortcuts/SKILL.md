---
name: shortcuts
description: Quick command shortcuts — commit+push, and more. Routes automatically based on what you ask for.
argument-hint: "spush | push | sync | runexact"
---

# Shortcuts

Run the right shortcut based on what the user asked for.

$ARGUMENTS

## Available Shortcuts

Each shortcut has its own reference file with the prompt to execute. Read the matched reference, then follow its instructions.

- [references/spush.md](references/spush.md) — Quick commit and push (no lint/format). Matches: spush, quick push, ship it, send it.
- [references/push.md](references/push.md) — Full push: lint, format, typecheck, commit, push. Matches: push, full push, lint and push, format and push.
- [references/sync.md](references/sync.md) — Sync main + all worktree branches using Git Town. Matches: sync, down sync, git town sync, pull down, sync all.
- [references/runexact.md](references/runexact.md) — Execute a command exactly as written, no modifications. Matches: runexact, run exact, run this exactly, exact command, verbatim.

Pick the single best match from the user's wording. If genuinely unclear, ask.
