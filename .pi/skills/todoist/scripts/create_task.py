#!/usr/bin/env python3
"""Create a new task.
Usage: create_task.py <content> [options]
  --project ID       Project ID
  --section ID       Section ID
  --parent ID        Parent task ID
  --priority N       1=highest, 4=lowest (default)
  --due STRING       Due date in natural language ("tomorrow", "next Monday")
  --due-date DATE    Due date as YYYY-MM-DD
  --deadline DATE    Deadline as YYYY-MM-DD
  --label NAME       Label (repeatable)
  --description TEXT Description
"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
import _client as api

if len(sys.argv) < 2:
    print(__doc__, file=sys.stderr)
    sys.exit(1)

body = {"content": sys.argv[1]}
labels = []
args = sys.argv[2:]
i = 0
while i < len(args):
    a = args[i]
    if a == "--project":
        body["project_id"] = args[i + 1]; i += 2
    elif a == "--section":
        body["section_id"] = args[i + 1]; i += 2
    elif a == "--parent":
        body["parent_id"] = args[i + 1]; i += 2
    elif a == "--priority":
        body["priority"] = api.user_to_api_priority(int(args[i + 1])); i += 2
    elif a == "--due":
        body["due_string"] = args[i + 1]; i += 2
    elif a == "--due-date":
        body["due_date"] = args[i + 1]; i += 2
    elif a == "--deadline":
        body["deadline_date"] = args[i + 1]; i += 2
    elif a == "--description":
        body["description"] = args[i + 1]; i += 2
    elif a == "--label":
        labels.append(args[i + 1]); i += 2
    else:
        print(f"Unknown option: {a}", file=sys.stderr); sys.exit(1)

if labels:
    body["labels"] = labels

api.pp(api.post("/tasks", body))
