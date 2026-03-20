# Spec: InputSurface Markdown Rendering

## Problem
Pi responses in the InputSurface (chat input area) render as plain text. The main Pi chat board uses Lit + `marked`, but InputSurface is React — we need React-native markdown rendering there.

## Approach
Use `react-markdown` + `remark-gfm` + `rehype-highlight` (or shiki) styled with `@tailwindcss/typography` `prose` classes. This is the standard React markdown stack and avoids bridging Lit elements into React.

## Functional Requirements

### FR-1: Markdown rendering in InputSurface responses
- Pi responses displayed in the InputSurface render markdown (headings, lists, code blocks, links, tables, bold/italic)
- Use `react-markdown` with `remark-gfm` plugin for GFM support (tables, strikethrough, task lists)
- Use `rehype-highlight` for syntax-highlighted code blocks

### FR-2: Tailwind Typography styling
- Wrap rendered markdown output in Tailwind `prose` classes from `@tailwindcss/typography`
- Ensure visual consistency with the overall app theme (dark/light mode if applicable)
- Code blocks get proper background, padding, and font styling

### FR-3: Dependencies
- Add `react-markdown`, `remark-gfm`, `rehype-highlight` (or `shiki`) to `web/package.json`
- Add `@tailwindcss/typography` if not already present
- No changes to the existing Lit-based chat board rendering

## Files Likely Touched
- `web/package.json` — new deps
- `web/src/components/input-surface/` — markdown wrapper component
- `web/src/index.css` or Tailwind config — prose plugin registration
