#!/usr/bin/env python3
"""Move a task to a different project/section/parent.
Usage: move_task.py <task_id> [--project ID] [--section ID] [--parent ID]
"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
import _client as api

if len(sys.argv) < 3:
    print(__doc__, file=sys.stderr)
    sys.exit(1)

task_id = sys.argv[1]
body = {}
args = sys.argv[2:]
i = 0
while i < len(args):
    if args[i] == "--project":
        body["project_id"] = args[i + 1]; i += 2
    elif args[i] == "--section":
        body["section_id"] = args[i + 1]; i += 2
    elif args[i] == "--parent":
        body["parent_id"] = args[i + 1]; i += 2
    else:
        print(f"Unknown option: {args[i]}", file=sys.stderr); sys.exit(1)

api.pp(api.post(f"/tasks/{task_id}/move", body))
