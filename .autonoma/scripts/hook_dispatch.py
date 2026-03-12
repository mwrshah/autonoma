#!/usr/bin/env python3
"""Dispatch Claude Code hooks without shell buffering."""

from __future__ import annotations

import json
import socket
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

from autonoma_runtime import (
    RuntimeConfig,
    append_log,
    ensure_runtime_dirs,
    is_pid_running,
    load_runtime_config,
    read_pid,
)
from bb_write import write_event

HOOK_LOG_NAME = "hooks.log"
HOOK_ERROR_LOG_NAME = "hooks-errors.log"
POST_TIMEOUT_SECONDS = 2


def error_log_path(config: RuntimeConfig) -> Path:
    return config.log_dir / HOOK_ERROR_LOG_NAME


def hook_log_path(config: RuntimeConfig) -> Path:
    return config.log_dir / HOOK_LOG_NAME


def parse_args(argv: list[str]) -> tuple[str, str] | None:
    event_name = argv[1] if len(argv) > 1 else ""
    event_slug = argv[2] if len(argv) > 2 else ""
    if not event_name or not event_slug:
        return None
    return event_name, event_slug


def read_payload() -> tuple[bytes, dict[str, Any]] | None:
    raw = sys.stdin.buffer.read()
    if not raw.strip():
        return None

    data = json.loads(raw)
    if not isinstance(data, dict):
        raise ValueError("hook-dispatch: hook payload must be a JSON object")
    return raw, data


def session_id_from_payload(payload: dict[str, Any]) -> str:
    session_id = payload.get("session_id")
    return session_id.strip() if isinstance(session_id, str) and session_id.strip() else "unknown"


def control_surface_is_listening(config: RuntimeConfig) -> bool:
    return is_pid_running(read_pid(config.control_surface_pid_path))


def post_hook(
    config: RuntimeConfig, event_slug: str, payload_bytes: bytes, hook_error_log: Path
) -> str:
    if config.control_surface_port <= 0 or not control_surface_is_listening(config):
        return "skip"

    request = urllib.request.Request(
        url=f"http://{config.control_surface_host}:{config.control_surface_port}/hook/{event_slug}",
        data=payload_bytes,
        method="POST",
        headers={"Content-Type": "application/json"},
    )
    if config.control_surface_token:
        request.add_header("Authorization", f"Bearer {config.control_surface_token}")

    try:
        with urllib.request.urlopen(request, timeout=POST_TIMEOUT_SECONDS) as response:
            return str(response.getcode())
    except urllib.error.HTTPError as exc:
        return str(exc.code)
    except urllib.error.URLError as exc:
        reason = exc.reason
        if isinstance(reason, ConnectionRefusedError):
            return "skip"
        if isinstance(reason, OSError) and getattr(reason, "errno", None) in {61, 111}:
            return "skip"
        if isinstance(reason, socket.timeout):
            append_log(hook_error_log, "WARN", "hook-dispatch post timed out")
        else:
            append_log(hook_error_log, "WARN", f"hook-dispatch post failed: {reason}")
        return "error"
    except TimeoutError:
        append_log(hook_error_log, "WARN", "hook-dispatch post timed out")
        return "error"


def main(argv: list[str]) -> int:
    config = load_runtime_config()
    ensure_runtime_dirs(config)
    hook_error_log = error_log_path(config)
    hook_log = hook_log_path(config)

    args = parse_args(argv)
    if args is None:
        append_log(hook_error_log, "ERROR", "hook-dispatch invoked without event metadata")
        return 0

    event_name, event_slug = args

    try:
        payload = read_payload()
    except json.JSONDecodeError as exc:
        append_log(hook_error_log, "ERROR", f"{event_name} invalid JSON payload: {exc}")
        return 0
    except Exception as exc:
        append_log(hook_error_log, "ERROR", f"{event_name} payload read failed: {exc}")
        return 0

    if payload is None:
        return 0

    payload_bytes, payload_data = payload

    try:
        write_event(payload_data, config=config)
    except Exception as exc:
        append_log(hook_error_log, "WARN", f"{event_name} bb-write failed: {exc}")

    status_code = post_hook(config, event_slug, payload_bytes, hook_error_log)
    session_id = session_id_from_payload(payload_data)
    append_log(
        hook_log,
        "INFO",
        f"event={event_name} session_id={session_id} post_status={status_code}",
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv))
    except KeyboardInterrupt:
        raise
    except SystemExit as exc:
        raise exc
    except Exception as exc:
        message = str(exc) or exc.__class__.__name__
        config = load_runtime_config()
        append_log(error_log_path(config), "ERROR", f"hook-dispatch crashed: {message}")
        raise SystemExit(0)
