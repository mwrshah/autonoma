#!/usr/bin/env python3
"""Quick-add a task using natural language (like Todoist quick-add bar).
Usage: quick_add.py "Buy milk tomorrow #Errands p2"
"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
import _client as api

if len(sys.argv) < 2:
    print(__doc__, file=sys.stderr)
    sys.exit(1)

api.pp(api.post("/tasks/quick", {"text": sys.argv[1]}))
