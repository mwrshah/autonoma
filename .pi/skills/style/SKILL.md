---
name: style
description: Writing style transforms — densify, shorten, rephrase, or adjust tone. Routes automatically based on what you ask for.
argument-hint: "densify | short | rephrase | tone | humanize"
model: opus
---

# Style

Apply the right writing style transform based on what the user asked for.

$ARGUMENTS

## Styles

Each style has its own reference file with full instructions. Read the matched reference, then apply it to the text above.

- [references/densify.md](references/densify.md) — Compress while preserving every detail. Matches: densify, compress, tighten, shorter but keep everything, zero detail loss, summarize.
- [references/short.md](references/short.md) — Terse one-or-two-sentence replies. Matches: short, terse, brief, one sentence, concise, very short.
- [references/rephrase.md](references/rephrase.md) — Simplify structure, cut repetition, organize thought. Matches: rephrase, rewrite, simplify, clean up, organize, remove repetition, direct, to the point, cleaner.
- [references/tone.md](references/tone.md) — Rewrite as a clean, positive instruction. Matches: tone, positive, instruction style, forward facing, rewrite as instruction.
- [references/humanize.md](references/humanize.md) — Remove signs of AI-generated writing using a 24-pattern taxonomy. Matches: humanize, humanizer, deslop, remove AI, sound human, natural, not AI, slop, AI patterns, soulless.

Pick the single best match from the user's wording. If genuinely unclear, ask. If the input is a file path, read the file first.
