#!/usr/bin/env python3
"""Batch operations on tasks from a JSON file or stdin.

Usage:
  batch.py <action> <json_file>
  cat tasks.json | batch.py <action> -

Actions:
  create    -- Create tasks from JSON array
  update    -- Update tasks from JSON array (each must have "id")
  complete  -- Complete tasks from JSON array of IDs (strings) or objects with "id"
  move      -- Move tasks from JSON array (each must have "id" + "project_id"/"section_id"/"parent_id")
  delete    -- Delete tasks from JSON array of IDs (strings) or objects with "id"
  reschedule -- Reschedule tasks from JSON array (each must have "id" + "due_string" or "due_date")

JSON format examples:

  create:
    [
      {"content": "Buy milk", "due_string": "tomorrow", "project_id": "abc123"},
      {"content": "Call dentist", "due_string": "next Monday", "priority": 2}
    ]

  update / reschedule:
    [
      {"id": "abc123", "due_string": "next Friday"},
      {"id": "def456", "due_string": "Saturday", "priority": 1}
    ]

  complete / delete:
    ["abc123", "def456"]
    OR
    [{"id": "abc123"}, {"id": "def456"}]

  move:
    [
      {"id": "abc123", "project_id": "proj1"},
      {"id": "def456", "section_id": "sec2"}
    ]
"""
import json
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import _client as api

ACTIONS = ("create", "update", "complete", "move", "delete", "reschedule")


def load_input(path: str) -> list:
    if path == "-":
        data = json.load(sys.stdin)
    else:
        with open(path) as f:
            data = json.load(f)
    if not isinstance(data, list):
        print("Error: JSON input must be a top-level array", file=sys.stderr)
        sys.exit(1)
    return data


def extract_id(item) -> str:
    if isinstance(item, str):
        return item
    if isinstance(item, dict) and "id" in item:
        return item["id"]
    print(f"Error: cannot extract task ID from: {item}", file=sys.stderr)
    sys.exit(1)


def _map_priority(task: dict) -> None:
    """Convert user-facing priority in a task dict to API priority in-place."""
    if "priority" in task:
        task["priority"] = api.user_to_api_priority(task["priority"])


def do_create(items: list):
    for i, task in enumerate(items):
        _map_priority(task)
        result = api.post("/tasks", task)
        name = task.get("content", "?")
        tid = result["id"] if result else "?"
        print(f"[{i+1}/{len(items)}] Created: {name} -> {tid}")


def do_update(items: list):
    for i, task in enumerate(items):
        _map_priority(task)
        tid = task.pop("id")
        result = api.post(f"/tasks/{tid}", task)
        print(f"[{i+1}/{len(items)}] Updated: {tid}")


def do_complete(items: list):
    for i, item in enumerate(items):
        tid = extract_id(item)
        api.post(f"/tasks/{tid}/close")
        print(f"[{i+1}/{len(items)}] Closed: {tid}")


def do_move(items: list):
    for i, task in enumerate(items):
        tid = task.pop("id")
        api.post(f"/tasks/{tid}/move", task)
        print(f"[{i+1}/{len(items)}] Moved: {tid}")


def do_delete(items: list):
    for i, item in enumerate(items):
        tid = extract_id(item)
        api.delete(f"/tasks/{tid}")
        print(f"[{i+1}/{len(items)}] Deleted: {tid}")


def do_reschedule(items: list):
    for i, task in enumerate(items):
        _map_priority(task)
        tid = task.pop("id")
        api.post(f"/tasks/{tid}", task)
        due = task.get("due_string") or task.get("due_date") or "?"
        print(f"[{i+1}/{len(items)}] Rescheduled: {tid} -> {due}")


def main():
    if len(sys.argv) < 3 or sys.argv[1] not in ACTIONS:
        print(__doc__, file=sys.stderr)
        print(f"Available actions: {', '.join(ACTIONS)}", file=sys.stderr)
        sys.exit(1)

    action = sys.argv[1]
    items = load_input(sys.argv[2])
    print(f"Running {action} on {len(items)} tasks...")

    handler = {
        "create": do_create,
        "update": do_update,
        "complete": do_complete,
        "move": do_move,
        "delete": do_delete,
        "reschedule": do_reschedule,
    }[action]

    handler(items)
    print("Done.")


if __name__ == "__main__":
    main()
