---
name: todoist
description: Plan todoist tasks. Schedule tasks to do in a managable way within the current week.
model: haiku
---

## How to Execute — Scripts, Not MCP

**All Todoist operations go through Python scripts in `scripts/`.**
Do NOT use MCP todoist tools. Always use Bash to run the scripts below.
Scripts require `TODOIST_API_KEY` in the shell environment and use stdlib only (no pip).

### Script Reference

| Script | Purpose | Example |
|--------|---------|---------|
| `get_projects.py` | List all projects | `python3 scripts/get_projects.py` |
| `search_projects.py` | Search projects by name | `python3 scripts/search_projects.py "Computer"` |
| `get_tasks.py` | Get tasks (filter by project/section/label) | `python3 scripts/get_tasks.py --project ID --limit 50` |
| `search_tasks.py` | Filter tasks with Todoist filter syntax | `python3 scripts/search_tasks.py "overdue"` |
| `get_task.py` | Get single task by ID | `python3 scripts/get_task.py TASK_ID` |
| `create_task.py` | Create a task with options | `python3 scripts/create_task.py "Buy milk" --due "tomorrow" --project ID` |
| `update_task.py` | Update task fields | `python3 scripts/update_task.py TASK_ID --due "next Monday"` |
| `complete_task.py` | Close one or more tasks | `python3 scripts/complete_task.py ID1 ID2 ID3` |
| `move_task.py` | Move task to project/section/parent | `python3 scripts/move_task.py TASK_ID --project ID` |
| `delete_task.py` | Delete task permanently | `python3 scripts/delete_task.py TASK_ID` |
| `get_sections.py` | List sections for a project | `python3 scripts/get_sections.py PROJECT_ID` |
| `quick_add.py` | Natural language quick-add | `python3 scripts/quick_add.py "Call dentist tomorrow #Calls p2"` |
| `get_completed.py` | Get completed tasks by date range | `python3 scripts/get_completed.py --since 2026-02-01 --until 2026-03-01` |
| `get_user.py` | Current user info | `python3 scripts/get_user.py` |
| `batch.py` | Bulk operations from JSON file or stdin | `python3 scripts/batch.py reschedule tasks.json` |

### Script Details

All scripts accept `--raw` (where applicable) to get full JSON output instead of compact lines.

**Priority mapping:** Scripts accept user-facing priority (1=P1 highest, 4=P4 lowest) and automatically convert to the Todoist API's inverted values (API 4=P1, API 1=P4). When reading raw JSON from the API, remember that `"priority": 4` means P1 (highest) and `"priority": 1` means P4 (lowest). Use `5 - api_value` to convert.

**`create_task.py` options:** `--project ID`, `--section ID`, `--parent ID`, `--priority N` (1=highest, 4=lowest), `--due STRING`, `--due-date YYYY-MM-DD`, `--deadline YYYY-MM-DD`, `--label NAME` (repeatable), `--description TEXT`

**`update_task.py` options:** `--content TEXT`, `--description TEXT`, `--priority N`, `--due STRING`, `--due-date YYYY-MM-DD`, `--deadline YYYY-MM-DD`, `--label NAME` (repeatable, replaces all), `--clear-due`

**`search_tasks.py` filter examples:** `"overdue"`, `"today"`, `"due before: next week"`, `"#Inbox"`, `"##Computer"`, `"search: buy groceries"`, `"no date"`, `"p1"`, `"@label_name"`

**`#` vs `##` in filters:** `#Project` matches only that project. `##Project` matches the project **and all its sub-projects**. When the user mentions a project and its children (e.g. "Computer or its sub-projects"), always use `##`.

**`batch.py` actions:** `create`, `update`, `complete`, `move`, `delete`, `reschedule` — reads a JSON array from a file or stdin (`-`).

### API Response Schemas

**Task object** (returned by all task endpoints, inside `results[]` for paginated endpoints):
```
{
  "id": "string",              // Task ID
  "content": "string",         // Task title
  "description": "string",     // Task description
  "project_id": "string",      // Project ID (NOT project name — join with get_projects.py)
  "section_id": "string|null", // Section ID
  "parent_id": "string|null",  // Parent task ID (subtask)
  "user_id": "string",         // Owner user ID
  "priority": 1-4,             // API: 4=P1(highest), 1=P4(lowest). Scripts handle conversion.
  "labels": ["string"],        // Label names
  "due": { ... } | null,       // Due date object (see below)
  "deadline": { "date": "YYYY-MM-DD" } | null,
  "duration": { "amount": int, "unit": "minute"|"day" } | null,
  "checked": false,            // Completed?
  "is_deleted": false,
  "is_collapsed": bool,
  "child_order": int,          // Position in parent/project
  "day_order": int,            // Position in today view
  "added_at": "ISO datetime",
  "updated_at": "ISO datetime",
  "completed_at": "ISO datetime|null",
  "added_by_uid": "string",
  "assigned_by_uid": "string|null",
  "responsible_uid": "string|null",
  "completed_by_uid": "string|null",
  "note_count": int
}
```

