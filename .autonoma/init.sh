#!/usr/bin/env bash
set -euo pipefail

AUTONOMA_DIR="$HOME/.autonoma"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT=""
if [[ -d "$SCRIPT_DIR/../src" && -d "$SCRIPT_DIR/../features" ]]; then
  REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
fi
HOOK_SCRIPTS=(
  session-start.sh
  pre-tool-use.sh
  post-tool-use.sh
  post-tool-use-failure.sh
  stop.sh
  session-end.sh
  subagent-start.sh
  subagent-stop.sh
)
SCRIPT_FILES=(
  autonoma_runtime.py
  bb-query.py
  bb-write.py
  bb_write.py
  hook-dispatch.sh
  hook_dispatch.py
  init-db.sh
  runtime-common.sh
)
CRON_FILES=(autonoma-checkin.sh scheduler.sh com.autonoma.scheduler.plist)
BIN_FILES=(autonoma-up autonoma-wa)
WHATSAPP_FILES=(README.md config.json.example)
WHATSAPP_EXEC_FILES=(run-entry.js cli.js daemon.js)

info() {
  echo "$*"
}

copy_file() {
  local src="$1"
  local dest="$2"
  local mode="$3"
  mkdir -p "$(dirname "$dest")"
  cp "$src" "$dest"
  chmod "$mode" "$dest"
}

mkdir -p \
  "$AUTONOMA_DIR" \
  "$AUTONOMA_DIR/bin" \
  "$AUTONOMA_DIR/cron" \
  "$AUTONOMA_DIR/control-surface" \
  "$AUTONOMA_DIR/hooks" \
  "$AUTONOMA_DIR/logs" \
  "$AUTONOMA_DIR/scripts" \
  "$AUTONOMA_DIR/whatsapp/auth" \
  "$AUTONOMA_DIR/whatsapp/logs"

for file in install.sh uninstall.sh init.sh VERSION; do
  [[ -f "$SCRIPT_DIR/$file" ]] || continue
  copy_file "$SCRIPT_DIR/$file" "$AUTONOMA_DIR/$file" 755
done

for file in "${HOOK_SCRIPTS[@]}"; do
  [[ -f "$SCRIPT_DIR/hooks/$file" ]] || continue
  copy_file "$SCRIPT_DIR/hooks/$file" "$AUTONOMA_DIR/hooks/$file" 755
done

for file in "${SCRIPT_FILES[@]}"; do
  [[ -f "$SCRIPT_DIR/scripts/$file" ]] || continue
  copy_file "$SCRIPT_DIR/scripts/$file" "$AUTONOMA_DIR/scripts/$file" 755
done

for file in "${CRON_FILES[@]}"; do
  [[ -f "$SCRIPT_DIR/cron/$file" ]] || continue
  copy_file "$SCRIPT_DIR/cron/$file" "$AUTONOMA_DIR/cron/$file" 755
done

for file in "${BIN_FILES[@]}"; do
  [[ -f "$SCRIPT_DIR/bin/$file" ]] || continue
  copy_file "$SCRIPT_DIR/bin/$file" "$AUTONOMA_DIR/bin/$file" 755
done

for file in "${WHATSAPP_FILES[@]}"; do
  [[ -f "$SCRIPT_DIR/whatsapp/$file" ]] || continue
  copy_file "$SCRIPT_DIR/whatsapp/$file" "$AUTONOMA_DIR/whatsapp/$file" 644
done

for file in "${WHATSAPP_EXEC_FILES[@]}"; do
  [[ -f "$SCRIPT_DIR/whatsapp/$file" ]] || continue
  copy_file "$SCRIPT_DIR/whatsapp/$file" "$AUTONOMA_DIR/whatsapp/$file" 755
done

if [[ -d "$SCRIPT_DIR/../src" ]]; then
  rm -rf "$AUTONOMA_DIR/src"
  mkdir -p "$AUTONOMA_DIR/src"
  cp -R "$SCRIPT_DIR/../src/." "$AUTONOMA_DIR/src/"
fi

if [[ -n "$REPO_ROOT" ]]; then
  printf '%s\n' "$REPO_ROOT" > "$AUTONOMA_DIR/source-root"
  chmod 644 "$AUTONOMA_DIR/source-root"
fi

chmod 700 "$AUTONOMA_DIR/whatsapp/auth" "$AUTONOMA_DIR/whatsapp/logs"

info "Autonoma initialized at $AUTONOMA_DIR"
if [[ -n "$REPO_ROOT" ]]; then
  info "Recorded source root: $REPO_ROOT"
fi
info "Run '$AUTONOMA_DIR/install.sh' to install hooks and scheduler."
