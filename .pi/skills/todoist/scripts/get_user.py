#!/usr/bin/env python3
"""Get current user info.  Usage: get_user.py"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
import _client as api

api.pp(api.get("/user"))
