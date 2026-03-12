#!/usr/bin/env python3
"""Shared writer for Claude Code blackboard hook events."""

from __future__ import annotations

import json
import os
import re
import sqlite3
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from autonoma_runtime import RuntimeConfig, load_runtime_config

SCRIPT_DIR = Path(__file__).resolve().parent
INIT_SCRIPT = SCRIPT_DIR / "init-db.sh"
MAX_TOOL_PAYLOAD_BYTES = 2000
FULL_PAYLOAD_EVENTS = {"SessionStart", "Stop", "SessionEnd", "SubagentStart", "SubagentStop"}
SUPPORTED_EVENTS = {
    "SessionStart",
    "PreToolUse",
    "PostToolUse",
    "PostToolUseFailure",
    "Stop",
    "SessionEnd",
    "SubagentStart",
    "SubagentStop",
}


def connect(config: RuntimeConfig) -> sqlite3.Connection:
    db_path = config.blackboard_path
    db_path.parent.mkdir(parents=True, exist_ok=True)
    if not db_path.exists() and INIT_SCRIPT.exists():
        env = os.environ.copy()
        env["AUTONOMA_HOME"] = str(config.home)
        env["AUTONOMA_CONFIG"] = str(config.config_path)
        env["AUTONOMA_DB_PATH"] = str(db_path)
        subprocess.run(
            ["bash", str(INIT_SCRIPT)],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            env=env,
        )

    conn = sqlite3.connect(db_path, timeout=5)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA busy_timeout=5000")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def to_iso_z(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def now_utc() -> str:
    return to_iso_z(datetime.now(timezone.utc))


def parse_timestamp(raw: Any) -> str | None:
    if not raw or not isinstance(raw, str):
        return None

    raw = raw.strip()
    if not raw:
        return None

    try:
        if raw.endswith("Z"):
            raw = raw[:-1] + "+00:00"
        return to_iso_z(datetime.fromisoformat(raw))
    except ValueError:
        return None


def event_timestamp(data: dict[str, Any]) -> str:
    return (
        parse_timestamp(data.get("timestamp"))
        or parse_timestamp(data.get("event_timestamp"))
        or parse_timestamp(data.get("ts"))
        or now_utc()
    )


def text_or_none(value: Any) -> str | None:
    return value if isinstance(value, str) and value.strip() else None


def derive_project(cwd: str | None) -> tuple[str, str]:
    if not cwd:
        return "unknown", "unknown"

    label = os.path.basename(cwd) or cwd
    remote_url = _get_git_remote(cwd)
    if remote_url:
        return _normalize_remote(remote_url), label
    return label, label


def _get_git_remote(cwd: str) -> str | None:
    try:
        url = subprocess.check_output(
            ["git", "-C", cwd, "remote", "get-url", "origin"],
            stderr=subprocess.DEVNULL,
            timeout=5,
        ).decode().strip()
        if url:
            return url
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, FileNotFoundError):
        pass

    try:
        remotes = (
            subprocess.check_output(
                ["git", "-C", cwd, "remote"],
                stderr=subprocess.DEVNULL,
                timeout=5,
            )
            .decode()
            .strip()
            .splitlines()
        )
        if remotes:
            url = subprocess.check_output(
                ["git", "-C", cwd, "remote", "get-url", remotes[0]],
                stderr=subprocess.DEVNULL,
                timeout=5,
            ).decode().strip()
            if url:
                return url
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, FileNotFoundError):
        pass

    return None


def _normalize_remote(url: str) -> str:
    url = url.strip()
    match = re.match(r"ssh://[^@]*@([^:/]+)(?::\d+)?/(.+?)(?:\.git)?$", url)
    if match:
        return f"{match.group(1)}/{match.group(2)}"

    match = re.match(r"[^@]*@([^:]+):(.+?)(?:\.git)?$", url)
    if match:
        return f"{match.group(1)}/{match.group(2)}"

    match = re.match(r"https?://(?:[^@]+@)?([^/]+)/(.+?)(?:\.git)?$", url)
    if match:
        return f"{match.group(1)}/{match.group(2)}"

    return url.removesuffix(".git")


def read_launch_metadata() -> dict[str, Any]:
    if os.environ.get("AUTONOMA_AGENT_MANAGED") != "1":
        return {}

    return {
        "agent_managed": True,
        "launch_id": text_or_none(os.environ.get("AUTONOMA_LAUNCH_ID")),
        "tmux_session": text_or_none(os.environ.get("AUTONOMA_TMUX_SESSION")),
        "task_description": text_or_none(os.environ.get("AUTONOMA_TASK_DESCRIPTION")),
        "todoist_task_id": text_or_none(os.environ.get("AUTONOMA_TODOIST_TASK_ID")),
    }