**IMPORTANT: Tasks do NOT have a `project_name` field.** To get project names, fetch projects via `get_projects.py` and join on `project_id`.

**Due object** (`task.due`):
```
{
  "date": "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM:SS" or "YYYY-MM-DDTHH:MM:SSZ",
  "string": "human-readable (e.g. 'every day', 'tomorrow')",
  "lang": "en",
  "is_recurring": bool,
  "timezone": "America/New_York" | null   // null for full-day and floating times
}
```

**Paginated response envelope** (from `search_tasks.py --raw`, `get_tasks.py --raw`):
```
{
  "results": [ ...task objects... ],
  "next_cursor": "string|null"     // null when no more pages
}
```

**Project object** (from `get_projects.py`):
```
{
  "id": "string",
  "name": "string",
  "parent_id": "string|null",
  "order": int,
  "color": "string",
  "is_favorite": bool,
  "is_archived": bool,
  "view_style": "list"|"board"|"calendar"
}
```

### Execution Patterns

**Single action:**
```bash
python3 scripts/create_task.py "Review PR" --project PROJECT_ID --due "tomorrow" --priority 2
```

**Batch from JSON file:**
```bash
# Write JSON to a temp file, then batch-execute
cat > /tmp/todoist_batch.json << 'EOF'
[
  {"id": "abc123", "due_string": "next Monday"},
  {"id": "def456", "due_string": "next Tuesday"}
]
EOF
python3 scripts/batch.py reschedule /tmp/todoist_batch.json
```

**Batch from stdin (pipe):**
```bash
echo '[{"id":"abc","due_string":"Saturday"},{"id":"def","due_string":"Sunday"}]' | python3 scripts/batch.py reschedule -
```

**Iterative workflow** (fetch → decide → act):
```bash
# 1. Fetch to temp file
python3 scripts/search_tasks.py "overdue" --raw > /tmp/todoist_raw.json
# 2. Process in separate Python (heredoc, reads from file — never pipe script output into heredoc Python)
python3 << 'PYEOF'
import json
with open('/tmp/todoist_raw.json') as f:
    data = json.load(f)
tasks = data.get('results', [])
batch = [{"id": t["id"], "due_string": "tomorrow"} for t in tasks if not t.get("due", {}).get("is_recurring")]
with open('/tmp/plan.json', 'w') as f:
    json.dump(batch, f)
print(f"{len(batch)} tasks to reschedule")
PYEOF
# 3. Execute the batch
python3 scripts/batch.py reschedule /tmp/plan.json
```

**IMPORTANT: When processing script output with custom Python:**
- Save script output to a temp file first, then read the file in a separate `python3 << 'PYEOF'` block
- Never pipe script output directly into a heredoc Python process (stdin conflict)
- Never use `python3 -c "..."` for multi-line code (shell escaping breaks `!=` etc.)

---

## Output Style
- Always display tasks as single-line entries — never multi-line per task
- Keep it easy on the eyes: compact, scannable lists

## Today = Today + Overdue
When fetching today's tasks, use `"today | overdue"` as the filter. Show overdue tasks first under an **Overdue** heading, then today's tasks below.

## Inbox Zero Workflow

### Step 0: Fetch Live State
Before any workflow step:
1. Run `python3 scripts/get_projects.py` to get all projects with IDs
2. Compare against the Project Reference below — flag any new/unknown projects to the user
3. If the live tree differs from the reference, ask the user if they'd like to update the reference in this SKILL.md
4. Cache project name→ID mappings for use throughout the session

### Step 1: Clear Inbox
1. Run `python3 scripts/search_tasks.py "#Inbox"` to get all inbox tasks
2. For each task, determine destination project (ask user if unclear)
3. Move tasks: `python3 scripts/move_task.py TASK_ID --project PROJECT_ID`
4. For bulk moves to the same project, use batch.py with a move JSON

