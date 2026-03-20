# Spec: Skill Picker Dropdown

## Problem

Users have no way to discover or invoke Pi skills from the web InputSurface. Skills are only accessible if you already know the `/skillname` syntax. There is no API endpoint exposing available skills to the frontend.

## Approach

1. Add a `GET /api/skills` backend route that reads from the SDK's `ResourceLoader`
2. Add a slash-command dropdown to MessageInput that triggers on `/` at position 0, using `cmdk` for keyboard-navigable filtered list inside a Radix Popover anchored above the textarea

## Architecture Context

**Skill loading (backend):** `createAutonomaAgent()` in `src/control-surface/pi/create-agent.ts` creates a `DefaultResourceLoader` with `additionalSkillPaths: [~/.agents/skills]`. After `resourceLoader.reload()`, `resourceLoader.getSkills()` returns `{ skills: Skill[], diagnostics }`. The session object (`runtime.piSession`) exposes `session.resourceLoader` as a public getter.

**SDK `Skill` type** (from `@mariozechner/pi-coding-agent/dist/core/skills.d.ts`):
```typescript
interface Skill {
  name: string;
  description: string;
  filePath: string;
  baseDir: string;
  source: string;
  disableModelInvocation: boolean;
}
```

Skills are discovered from `SKILL.md` files. Frontmatter provides `name`, `description`, and optional `disable-model-invocation`. Skills with `disableModelInvocation: true` can only be invoked explicitly via `/skill:name` (they are excluded from the system prompt but should still appear in the picker).

**Route pattern (backend):** Raw `http.Server` with manual routing in `src/control-surface/server.ts`. Each route is a standalone handler function in `src/control-surface/routes/`. The `routeRequest()` function matches `method + pathname` and delegates to the handler, passing `runtime` as first arg. Handlers use `sendJson(res, statusCode, body)` from `routes/_shared.ts`.

**Frontend API pattern:** `web/src/lib/api.ts` exports `createAutonomaApiClient()` which returns typed methods. Each method calls an internal `request<T>(path, init?)` helper. Data fetching uses TanStack Query.

**MessageInput structure:** `web/src/components/ui/MessageInput.tsx` is a controlled component. Parent passes `draft`/`onDraftChange`. The textarea handles Enter-to-send, Shift+Enter for newline, clipboard paste for images, and drag-drop. The component is ~168 lines with no existing autocomplete logic.

---

## Functional Requirements

### FR-1: Skills API Endpoint

**Add `GET /api/skills` to the control surface.**

Response type (add to `src/contracts/control-surface-api.ts`):
```typescript
export interface SkillListItem {
  name: string;
  description: string;
  disableModelInvocation: boolean;
}

export interface SkillsListResponse {
  items: SkillListItem[];
}
```

Add to `CONTROL_SURFACE_ENDPOINTS`:
```typescript
skills: { method: "GET", path: "/api/skills", auth: "none" },
```

**Route handler** — new file `src/control-surface/routes/browser-skills.ts`:
```typescript
export function handleBrowserSkillsRoute(
  runtime: ControlSurfaceRuntime,
  _req: http.IncomingMessage,
  res: http.ServerResponse,
) {
  const { skills } = runtime.piSession.resourceLoader.getSkills();
  const items = skills.map((s) => ({
    name: s.name,
    description: s.description,
    disableModelInvocation: s.disableModelInvocation,
  }));
  return sendJson(res, 200, { items });
}
```

**Register in `server.ts`** — add the route match inside `routeRequest()`:
```typescript
if (method === CONTROL_SURFACE_ENDPOINTS.skills.method && pathname === CONTROL_SURFACE_ENDPOINTS.skills.path) {
  return handleBrowserSkillsRoute(runtime, req, res);
}
```

If `runtime.piSession` is not yet initialized (startup race), return `503 { ok: false, error: "Pi session not ready" }`.

### FR-2: Frontend API Client

