#!/usr/bin/env python3
"""List all projects.  Usage: get_projects.py [--raw]"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
import _client as api

raw = "--raw" in sys.argv
data = api.get("/projects", limit=200)
api.print_projects(data, raw=raw)