### Step 2: Reschedule Overdue Tasks (Non-Repeat Only)
1. Run `python3 scripts/search_tasks.py "overdue" --raw` to get full JSON
2. Filter out recurring tasks (check if `due.is_recurring` is true in raw output)
3. For each non-recurring overdue task, classify by project and content:
   - **Clearly personal projects** (House, Errands, Calls, Misc) → schedule on upcoming weekend
   - **Clearly work sub-projects** (RAH, Autonoma) → spread across weekdays
   - **Mixed projects** (Computer parent, Waiting_for) → check task content to classify as personal or work; ask user if ambiguous
   - **Repeat_tasks / Reminders** → skip (handled in Step 4)
4. Build a batch JSON and execute: `python3 scripts/batch.py reschedule /tmp/overdue_plan.json`
5. If multiple tasks relate to the same subject, group them and ask user where to place the bucket

### Step 3: Date Undated Tasks
1. Run `python3 scripts/search_tasks.py "no date"` to find undated tasks
2. Present to user and assign dates based on their input
3. Batch reschedule: `python3 scripts/batch.py reschedule /tmp/undated_plan.json`

### Step 4: Report Overdue Repeat Tasks (Inform Only)
1. Run `python3 scripts/search_tasks.py "overdue" --raw`, filter for recurring tasks only
2. Report them to user for awareness
3. **Do NOT modify** unless user explicitly requests changes

---

## Project Reference

### Hierarchy
```
Inbox
Waiting_for (Board)
House
Errands
Computer
  └── RAH          (work: Renewals Action Hub)
  └── Autonoma     (work: Autonoma project)
Calls
Misc (Shared)
The Fold
  └── Repeat_tasks
       └── Reminders
```

### Descriptions

* **Inbox**: Capture everything unprocessed or unclear; only move out when the destination is obvious.
* **Waiting_for (Board)**: Anything blocked on someone else (Sections: Other, AB/RB, Faisal, NA, Delivery). **Mixed personal + work** — classify by task content.
  - AB is Abu Bakr (Farm staff)
  - RB is Rubina (House staff / help)
  - Faisal is the driver (Does tasks like pick up dry cleaning, submit papers at an office etc.)
  - NA Not pending on a person but on an event, or just a note / memo.
  - Delivery - Expecting to receive a package or mail.
* **House**: Home/property tasks that require being at home (closet, clean up papers, organize study, fix a toy, maintenance). Usually personal.
* **Errands**: Tasks that require leaving the house (shopping, pickups, outside appointments). Usually personal.
* **Computer**: Laptop/async focused work (writing, admin, coding, online research). **Mixed personal + work** — classify by task content.
  * **RAH**: Work sub-project — Renewals Action Hub (Klair product work).
  * **Autonoma**: Work sub-project — Autonoma project tasks.
* **Calls**: Anything that must be done live by phone/voice (follow-ups, scheduling). Usually personal.
* **Misc (Shared)**: Shared household/family tasks where someone else can also act. (USUALLY DONT PUT ANYTHING HERE)
* **The Fold**: Parent project (organizational only).
  * **Repeat_tasks**: Only recurring system chores with a clear repeat cadence. Usually personal. (PAINSTAKINGLY ORGANIZED, MOSTLY DONT MESS WITH UNLESS TO record an iteration as done when it is reported as done).
    * **Reminders**: One-off time-based pings that aren't real actionable tasks. (PAINSTAKINGLY ORGANIZED. MOSTLY DONT TOUCH BUT INFORM WHEN DUE. Alter only if specifically requested).

### Classification Guide
Do NOT rely on a hardcoded personal vs work mapping. Instead:
- Tasks in House, Errands, Calls, Misc → almost always personal
- Tasks in RAH, Autonoma → always work
- Tasks in Computer (parent), Waiting_for → **check task content** to determine personal vs work
- When ambiguous, ask the user

## Scheduling Recurring Tasks (Todoist)

Use `--due` with natural language when creating/updating tasks.

### Common Recurrence Patterns

| dueString Example   | Meaning / Result               |
| ------------------- | ------------------------------ |
| `every day`         | Daily                          |
| `every weekday`     | Monday through Friday          |
| `every Monday`      | Weekly on Monday               |
| `every sun`         | Weekly on Sunday               |
| `every 2 weeks`     | Every two weeks (bi-weekly)    |
| `every month`       | Monthly on the same date       |
| `every 23`          | Monthly on the 23rd            |
| `every 4 weeks`     | Every 4 weeks                  |
| `every 6 months`    | Every 6 months (semi-annually) |
| `every 27 Jan`      | Yearly on January 27           |
| `every last friday` | Last Friday of each month      |

## Supporting Files
- [scripts/_client.py](scripts/_client.py) — shared API client (stdlib only, zero deps)
- [scripts/batch.py](scripts/batch.py) — bulk operations (create/update/complete/move/delete/reschedule)
