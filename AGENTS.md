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
  {feature-name}/               # web-research, country-research, strategy
    FEATURE.md                  # Problem, goals, architecture, files touched
    specs/
      NN-{spec-name}/           # Numbered spec units (execution order)
        spec-{spec-name}.md     # Detailed implementation spec with FRs
        throwaway/              # Temporary exploration folder
          research.md           # Research doc: findings, patterns, rough plans
          references/           # Fetched docs, API dumps, blog posts, schemas
            api-docs.md
            openapi-schema.json
            ...
```

### File Purposes

| File | Purpose | Lifecycle |
|------|---------|----------|
| **FEATURE.md** | Master feature doc: problem statement, goals, architecture, files touched | Created at research phase; update on scope changes |
| **throwaway/** | *Optional* exploration folder for research and reference material | Created when research/exploration is needed |
| **throwaway/research.md** | Main research synthesis: findings, codebase patterns, interface contracts | Created during research phase |
| **throwaway/references/** | Raw fetched material: API docs, blog posts, JSON dumps, code samples | Accumulated during research; supports research.md |
| **spec-{spec-name}.md** | Detailed implementation specification with functional requirements. Name uses folder name as suffix for findability. | Created during spec phase; update on requirement changes |

### Key Facts

- 2 nesting levels: `features/{feature-name}/{FEATURE.md + specs/}` — no domain stratification
- Spec units are numbered (`01-`, `02-`) for dependency ordering and parallel execution
- Spec files use the pattern `spec-{spec-name}.md` (not just `spec.md`) so they're identifiable outside their folder
- The `throwaway/` folder is optional — only created when research or reference docs are needed
- During implementation, exclude `throwaway/` paths from searches — they are research artifacts, not implementation sources
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
