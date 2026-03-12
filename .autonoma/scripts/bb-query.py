#!/usr/bin/env python3
"""bb-query.py — Query helper for the configured Autonoma blackboard.

Usage:
    bb-query.py working
    bb-query.py idle
    bb-query.py stale
    bb-query.py ended [limit]
    bb-query.py project <name>
    bb-query.py session <session_id>
    bb-query.py events <session_id> [limit]
    bb-query.py recent-events [limit]
    bb-query.py stale-candidates
    bb-query.py mark-stale
    bb-query.py idle-cleanup-candidates [hours]
    bb-query.py active-pi
    bb-query.py pending-actions [limit]
    bb-query.py pending-messages [limit]

Legacy aliases:
    running -> working
    stalled -> stale-candidates
    boot-stale -> idle-cleanup-candidates 24
"""
import json
import sqlite3
import subprocess
import sys

from autonoma_runtime import load_runtime_config, runtime_config_path

CONFIG_PATH = runtime_config_path()
DEFAULTS = {
    "stallMinutes": 15,
    "toolTimeoutMinutes": 60,
}


def load_config():
    config = dict(DEFAULTS)
    if CONFIG_PATH.exists():
        try:
            loaded = json.loads(CONFIG_PATH.read_text())
            if isinstance(loaded, dict):
                for key in DEFAULTS:
                    value = loaded.get(key)
                    if isinstance(value, int) and value > 0:
                        config[key] = value
        except json.JSONDecodeError:
            pass
    return config


CONFIG = load_config()
RUNTIME_CONFIG = load_runtime_config()
DB_PATH = str(RUNTIME_CONFIG.blackboard_path)


def connect():
    conn = sqlite3.connect(DB_PATH, timeout=5)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA busy_timeout=5000")
    return conn


def print_json(data):
    print(json.dumps(data, indent=2, default=str))


def rows_to_dicts(rows):
    return [dict(row) for row in rows]


def cmd_status(conn, status, limit=None):
    sql = "SELECT * FROM sessions WHERE status = ? ORDER BY last_event_at DESC"
    params = [status]
    if limit is not None:
        sql += " LIMIT ?"
        params.append(limit)
    rows = conn.execute(sql, params).fetchall()
    print_json(rows_to_dicts(rows))


def cmd_project(conn, name):
    rows = conn.execute(
        "SELECT * FROM sessions WHERE project LIKE ? ORDER BY last_event_at DESC",
        (f"%{name}%",),
    ).fetchall()
    print_json(rows_to_dicts(rows))


def cmd_session(conn, session_id):
    row = conn.execute("SELECT * FROM sessions WHERE session_id = ?", (session_id,)).fetchone()
    if not row:
        print_json({"error": "session not found", "session_id": session_id})
        return

    result = dict(row)
    events = conn.execute(
        "SELECT * FROM events WHERE session_id = ? ORDER BY timestamp DESC LIMIT 20",
        (session_id,),
    ).fetchall()
    result["recent_events"] = rows_to_dicts(events)
    print_json(result)


def cmd_events(conn, session_id, limit):
    rows = conn.execute(
        "SELECT * FROM events WHERE session_id = ? ORDER BY timestamp DESC LIMIT ?",
        (session_id, limit),
    ).fetchall()
    print_json(rows_to_dicts(rows))


def cmd_recent_events(conn, limit):
    rows = conn.execute(
        "SELECT * FROM events ORDER BY timestamp DESC LIMIT ?",
        (limit,),
    ).fetchall()
    print_json(rows_to_dicts(rows))


def stale_where_clause():
    return """
        status = 'working'
        AND datetime(last_event_at) <= datetime('now', '-' || ? || ' minutes')
        AND (
            last_tool_started_at IS NULL
            OR datetime(last_tool_started_at) <= datetime('now', '-' || ? || ' minutes')
        )
    """


def stale_params():
    return (CONFIG["stallMinutes"], CONFIG["toolTimeoutMinutes"])


def cmd_stale_candidates(conn):
    rows = conn.execute(
        f"SELECT * FROM sessions WHERE {stale_where_clause()} ORDER BY last_event_at ASC",
        stale_params(),
    ).fetchall()
    print_json(rows_to_dicts(rows))


