#!/usr/bin/env python3
"""Delete a task permanently.  Usage: delete_task.py <task_id>"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
import _client as api

if len(sys.argv) < 2:
    print("Usage: delete_task.py <task_id>", file=sys.stderr)
    sys.exit(1)

api.delete(f"/tasks/{sys.argv[1]}")
print(f"Deleted task {sys.argv[1]}")
