# Autonoma

## Feature Workflow

Spec-driven feature development organized through a `features/` directory tree.

### Directory Structure

```
features/
  {feature-name}/
    FEATURE.md                  # Problem, goals, architecture, files touched
    specs/
      NN-{spec-name}/           # Numbered spec units (execution order)
        spec-{spec-name}.md     # Detailed implementation spec with FRs
        throwaway/              # Optional exploration folder
          research.md           # Research synthesis: findings, patterns, rough plans
          references/           # Fetched docs, API dumps, blog posts, schemas
```

### File Purposes

| File | Purpose | Lifecycle |
|------|---------|----------|
| **FEATURE.md** | Master feature doc: problem statement, goals, architecture, files touched | Created at research phase; update on scope changes |
| **throwaway/** | Optional exploration folder for research and reference material | Created when research/exploration is needed |
| **throwaway/research.md** | Main research synthesis: findings, codebase patterns, interface contracts | Created during research phase |
| **throwaway/references/** | Raw fetched material: API docs, blog posts, JSON dumps, code samples | Accumulated during research; supports research.md |
| **spec-{spec-name}.md** | Detailed implementation specification with functional requirements. Name uses folder name as suffix for findability. | Created during spec phase; update on requirement changes |

### Key Rules

- 2 nesting levels: `features/{feature-name}/{FEATURE.md + specs/}` — no domain stratification
- Spec units are numbered (`01-`, `02-`) for dependency ordering and parallel execution
- Spec files use the pattern `spec-{spec-name}.md` (not just `spec.md`) so they're identifiable outside their folder
- The `throwaway/` folder is optional — only created when research or reference docs are needed
- During implementation, exclude `throwaway/` paths from searches — they are research artifacts, not implementation sources

### Densify Rule

After creating or substantially editing a research document, run `/densify <file_path>` as a final step before considering it done.
