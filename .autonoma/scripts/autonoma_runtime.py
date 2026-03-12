#!/usr/bin/env python3
"""Shared runtime helpers for Autonoma shell-adjacent scripts."""

from __future__ import annotations

import json
import os
import signal
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

AUTONOMA_ROTATE_BYTES = 10 * 1024 * 1024
DEFAULT_CONTROL_SURFACE_HOST = "127.0.0.1"
DEFAULT_CONTROL_SURFACE_PORT = 18820


@dataclass(frozen=True)
class RuntimeConfig:
    home: Path
    config_path: Path
    log_dir: Path
    blackboard_path: Path
    control_surface_host: str
    control_surface_port: int
    control_surface_token: str
    control_surface_pid_path: Path


def runtime_home() -> Path:
    return Path(os.environ.get("AUTONOMA_HOME", "~/.autonoma")).expanduser()


def runtime_config_path(home: Path | None = None) -> Path:
    base = home or runtime_home()
    return Path(os.environ.get("AUTONOMA_CONFIG", str(base / "config.json"))).expanduser()


def runtime_log_dir(home: Path | None = None) -> Path:
    base = home or runtime_home()
    return Path(os.environ.get("AUTONOMA_LOG_DIR", str(base / "logs"))).expanduser()


def expand_home_path(value: str, home: Path | None = None) -> Path:
    base = home or Path.home()
    if value == "~":
        return base
    if value.startswith("~/"):
        return base / value[2:]
    return Path(value)


def load_config_json(config_path: Path | None = None) -> dict[str, Any]:
    path = config_path or runtime_config_path()
    if not path.exists():
        return {}

    raw = path.read_text("utf8").strip()
    if not raw:
        return {}

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return {}
    return data if isinstance(data, dict) else {}


def parse_port(value: Any, default: int = DEFAULT_CONTROL_SURFACE_PORT) -> int:
    try:
        port = int(value)
    except (TypeError, ValueError):
        return default

    return port if port > 0 else default


def load_runtime_config() -> RuntimeConfig:
    home = runtime_home()
    config_path = runtime_config_path(home)
    log_dir = runtime_log_dir(home)
    raw = load_config_json(config_path)

    blackboard_raw = str(raw.get("blackboardPath") or str(home / "blackboard.db"))
    return RuntimeConfig(
        home=home,
        config_path=config_path,
        log_dir=log_dir,
        blackboard_path=expand_home_path(blackboard_raw, Path.home()),
        control_surface_host=str(raw.get("controlSurfaceHost") or DEFAULT_CONTROL_SURFACE_HOST),
        control_surface_port=parse_port(raw.get("controlSurfacePort")),
        control_surface_token=str(raw.get("controlSurfaceToken") or ""),
        control_surface_pid_path=home / "control-surface" / "server.pid",
    )


def ensure_runtime_dirs(config: RuntimeConfig | None = None) -> None:
    cfg = config or load_runtime_config()
    cfg.home.mkdir(parents=True, exist_ok=True)
    cfg.log_dir.mkdir(parents=True, exist_ok=True)
    cfg.blackboard_path.parent.mkdir(parents=True, exist_ok=True)
    cfg.control_surface_pid_path.parent.mkdir(parents=True, exist_ok=True)


def utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def rotate_log_file(path: Path) -> None:
    if not path.exists() or path.stat().st_size < AUTONOMA_ROTATE_BYTES:
        return

    rotated = path.with_name(f"{path.name}.1")
    rotated.unlink(missing_ok=True)
    path.replace(rotated)


def append_log(path: Path, level: str, message: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    rotate_log_file(path)
    with path.open("a", encoding="utf8") as handle:
        handle.write(f"[{utc_now()}] {level} {message}\n")


def read_pid(path: Path) -> int | None:
    try:
        return int(path.read_text("utf8").strip())
    except (FileNotFoundError, ValueError):
        return None


def is_pid_running(pid: int | None) -> bool:
    if pid is None or pid <= 0:
        return False

    try:
        os.kill(pid, 0)
    except OSError:
        return False
    return True


def signal_name(signum: int) -> str:
    try:
        return signal.Signals(signum).name
    except ValueError:
        return str(signum)
