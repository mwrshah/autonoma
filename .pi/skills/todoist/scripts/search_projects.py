#!/usr/bin/env python3
"""Search projects by name.  Usage: search_projects.py <query> [--raw]"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
import _client as api

if len(sys.argv) < 2:
    print("Usage: search_projects.py <query> [--raw]", file=sys.stderr)
    sys.exit(1)

query = sys.argv[1]
raw = "--raw" in sys.argv
data = api.get("/projects/search", query=query)
api.print_projects(data, raw=raw)