def cmd_mark_stale(conn):
    cursor = conn.execute(
        f"UPDATE sessions SET status = 'stale' WHERE {stale_where_clause()}",
        stale_params(),
    )
    conn.commit()
    print_json({"ok": True, "updated": cursor.rowcount})


def cmd_idle_cleanup_candidates(conn, hours):
    rows = conn.execute(
        """
        SELECT * FROM sessions
        WHERE status IN ('working', 'stale')
          AND datetime(last_event_at) <= datetime('now', '-' || ? || ' hours')
        ORDER BY last_event_at ASC
        """,
        (hours,),
    ).fetchall()
    print_json(rows_to_dicts(rows))


def cmd_active_pi(conn):
    rows = conn.execute(
        "SELECT * FROM pi_sessions WHERE status IN ('active', 'idle') ORDER BY last_event_at DESC"
    ).fetchall()
    print_json(rows_to_dicts(rows))


def cmd_pending_actions(conn, limit):
    rows = conn.execute(
        "SELECT * FROM pending_actions WHERE status = 'pending' ORDER BY created_at ASC LIMIT ?",
        (limit,),
    ).fetchall()
    print_json(rows_to_dicts(rows))


def cmd_pending_messages(conn, limit):
    rows = conn.execute(
        "SELECT * FROM whatsapp_messages WHERE status = 'pending' ORDER BY created_at ASC LIMIT ?",
        (limit,),
    ).fetchall()
    print_json(rows_to_dicts(rows))


def cmd_crash_candidates(conn):
    rows = conn.execute(
        "SELECT * FROM sessions WHERE status IN ('working', 'stale') AND tmux_session IS NOT NULL"
    ).fetchall()

    try:
        tmux_out = subprocess.check_output(
            ["tmux", "list-sessions", "-F", "#{session_name}"],
            stderr=subprocess.DEVNULL,
            timeout=5,
        ).decode().strip().splitlines()
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, FileNotFoundError):
        tmux_out = []

    live_tmux = set(tmux_out)
    candidates = [dict(row) for row in rows if row["tmux_session"] and row["tmux_session"] not in live_tmux]
    print_json(candidates)


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    cmd = sys.argv[1]
    aliases = {
        "running": "working",
        "stalled": "stale-candidates",
        "boot-stale": "idle-cleanup-candidates",
    }
    cmd = aliases.get(cmd, cmd)

    conn = connect()
    try:
        if cmd in {"working", "idle", "stale"}:
            cmd_status(conn, cmd)
        elif cmd == "ended":
            limit = int(sys.argv[2]) if len(sys.argv) >= 3 else 50
            cmd_status(conn, "ended", limit)
        elif cmd == "project" and len(sys.argv) >= 3:
            cmd_project(conn, sys.argv[2])
        elif cmd == "session" and len(sys.argv) >= 3:
            cmd_session(conn, sys.argv[2])
        elif cmd == "events" and len(sys.argv) >= 3:
            limit = int(sys.argv[3]) if len(sys.argv) >= 4 else 50
            cmd_events(conn, sys.argv[2], limit)
        elif cmd == "recent-events":
            limit = int(sys.argv[2]) if len(sys.argv) >= 3 else 50
            cmd_recent_events(conn, limit)
        elif cmd == "stale-candidates":
            cmd_stale_candidates(conn)
        elif cmd == "mark-stale":
            cmd_mark_stale(conn)
        elif cmd == "idle-cleanup-candidates":
            hours = int(sys.argv[2]) if len(sys.argv) >= 3 else 24
            cmd_idle_cleanup_candidates(conn, hours)
        elif cmd == "active-pi":
            cmd_active_pi(conn)
        elif cmd == "pending-actions":
            limit = int(sys.argv[2]) if len(sys.argv) >= 3 else 50
            cmd_pending_actions(conn, limit)
        elif cmd == "pending-messages":
            limit = int(sys.argv[2]) if len(sys.argv) >= 3 else 50
            cmd_pending_messages(conn, limit)
        elif cmd == "crash-candidates":
            cmd_crash_candidates(conn)
        else:
            print(__doc__)
            sys.exit(1)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
