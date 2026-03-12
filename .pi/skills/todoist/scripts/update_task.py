#!/usr/bin/env python3
"""Update an existing task.
Usage: update_task.py <task_id> [options]
  --content TEXT     New task content
  --description TEXT New description
  --priority N       1=highest, 4=lowest
  --due STRING       Due date in natural language
  --due-date DATE    Due date as YYYY-MM-DD
  --deadline DATE    Deadline as YYYY-MM-DD
  --label NAME       Label (repeatable; replaces all labels)
  --clear-due        Remove the due date
"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
import _client as api

if len(sys.argv) < 3:
    print(__doc__, file=sys.stderr)
    sys.exit(1)

task_id = sys.argv[1]
body = {}
labels = []
args = sys.argv[2:]
i = 0
while i < len(args):
    a = args[i]
    if a == "--content":
        body["content"] = args[i + 1]; i += 2
    elif a == "--description":
        body["description"] = args[i + 1]; i += 2
    elif a == "--priority":
        body["priority"] = api.user_to_api_priority(int(args[i + 1])); i += 2
    elif a == "--due":
        body["due_string"] = args[i + 1]; i += 2
    elif a == "--due-date":
        body["due_date"] = args[i + 1]; i += 2
    elif a == "--deadline":
        body["deadline_date"] = args[i + 1]; i += 2
    elif a == "--clear-due":
        body["due_string"] = "no date"; i += 1
    elif a == "--label":
        labels.append(args[i + 1]); i += 2
    else:
        print(f"Unknown option: {a}", file=sys.stderr); sys.exit(1)

if labels:
    body["labels"] = labels

api.pp(api.post(f"/tasks/{task_id}", body))
