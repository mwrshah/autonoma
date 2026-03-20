# Spec: Skill Picker Dropdown

## Problem
Users have no way to discover or invoke Pi skills from the InputSurface. Skills are only accessible if you know the `/skillname` syntax.

## Approach
Add a `GET /api/skills` backend endpoint. On the frontend, detect `/` at the start of input and show a cmdk-based `Command` + Radix `Popover` dropdown anchored above the input, filtered as the user types. Uses shadcn components.

## Functional Requirements

### FR-1: Skills API endpoint
- `GET /api/skills` returns JSON array of `{ name, description, disableModelInvocation }`
- Reads from `resourceLoader.getSkills()` on the Pi agent session
- No auth required (same as other browser API routes)

### FR-2: Slash-command detection
- When user types `/` at position 0 in the MessageInput textarea, open the skill picker
- Characters after `/` filter the list client-side
- Escape or clicking outside dismisses the picker
- Typing beyond a space after the skill name dismisses the picker

### FR-3: Skill picker dropdown UI
- Use cmdk `Command` + Radix `Popover` (shadcn pattern)
- Popover anchored to the textarea, opens upward (`side="top"`)
- Each item shows `/name` (mono) + description (muted, truncated)
- Arrow keys navigate, Enter selects
- Focus stays in the textarea at all times

### FR-4: Skill selection behavior
- Selecting a skill replaces the current input with `/{name} ` (trailing space)
- User continues typing their prompt after the skill name
- Message is sent as-is — Pi already understands `/skillname` prefixed messages

### FR-5: Dependencies
- Add `cmdk` and `@radix-ui/react-popover` to `web/package.json` (or full shadcn init)
- New component: `web/src/components/input-surface/SkillPicker.tsx`

## Files Likely Touched
- `src/contracts/control-surface-api.ts` — endpoint definition
- `src/control-surface/runtime.ts` — GET handler
- `web/package.json` — cmdk, radix popover
- `web/src/lib/api.ts` — fetchSkills query
- `web/src/components/input-surface/SkillPicker.tsx` — new component
- `web/src/components/ui/MessageInput.tsx` — slash detection + integration
