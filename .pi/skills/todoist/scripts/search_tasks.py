#!/usr/bin/env python3
"""Search tasks using Todoist filter syntax.
Usage: search_tasks.py <filter_query> [--raw]
Examples:
  search_tasks.py "overdue"
  search_tasks.py "today"
  search_tasks.py "due before: next week"
  search_tasks.py "#Inbox"
  search_tasks.py "search: buy groceries"
"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
import _client as api

if len(sys.argv) < 2:
    print(__doc__, file=sys.stderr)
    sys.exit(1)

query = sys.argv[1]
raw = "--raw" in sys.argv
data = api.get("/tasks/filter", query=query, limit=200)
api.print_tasks(data, raw=raw)
