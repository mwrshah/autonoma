# Autonoma

Self-recursive Pi agent harness that extends itself with skills and extensions.

## Purpose

Autonoma is a Pi coding agent project that builds on the Pi agent harness (`pi-mono`). Its job is to extend Pi's capabilities by writing new skills and extensions — using Pi itself to do the work.

The agent orchestrates Claude Code sessions and plugs into Claude Code hooks to populate context about running sessions. A state layer (blackboard pattern) tracks active Claude Code instances, their status, and session metadata.

## Architecture

- **Pi agent harness**: `~/Documents/coded-programs/pi-mono` — the upstream runtime
- **Claude Code hooks**: Feed session events (start, stop, tool use) into Autonoma's state layer
- **State blackboard**: Shared state about running Claude Code sessions — what's active, what each session is doing, transcript paths, working directories
- **Skills**: Markdown-based capabilities in `.pi/skills/` — the primary extension mechanism
- **Extensions**: TypeScript modules in `.pi/extensions/` — for custom tools, UI, event hooks

## How to extend

1. **Skills first**: Write a `SKILL.md` with instructions. No code needed. Invoke with `/skill:name`.
2. **Extensions when needed**: Write TypeScript for custom tools, UI components, or lifecycle hooks.
3. **Self-modify**: Ask this agent to build new skills/extensions. `/reload` to pick them up live.

## Key references

- Pi README: `~/Documents/coded-programs/pi-mono/packages/coding-agent/README.md`
- Pi skills docs: `~/Documents/coded-programs/pi-mono/packages/coding-agent/docs/skills.md`
- Pi extensions docs: `~/Documents/coded-programs/pi-mono/packages/coding-agent/docs/extensions.md`
- Pi SDK docs: `~/Documents/coded-programs/pi-mono/packages/coding-agent/docs/sdk.md`
- Claude Code hooks: See [official docs](https://docs.anthropic.com/en/docs/claude-code/hooks)

## Feature Workflow

A spec-driven feature development pipeline organized through a `features/` directory tree.

### Directory Structure

```
features/
  {feature-name}/
    FEATURE.md                  # Problem, goals, architecture, files touched
    specs/
      spec-{spec-name}.md      # Implementation spec with FRs
    throwaway/                  # Optional — research and reference material
      {spec-name}/
        research.md             # Research synthesis: findings, patterns, rough plans
        references/             # Fetched docs, API dumps, blog posts, schemas
```

### File Purposes

| File | Purpose | Lifecycle |
|------|---------|----------|
| **FEATURE.md** | Master feature doc: problem statement, goals, architecture, files touched | Created at research phase; update on scope changes |
| **spec-{spec-name}.md** | Detailed implementation specification with functional requirements | Created during spec phase; update on requirement changes |
| **throwaway/{spec-name}/research.md** | *Optional* research synthesis: findings, codebase patterns, interface contracts | Created during research phase; disposable |
| **throwaway/{spec-name}/references/** | Raw fetched material: API docs, blog posts, JSON dumps, code samples | Accumulated during research; disposable |

### Key Facts

- Flat structure inside `specs/` — no numbered subdirectories
- Spec files use the pattern `spec-{spec-name}.md` so they're identifiable outside their folder
- `throwaway/` is a sibling to `specs/`, organized by spec name — exclude from searches during implementation
- No checklists — Claude Code's internal planning system handles task tracking

### Open Decisions (TBD)

Use **`TBD`** inline in FEATURE.md or spec files to mark decisions that are still open and require user input. Format: `TBD: <description of what needs deciding>`. Examples:

```markdown
Frontend framework: TBD: React vs Svelte — user to decide after prototype
Schedule interval: TBD: 15 min default, but user may want configurable
```

TBDs signal that implementation cannot proceed on that detail without human input. When reviewing a feature or spec, scan for TBDs first — they are the open questions that block finalization.

### Densify Rule

After creating or substantially editing a research document, run `/densify <file_path>` as a final step before considering it done.

## Conventions

- Skills follow the [Agent Skills standard](https://agentskills.io/specification)
- Skill names: lowercase, hyphens only, must match directory name
- Extensions: default export function receiving `ExtensionAPI`
- Hot-reload everything: modify, `/reload`, continue
