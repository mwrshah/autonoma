#!/usr/bin/env python3
"""Get tasks with optional filters.
Usage: get_tasks.py [--project ID] [--section ID] [--label NAME] [--limit N] [--raw]
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
    if args[i] == "--project":
        params["project_id"] = args[i + 1]; i += 2
    elif args[i] == "--section":
        params["section_id"] = args[i + 1]; i += 2
    elif args[i] == "--label":
        params["label"] = args[i + 1]; i += 2
    elif args[i] == "--limit":
        params["limit"] = args[i + 1]; i += 2
    else:
        print(f"Unknown option: {args[i]}", file=sys.stderr); sys.exit(1)

data = api.get("/tasks", **params)
api.print_tasks(data, raw=raw)
