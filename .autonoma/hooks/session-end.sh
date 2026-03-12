#!/usr/bin/env bash
set -euo pipefail
exec "$HOME/.autonoma/scripts/hook-dispatch.sh" "SessionEnd" "session-end"
