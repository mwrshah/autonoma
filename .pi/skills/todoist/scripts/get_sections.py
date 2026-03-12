#!/usr/bin/env python3
"""Get sections for a project.  Usage: get_sections.py <project_id> [--raw]"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
import _client as api

if len(sys.argv) < 2:
    print("Usage: get_sections.py <project_id> [--raw]", file=sys.stderr)
    sys.exit(1)

raw = "--raw" in sys.argv
data = api.get("/sections", project_id=sys.argv[1])

if raw:
    api.pp(data)
else:
    items = data.get("results", []) if isinstance(data, dict) else [data]
    for s in items:
        print(f"[{s['id']}] {s['name']}")
