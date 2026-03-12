#!/usr/bin/env python3
"""Complete (close) one or more tasks.  Usage: complete_task.py <task_id> [task_id2 ...]"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
import _client as api

if len(sys.argv) < 2:
    print("Usage: complete_task.py <task_id> [task_id2 ...]", file=sys.stderr)
    sys.exit(1)

for tid in sys.argv[1:]:
    api.post(f"/tasks/{tid}/close")
    print(f"Closed task {tid}")