def serialize_payload(event_name: str, data: dict[str, Any]) -> str:
    raw = json.dumps(data, separators=(",", ":"), ensure_ascii=False)
    if event_name in FULL_PAYLOAD_EVENTS or len(raw.encode("utf-8")) <= MAX_TOOL_PAYLOAD_BYTES:
        return raw

    return json.dumps(
        {
            "truncated": True,
            "originalBytes": len(raw.encode("utf-8")),
            "preview": raw[:MAX_TOOL_PAYLOAD_BYTES],
        },
        separators=(",", ":"),
        ensure_ascii=False,
    )


def require_session_id(data: dict[str, Any]) -> str:
    session_id = data.get("session_id")
    if not isinstance(session_id, str) or not session_id.strip():
        raise ValueError("bb-write: missing session_id in payload")
    return session_id


def ensure_session_stub(conn: sqlite3.Connection, data: dict[str, Any], ts: str) -> str:
    session_id = require_session_id(data)
    cwd = text_or_none(data.get("cwd")) or "."
    project, project_label = derive_project(cwd)

    conn.execute(
        """
        INSERT OR IGNORE INTO sessions (
            session_id,
            cwd,
            project,
            project_label,
            status,
            started_at,
            last_event_at
        ) VALUES (?, ?, ?, ?, 'working', ?, ?)
        """,
        (session_id, cwd, project, project_label, ts, ts),
    )

    return session_id


