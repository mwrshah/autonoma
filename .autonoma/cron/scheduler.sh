#!/usr/bin/env bash
# Backward-compatible wrapper for the Autonoma cron recovery loop.
set -euo pipefail

exec "$HOME/.autonoma/cron/autonoma-checkin.sh" "$@"
