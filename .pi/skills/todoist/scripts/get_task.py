#!/usr/bin/env python3
"""Get a single task by ID.  Usage: get_task.py <task_id>"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
import _client as api

if len(sys.argv) < 2:
    print("Usage: get_task.py <task_id>", file=sys.stderr)
    sys.exit(1)

api.pp(api.get(f"/tasks/{sys.argv[1]}"))
