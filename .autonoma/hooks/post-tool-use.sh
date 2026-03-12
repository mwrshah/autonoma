#!/usr/bin/env bash
set -euo pipefail
exec "$HOME/.autonoma/scripts/hook-dispatch.sh" "PostToolUse" "post-tool-use"