def insert_event(
    conn: sqlite3.Connection, session_id: str, event_name: str, ts: str, data: dict[str, Any]
) -> None:
    conn.execute(
        """
        INSERT INTO events (session_id, event_name, tool_name, tool_use_id, timestamp, payload)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            session_id,
            event_name,
            text_or_none(data.get("tool_name")),
            text_or_none(data.get("tool_use_id")),
            ts,
            serialize_payload(event_name, data),
        ),
    )


def handle_session_start(conn: sqlite3.Connection, data: dict[str, Any], ts: str) -> None:
    session_id = require_session_id(data)
    cwd = text_or_none(data.get("cwd")) or "."
    project, project_label = derive_project(cwd)
    launch = read_launch_metadata()

    conn.execute(
        """
        INSERT INTO sessions (
            session_id,
            launch_id,
            tmux_session,
            cwd,
            project,
            project_label,
            model,
            permission_mode,
            source,
            status,
            transcript_path,
            task_description,
            todoist_task_id,
            agent_managed,
            started_at,
            last_event_at,
            last_tool_started_at,
            ended_at,
            session_end_reason
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'working', ?, ?, ?, ?, ?, ?, NULL, NULL, NULL)
        ON CONFLICT(session_id) DO UPDATE SET
            launch_id = COALESCE(excluded.launch_id, sessions.launch_id),
            tmux_session = COALESCE(excluded.tmux_session, sessions.tmux_session),
            cwd = excluded.cwd,
            project = excluded.project,
            project_label = excluded.project_label,
            model = COALESCE(excluded.model, sessions.model),
            permission_mode = COALESCE(excluded.permission_mode, sessions.permission_mode),
            source = COALESCE(excluded.source, sessions.source),
            status = CASE WHEN excluded.last_event_at >= sessions.last_event_at THEN 'working' ELSE sessions.status END,
            transcript_path = COALESCE(excluded.transcript_path, sessions.transcript_path),
            task_description = COALESCE(excluded.task_description, sessions.task_description),
            todoist_task_id = COALESCE(excluded.todoist_task_id, sessions.todoist_task_id),
            agent_managed = CASE
              WHEN excluded.agent_managed IS NOT NULL THEN excluded.agent_managed
              ELSE sessions.agent_managed
            END,
            ended_at = CASE WHEN excluded.last_event_at >= sessions.last_event_at THEN NULL ELSE sessions.ended_at END,
            session_end_reason = CASE
              WHEN excluded.last_event_at >= sessions.last_event_at THEN NULL
              ELSE sessions.session_end_reason
            END,
            started_at = CASE
              WHEN sessions.source IS NULL AND sessions.transcript_path IS NULL THEN excluded.started_at
              ELSE MIN(sessions.started_at, excluded.started_at)
            END,
            last_event_at = MAX(sessions.last_event_at, excluded.last_event_at)
        """,
        (
            session_id,
            launch.get("launch_id"),
            launch.get("tmux_session"),
            cwd,
            project,
            project_label,
            text_or_none(data.get("model")),
            text_or_none(data.get("permission_mode")),
            text_or_none(data.get("source")),
            text_or_none(data.get("transcript_path")),
            launch.get("task_description"),
            launch.get("todoist_task_id"),
            1 if launch.get("agent_managed") else 0,
            ts,
            ts,
        ),
    )

    insert_event(conn, session_id, "SessionStart", ts, data)


def handle_pre_tool_use(conn: sqlite3.Connection, data: dict[str, Any], ts: str) -> None:
    session_id = ensure_session_stub(conn, data, ts)
    conn.execute(
        """
        UPDATE sessions
        SET last_event_at = MAX(last_event_at, ?),
            last_tool_started_at = CASE
              WHEN status != 'ended' AND ? >= last_event_at THEN ?
              ELSE last_tool_started_at
            END,
            status = CASE
              WHEN status = 'ended' THEN status
              WHEN ? >= last_event_at THEN 'working'
              ELSE status
            END
        WHERE session_id = ?
        """,
        (ts, ts, ts, ts, session_id),
    )
    insert_event(conn, session_id, "PreToolUse", ts, data)


def handle_post_tool_event(
    conn: sqlite3.Connection, data: dict[str, Any], ts: str, event_name: str
) -> None:
    session_id = ensure_session_stub(conn, data, ts)
    conn.execute(
        """
        UPDATE sessions
        SET last_event_at = MAX(last_event_at, ?),
            last_tool_started_at = CASE
              WHEN last_tool_started_at IS NOT NULL AND ? >= last_tool_started_at THEN NULL
              ELSE last_tool_started_at
            END
        WHERE session_id = ?
        """,
        (ts, ts, session_id),
    )
    insert_event(conn, session_id, event_name, ts, data)


def handle_stop(conn: sqlite3.Connection, data: dict[str, Any], ts: str) -> None:
    session_id = ensure_session_stub(conn, data, ts)
    conn.execute(
        """
        UPDATE sessions
        SET last_event_at = MAX(last_event_at, ?),
            status = CASE
              WHEN status = 'ended' THEN status
              WHEN ? >= last_event_at THEN 'idle'
              ELSE status
            END
        WHERE session_id = ?
        """,
        (ts, ts, session_id),
    )
    insert_event(conn, session_id, "Stop", ts, data)


def handle_session_end(conn: sqlite3.Connection, data: dict[str, Any], ts: str) -> None:
    session_id = ensure_session_stub(conn, data, ts)
    conn.execute(
        """
        UPDATE sessions
        SET last_event_at = MAX(last_event_at, ?),
            last_tool_started_at = CASE
              WHEN ? >= last_event_at THEN NULL
              ELSE last_tool_started_at
            END,
            ended_at = CASE
              WHEN ? >= last_event_at THEN ?
              ELSE ended_at
            END,
            session_end_reason = CASE
              WHEN ? >= last_event_at THEN COALESCE(?, session_end_reason)
              ELSE session_end_reason
            END,
            status = CASE
              WHEN ? >= last_event_at THEN 'ended'
              ELSE status
            END
        WHERE session_id = ?
        """,
        (ts, ts, ts, ts, ts, text_or_none(data.get("reason")), ts, session_id),
    )
    insert_event(conn, session_id, "SessionEnd", ts, data)


def handle_subagent_event(
    conn: sqlite3.Connection, data: dict[str, Any], ts: str, event_name: str
) -> None:
    session_id = ensure_session_stub(conn, data, ts)
    conn.execute(
        "UPDATE sessions SET last_event_at = MAX(last_event_at, ?) WHERE session_id = ?",
        (ts, session_id),
    )
    insert_event(conn, session_id, event_name, ts, data)


def write_event(data: dict[str, Any], config: RuntimeConfig | None = None) -> None:
    event_name = data.get("hook_event_name") or data.get("event_name")
    if event_name not in SUPPORTED_EVENTS:
        raise ValueError(f"bb-write: unsupported event '{event_name}'")

    cfg = config or load_runtime_config()
    ts = event_timestamp(data)
    conn = connect(cfg)
    try:
        conn.execute("BEGIN IMMEDIATE")
        if event_name == "SessionStart":
            handle_session_start(conn, data, ts)
        elif event_name == "PreToolUse":
            handle_pre_tool_use(conn, data, ts)
        elif event_name in {"PostToolUse", "PostToolUseFailure"}:
            handle_post_tool_event(conn, data, ts, event_name)
        elif event_name == "Stop":
            handle_stop(conn, data, ts)
        elif event_name == "SessionEnd":
            handle_session_end(conn, data, ts)
        elif event_name in {"SubagentStart", "SubagentStop"}:
            handle_subagent_event(conn, data, ts, event_name)
        conn.commit()
    finally:
        conn.close()


def main() -> int:
    raw = sys.stdin.read()
    if not raw.strip():
        return 0

    data = json.loads(raw)
    if not isinstance(data, dict):
        raise ValueError("bb-write: hook payload must be a JSON object")

    write_event(data)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
