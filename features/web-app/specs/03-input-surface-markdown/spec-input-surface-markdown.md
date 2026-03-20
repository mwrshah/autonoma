# Spec: InputSurface Markdown Rendering

## Problem

Pi responses in the InputSurface render as plain text (`<p className="... whitespace-pre-wrap">{entry.content}</p>` in `PiResponseEntry`). The main Pi chat board uses Lit + `marked` for markdown, and the TranscriptViewer uses `react-markdown` + `remark-gfm`. InputSurface is a React component — we need React-native markdown rendering that produces visually consistent output.

## Approach

Reuse the existing `react-markdown` + `remark-gfm` stack already in the project (used by TranscriptViewer) with the existing `.markdown-body` CSS class. Add `rehype-highlight` for syntax-highlighted code blocks matching the highlight.js output in the chat board. No new Lit bridge, no `@tailwindcss/typography` — keep it consistent with what's already in the codebase.

## Existing Codebase Context

### Already installed (web/package.json)
- `react-markdown` v9.0.3
- `remark-gfm` v4.0.0
- `highlight.js` v11.11.1

### Needs adding
- `rehype-highlight` — rehype plugin that applies highlight.js classes to `<code>` blocks inside react-markdown output

### Existing patterns to follow
- **TranscriptViewer** (`web/src/components/sessions/TranscriptViewer.tsx` lines 30-31): wraps content in `<div className="markdown-body text-sm">` and renders `<Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>`
- **`.markdown-body` CSS** (`web/src/styles.css` lines 49-63): base styles for react-markdown output (line-height, paragraph margins, pre-wrap)
- **highlight.js theme**: already loaded globally for the Lit chat board's `<code-block>` component

### Integration point
- **`PiResponseEntry`** in `web/src/components/input-surface/InputSurface.tsx` (lines 152-169): currently renders `entry.content` as plain text in a `<p>` tag

## Functional Requirements

### FR-1: Create a shared `MarkdownContent` React component

Create `web/src/components/ui/MarkdownContent.tsx` — a reusable wrapper around react-markdown that both InputSurface and TranscriptViewer can use.

```typescript
// web/src/components/ui/MarkdownContent.tsx
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type MarkdownContentProps = {
  children: string;
  className?: string;
};

export function MarkdownContent({ children, className }: MarkdownContentProps) {
  return (
    <div className={cn("markdown-body text-sm", className)}>
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {children}
      </Markdown>
    </div>
  );
}
```

Requirements:
- Accepts `children` (markdown string) and optional `className` for additional styling
- Applies `remarkGfm` for GFM support (tables, strikethrough, task lists)
- Applies `rehypeHighlight` for syntax-highlighted code blocks
- Wraps output in `<div className="markdown-body text-sm">` to pick up existing CSS
- Uses `cn()` from `~/lib/utils` to merge className

### FR-2: Render Pi responses with markdown in InputSurface

Modify `PiResponseEntry` in `web/src/components/input-surface/InputSurface.tsx` to use `MarkdownContent` instead of a plain `<p>` tag.

**Current** (lines 162-166):
```tsx
<div className="flex-1 min-w-0 rounded-lg border border-border bg-muted/30 px-3 py-2">
  <p className="text-sm text-foreground whitespace-pre-wrap break-words">
    {entry.content}
  </p>
</div>
```

**Target**:
```tsx
<div className="flex-1 min-w-0 rounded-lg border border-border bg-muted/30 px-3 py-2">
  <MarkdownContent>{entry.content}</MarkdownContent>
</div>
```

Requirements:
- Only `PiResponseEntry` (kind `"pi-response"`) renders markdown — user inbound messages stay as plain text
- The surrounding container div (border, bg, padding) remains unchanged
- Remove the `whitespace-pre-wrap break-words` since markdown rendering handles its own whitespace

### FR-3: Migrate TranscriptViewer to use shared component

Update `TranscriptViewer.tsx` to use `MarkdownContent` instead of inline `<Markdown>` usage.

**Current** (lines 30-31):
```tsx
<div className="markdown-body text-sm">
  <Markdown remarkPlugins={[remarkGfm]}>{item.text ?? ""}</Markdown>
</div>
```

**Target**:
```tsx
<MarkdownContent>{item.text ?? ""}</MarkdownContent>
```

This also gives TranscriptViewer syntax highlighting for free (via `rehypeHighlight`).

### FR-4: Add `rehype-highlight` dependency

```bash
cd web && pnpm add rehype-highlight
```

No other dependencies needed — `react-markdown`, `remark-gfm`, and `highlight.js` are already installed. `rehype-highlight` uses the project's existing highlight.js installation.

### FR-5: Extend `.markdown-body` CSS for code blocks

Add code block styling to the existing `.markdown-body` rules in `web/src/styles.css` so syntax-highlighted code renders properly. The Lit chat board has its own `.markdown-content` styles in `pi-web-ui.css`; these additions are for the React pipeline only.

Add after the existing `.markdown-body pre` rule (line 63):

```css
.markdown-body code {
  font-size: 0.85em;
  padding: 0.15em 0.35em;
  border-radius: 0.25rem;
  background: var(--color-muted);
}
.markdown-body pre code {
  display: block;
  padding: 0.8em 1em;
  overflow-x: auto;
  font-size: 0.8em;
  line-height: 1.5;
  border-radius: 0.375rem;
}
.markdown-body a {
  text-decoration: underline;
  text-underline-offset: 2px;
}
.markdown-body ul, .markdown-body ol {
  padding-left: 1.5em;
  margin: 0.5em 0;
}
.markdown-body blockquote {
  border-left: 3px solid var(--color-border);
  padding-left: 0.8em;
  margin: 0.5em 0;
  color: var(--color-muted-foreground);
}
```

## Files to Create

| File | Purpose |
|------|---------|
| `web/src/components/ui/MarkdownContent.tsx` | Shared react-markdown wrapper component |

## Files to Modify

| File | Change |
|------|--------|
| `web/src/components/input-surface/InputSurface.tsx` | Import `MarkdownContent`, replace `<p>` in `PiResponseEntry` |
| `web/src/components/sessions/TranscriptViewer.tsx` | Replace inline `<Markdown>` with `<MarkdownContent>`, remove direct react-markdown/remark-gfm imports |
| `web/src/styles.css` | Add code block, link, list, blockquote styles to `.markdown-body` |
| `web/package.json` | Add `rehype-highlight` |

## Files NOT Touched

- `web/src/pi-web-ui/chat-components.ts` — Lit pipeline stays as-is
- `web/src/pi-web-ui.css` — Lit-specific styles unchanged

## Acceptance Criteria

1. Pi responses in InputSurface render headings, bold, italic, lists, links, tables, code blocks, and blockquotes
2. Code blocks in Pi responses show syntax highlighting
3. Links open in new tabs (react-markdown default or add target via custom component)
4. TranscriptViewer renders identically or better than before (gains syntax highlighting)
5. No visual regression in the Lit-based chat board
6. Only one new dependency added (`rehype-highlight`)
