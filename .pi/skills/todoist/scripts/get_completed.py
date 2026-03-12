#!/usr/bin/env python3
"""Get completed tasks by completion date.
Usage: get_completed.py [--since YYYY-MM-DD] [--until YYYY-MM-DD] [--project ID] [--limit N] [--raw]
"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
import _client as api

args = sys.argv[1:]
raw = "--raw" in args
if raw:
    args.remove("--raw")

params = {}
i = 0
while i < len(args):
    if args[i] == "--since":
        params["since"] = args[i + 1]; i += 2
    elif args[i] == "--until":
        params["until"] = args[i + 1]; i += 2
    elif args[i] == "--project":
        params["project_id"] = args[i + 1]; i += 2
    elif args[i] == "--limit":
        params["limit"] = args[i + 1]; i += 2
    else:
        print(f"Unknown option: {args[i]}", file=sys.stderr); sys.exit(1)

data = api.get("/tasks/completed/by_completion_date", **params)

if raw:
    api.pp(data)
else:
    items = data.get("results", []) if isinstance(data, dict) else [data]
    for t in items:
        print(f"[{t['id']}] {t['content']} | completed: {t.get('completed_at', '?')}")
