"""Shared Todoist API v1 client. All scripts import from here."""

import json
import os
import sys
import urllib.request
import urllib.parse
import urllib.error

API = "https://api.todoist.com/api/v1"
TOKEN = os.environ.get("TODOIST_API_KEY", "")

if not TOKEN:
    print("Error: TODOIST_API_KEY environment variable is not set", file=sys.stderr)
    sys.exit(1)

HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json",
}


def _request(method: str, path: str, params: dict | None = None, body: dict | None = None) -> dict | list | None:
    url = f"{API}{path}"
    if params:
        filtered = {k: v for k, v in params.items() if v is not None}
        if filtered:
            url += "?" + urllib.parse.urlencode(filtered)

    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, headers=HEADERS, method=method)

    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode()
            if not content or content.strip() == "null":
                return None
            return json.loads(content)
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"HTTP {e.code}: {error_body}", file=sys.stderr)
        sys.exit(1)


def get(path: str, **params):
    return _request("GET", path, params=params)


def post(path: str, body: dict | None = None):
    return _request("POST", path, body=body or {})


def delete(path: str):
    return _request("DELETE", path)


def pp(obj):
    """Pretty-print a JSON object."""
    if obj is None:
        return
    print(json.dumps(obj, indent=2, ensure_ascii=False))


def user_to_api_priority(p: int) -> int:
    """Convert user-facing priority (1=highest/P1, 4=lowest/P4) to API value.

    Todoist API uses inverted priority: 4=urgent(P1), 1=normal(P4).
    """
    if p < 1 or p > 4:
        print(f"Error: priority must be 1-4, got {p}", file=sys.stderr)
        sys.exit(1)
    return 5 - p


def fmt_task(t: dict) -> str:
    """Format a task as a single compact line."""
    parts = [f"[{t['id']}] {t['content']}"]
    due = t.get("due")
    if due:
        parts.append(f"due: {due.get('date', due.get('string', '?'))}")
    # API priority is inverted: 4=P1(highest), 1=P4(lowest). Convert for display.
    api_p = t.get("priority", 1)
    user_p = 5 - api_p  # 4→1(P1), 3→2(P2), 2→3(P3), 1→4(P4)
    if user_p < 4:
        parts.append(f"p{user_p}")
    labels = t.get("labels", [])
    if labels:
        parts.append("@" + ",".join(labels))
    return " | ".join(parts)


def fmt_project(p: dict) -> str:
    """Format a project as a single compact line."""
    line = f"[{p['id']}] {p['name']}"
    if p.get("parent_id"):
        line += f" (child of {p['parent_id']})"
    if p.get("is_favorite"):
        line += " *"
    return line


def print_tasks(data, raw=False):
    if raw:
        pp(data)
        return
    items = data.get("results", []) if isinstance(data, dict) else [data]
    for t in items:
        print(fmt_task(t))


def print_projects(data, raw=False):
    if raw:
        pp(data)
        return
    items = data.get("results", []) if isinstance(data, dict) else [data]
    for p in items:
        print(fmt_project(p))