Add to the return object of `createAutonomaApiClient()` in `web/src/lib/api.ts`:
```typescript
listSkills: () => request<SkillsListResponse>("/api/skills"),
```

Add frontend type in `web/src/lib/types.ts`:
```typescript
export type SkillListItem = {
  name: string;
  description: string;
  disableModelInvocation: boolean;
};

export type SkillsListResponse = {
  items: SkillListItem[];
};
```

### FR-3: Slash-Command Detection

Detection logic lives in the component that owns the draft state (either MessageInput or the parent InputSurface — wherever the skill picker is integrated).

- When the textarea value matches `^\/(\S*)$` (slash at position 0, followed by zero or more non-whitespace chars, nothing else), open the picker with the captured group as the filter string
- When the value no longer matches (user typed a space, deleted the slash, or has other text), close the picker
- The regex `^\/(\S*)$` ensures the picker only activates when the entire input is a slash-command prefix — not mid-sentence

### FR-4: Skill Picker Dropdown Component

**New file: `web/src/components/input-surface/SkillPicker.tsx`**

Dependencies to add to `web/package.json`:
- `cmdk` (latest, provides `Command` component with built-in keyboard nav and filtering)

No Radix Popover needed — the picker can be a simple absolutely-positioned div above the textarea (the input is always pinned to the bottom of the viewport, so a Popover's repositioning logic adds complexity without benefit). Use a portal-free approach: render the picker as a sibling of the textarea inside the existing `relative` container in MessageInput.

Props:
```typescript
type SkillPickerProps = {
  open: boolean;
  filter: string;
  skills: SkillListItem[];
  onSelect: (skillName: string) => void;
  onClose: () => void;
};
```

Behavior:
- Render a `Command` (from `cmdk`) with a `CommandList` containing `CommandItem` for each skill
- Filter is driven externally via `filter` prop (the textarea IS the search input — no `CommandInput` rendered)
- Each item displays: `/{name}` in monospace, description in muted text, truncated
- Skills with `disableModelInvocation: true` are still shown (user may want to invoke them explicitly)
- `CommandEmpty` shows "No matching skills" when filter yields zero results
- Arrow keys navigate items, Enter selects (cmdk handles this natively)
- Escape closes the picker (handled in MessageInput's keydown)
- Clicking an item selects it
- Max height with overflow scroll for long lists

Positioning:
- Absolutely positioned above the textarea: `absolute bottom-full left-0 mb-1 w-80`
- Renders inside the existing `relative` wrapper div in MessageInput (line 110 of current MessageInput.tsx)
- Has a border, background, shadow, and rounded corners matching the existing UI style

### FR-5: MessageInput Integration

Modify `web/src/components/ui/MessageInput.tsx`:

1. **New props** — add to `MessageInputProps`:
   ```typescript
   skills?: SkillListItem[];
   ```

2. **Local state** — add:
   ```typescript
   const [pickerOpen, setPickerOpen] = useState(false);
   const [pickerFilter, setPickerFilter] = useState("");
   ```

3. **Draft change handler** — wrap `onDraftChange` to detect slash prefix:
   ```typescript
   function handleDraftChange(value: string) {
     onDraftChange(value);
     const match = value.match(/^\/(\S*)$/);
     if (match && skills?.length) {
       setPickerOpen(true);
       setPickerFilter(match[1]);
     } else {
       setPickerOpen(false);
     }
   }
   ```

4. **Keyboard handling** — modify `handleKeyDown`:
   - When `pickerOpen` is true:
     - `ArrowUp`, `ArrowDown`: let the event propagate to cmdk (do NOT `preventDefault` for Enter-to-send)
     - `Enter`: prevent default, select the currently highlighted cmdk item (cmdk handles this internally if focus is managed correctly — alternatively, use a ref to the Command component)
     - `Escape`: close the picker, `preventDefault`
   - When `pickerOpen` is false: existing behavior (Enter sends, Shift+Enter newline)

5. **Selection handler**:
   ```typescript
   function handleSkillSelect(name: string) {
     onDraftChange(`/${name} `);
     setPickerOpen(false);
     // textarea retains focus — user continues typing after the skill name
   }
   ```

6. **Render** — place `SkillPicker` inside the existing `relative` div (line 110), before the textarea:
   ```tsx
   <SkillPicker
     open={pickerOpen}
     filter={pickerFilter}
     skills={skills ?? []}
     onSelect={handleSkillSelect}
     onClose={() => setPickerOpen(false)}
   />
   ```

### FR-6: Data Fetching

In the parent component that renders `MessageInput` (likely `InputSurface.tsx`), fetch skills with TanStack Query:

```typescript
const { data: skillsData } = useQuery({
  queryKey: ["skills"],
  queryFn: () => api.listSkills(),
  staleTime: 5 * 60 * 1000,   // skills rarely change — 5 min stale time
  refetchOnWindowFocus: false,
});
```

Pass `skills={skillsData?.items}` to `MessageInput`.

### FR-7: cmdk Focus Management

The key challenge: cmdk expects to own focus for keyboard navigation, but we need focus to stay in the textarea (the user is typing). Two approaches:

**Approach A (preferred): Use cmdk in "controlled" mode.** cmdk's `Command` component accepts a `value` prop and `onValueChange` callback. Set `filter` prop to disable cmdk's built-in filtering (we filter externally). Forward ArrowUp/ArrowDown from the textarea's keydown handler to programmatically change the selected value. This avoids any focus-stealing.

**Approach B: Let cmdk handle focus.** Render a hidden `CommandInput` that mirrors the textarea value. This is fragile and not recommended.

Implementation notes for Approach A:
- Track `selectedValue` state in MessageInput
- On ArrowDown: move to next item. On ArrowUp: move to previous item
- On Enter (when picker is open): call `onSelect(selectedValue)`
- Pass `value={selectedValue}` and `onValueChange={setSelectedValue}` to `Command`
- Use `shouldFilter={false}` on `Command` — filtering is done in SkillPicker via the `filter` prop

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/control-surface/routes/browser-skills.ts` | GET handler for `/api/skills` |
| `web/src/components/input-surface/SkillPicker.tsx` | Dropdown component |

## Files to Modify

| File | Change |
|------|--------|
| `src/contracts/control-surface-api.ts` | Add `SkillListItem`, `SkillsListResponse` types; add `skills` to `CONTROL_SURFACE_ENDPOINTS` |
| `src/control-surface/server.ts` | Import handler, add route match in `routeRequest()` |
| `web/package.json` | Add `cmdk` dependency |
| `web/src/lib/types.ts` | Add `SkillListItem`, `SkillsListResponse` types |
| `web/src/lib/api.ts` | Add `listSkills()` method |
| `web/src/components/ui/MessageInput.tsx` | Add `skills` prop, slash detection, picker state, keyboard delegation, render SkillPicker |
| `web/src/components/input-surface/InputSurface.tsx` | Fetch skills via useQuery, pass to MessageInput |

## Dependencies to Add

| Package | Where | Why |
|---------|-------|-----|
| `cmdk` | `web/package.json` | Command palette component with built-in keyboard navigation and filtering |

No Radix Popover needed — absolute positioning inside the existing relative container is sufficient.

## Acceptance Criteria

1. `GET /api/skills` returns all loaded skills with `name`, `description`, `disableModelInvocation` — returns 503 if Pi session isn't ready
2. Typing `/` in an empty MessageInput opens the skill picker above the textarea
3. Typing further characters after `/` filters the list by skill name (case-insensitive substring match)
4. Arrow keys navigate the list, Enter selects, Escape dismisses — all without losing textarea focus
5. Selecting a skill replaces input with `/{name} ` (trailing space) and closes the picker
6. Typing a space or clearing the input closes the picker
7. The picker is visually consistent with existing UI (border, background, text styles match the app theme)
8. Enter-to-send still works when the picker is closed
9. Skills list is cached with 5-minute stale time (not refetched on every keystroke)
