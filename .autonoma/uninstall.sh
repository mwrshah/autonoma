#!/usr/bin/env bash
set -euo pipefail

AUTONOMA_DIR="$HOME/.autonoma"
MANIFEST="$AUTONOMA_DIR/manifest.json"
SETTINGS="$HOME/.claude/settings.json"
PLIST="$HOME/Library/LaunchAgents/com.autonoma.scheduler.plist"
PLIST_LABEL="com.autonoma.scheduler"
CRONTAB_TARGET="crontab:user"
LOG_FILE="$AUTONOMA_DIR/logs/install.log"

DRY_RUN=false
AUTO_YES=false
META_UNINSTALL=false

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --yes) AUTO_YES=true ;;
    --meta) META_UNINSTALL=true ;;
    *) ;;
  esac
done

file_size_bytes() {
  local path="$1"
  if [[ ! -f "$path" ]]; then
    echo 0
    return 0
  fi

  if stat -f%z "$path" >/dev/null 2>&1; then
    stat -f%z "$path"
  else
    stat -c%s "$path"
  fi
}

rotate_log() {
  local path="$1"
  mkdir -p "$(dirname "$path")"
  local size
  size=$(file_size_bytes "$path")
  if (( size < 10 * 1024 * 1024 )); then
    return 0
  fi
  rm -f "${path}.1"
  mv "$path" "${path}.1"
}

log() {
  rotate_log "$LOG_FILE"
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*" >> "$LOG_FILE" 2>/dev/null || true
}

info() { echo "$*"; log "INFO: $*"; }
warn() { echo "WARNING: $*" >&2; log "WARN: $*"; }
error() { echo "ERROR: $*" >&2; log "ERROR: $*"; }

confirm() {
  if $AUTO_YES; then
    return 0
  fi
  if $DRY_RUN; then
    info "(dry-run) Would apply above changes."
    return 1
  fi
  printf '%s' 'Apply these changes? [y/N] '
  read -r answer
  [[ "$answer" =~ ^[Yy]$ ]]
}

sha256_file() {
  local path="$1"
  if command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "$path" | awk '{print $1}'
  elif command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$path" | awk '{print $1}'
  else
    openssl dgst -sha256 "$path" | awk '{print $NF}'
  fi
}

sha256_text() {
  local text="$1"
  if command -v shasum >/dev/null 2>&1; then
    printf '%s' "$text" | shasum -a 256 | awk '{print $1}'
  elif command -v sha256sum >/dev/null 2>&1; then
    printf '%s' "$text" | sha256sum | awk '{print $1}'
  else
    printf '%s' "$text" | openssl dgst -sha256 | awk '{print $NF}'
  fi
}

atomic_write() {
  local path="$1"
  local content="$2"
  mkdir -p "$(dirname "$path")"
  local tmpfile
  tmpfile=$(mktemp "$(dirname "$path")/.autonoma.tmp.XXXXXX")
  printf '%s' "$content" > "$tmpfile"
  mv "$tmpfile" "$path"
}

manifest_delete_target() {
  local target_key="$1"
  local updated
  updated=$(jq --arg key "$target_key" 'del(.targets[$key])' "$MANIFEST")
  atomic_write "$MANIFEST" "$(printf '%s' "$updated" | jq .)"
}

manifest_target_exists() {
  local target_key="$1"
  jq -e --arg key "$target_key" '.targets[$key] != null' "$MANIFEST" >/dev/null 2>&1
}

ensure_prereqs() {
  if ! command -v jq >/dev/null 2>&1; then
    error "jq is required but not found."
    exit 1
  fi

  mkdir -p "$AUTONOMA_DIR/logs"

  if [[ ! -f "$MANIFEST" ]]; then
    info "No manifest found at $MANIFEST. Nothing to uninstall."
    exit 0
  fi

  if ! jq empty "$MANIFEST" >/dev/null 2>&1; then
    error "Manifest is malformed JSON. Aborting."
    exit 1
  fi
}

uninstall_hooks() {
  if ! manifest_target_exists "~/.claude/settings.json"; then
    info "No hook entries in manifest. Skipping hooks uninstall."
    return 0
  fi

  if [[ ! -f "$SETTINGS" ]]; then
    warn "settings.json is missing. Clearing manifest hook entries."
    if ! $DRY_RUN; then
      manifest_delete_target "~/.claude/settings.json"
    fi
    return 0
  fi

  if ! jq empty "$SETTINGS" >/dev/null 2>&1; then
    error "settings.json is malformed JSON. Aborting hooks uninstall."
    exit 1
  fi

  local expected_hash current_hash prefix missing_exact filtered
  expected_hash=$(jq -r '.targets["~/.claude/settings.json"].checksums.file_after_install // empty' "$MANIFEST")
  current_hash=$(sha256_file "$SETTINGS")
  prefix="$HOME/.autonoma/hooks/"

  if [[ -n "$expected_hash" && "$expected_hash" != "$current_hash" ]]; then
    warn "settings.json has drifted since installation. Attempting surgical removal of Autonoma hooks only."
  fi

  missing_exact=$(jq -n --slurpfile manifest "$MANIFEST" --slurpfile settings "$SETTINGS" '
    [($manifest[0].targets["~/.claude/settings.json"].modifications // [])[]
      | .content as $content
      | select(any([($settings[0].hooks // {})[]?[]?] | .[]; . == $content) | not)
    ] | length
  ' 2>/dev/null || echo 0)
  if [[ "$missing_exact" != "0" ]]; then
    warn "One or more manifest-tracked hook entries were already changed or removed externally."
  fi

  filtered=$(jq --arg prefix "$prefix" '
    if (.hooks // null) == null then
      .
    else
      .hooks |= with_entries(
        .value |= [(.[]?) | select(any(.hooks[]?; (.command // "") | startswith($prefix)) | not)]
      )
      | .hooks |= with_entries(select(.value | length > 0))
      | if (.hooks | length) == 0 then del(.hooks) else . end
    end
  ' "$SETTINGS")

  if diff -u <(jq -S . "$SETTINGS") <(printf '%s' "$filtered" | jq -S .) >/dev/null 2>&1; then
    info "Autonoma hook entries are already absent. Clearing manifest hook entries."
    if ! $DRY_RUN; then
      manifest_delete_target "~/.claude/settings.json"
    fi
    return 0
  fi

  info "=== Hooks changes to $SETTINGS ==="
  diff -u <(jq -S . "$SETTINGS") <(printf '%s' "$filtered" | jq -S .) || true
  info ""

  if confirm; then
    if ! $DRY_RUN; then
      atomic_write "$SETTINGS" "$(printf '%s' "$filtered" | jq .)"
      manifest_delete_target "~/.claude/settings.json"
      info "Hooks removed from settings.json."
    fi
  else
    info "Skipped hooks uninstall."
  fi
}

uninstall_launchd() {
  if ! manifest_target_exists "~/Library/LaunchAgents/com.autonoma.scheduler.plist"; then
    return 0
  fi

  info "=== launchd changes ==="
  [[ -f "$PLIST" ]] && info "Will remove plist: $PLIST"
  info "Will unload launchd label: $PLIST_LABEL"
  info ""

  if confirm; then
    if ! $DRY_RUN; then
      launchctl bootout "gui/$(id -u)" "$PLIST" >/dev/null 2>&1 || true
      rm -f "$PLIST"
      manifest_delete_target "~/Library/LaunchAgents/com.autonoma.scheduler.plist"
      info "launchd scheduler removed."
    fi
  else
    info "Skipped launchd uninstall."
  fi
}

uninstall_linux_crontab() {
  if ! manifest_target_exists "$CRONTAB_TARGET"; then
    return 0
  fi

  if ! command -v crontab >/dev/null 2>&1; then
    warn "crontab is unavailable; cannot remove scheduler entry automatically."
    return 0
  fi

  local before_text after_text desired_line before_hash current_hash
  before_text=$(crontab -l 2>/dev/null || true)
  desired_line=$(jq -r '.targets["crontab:user"].modifications[0].content // empty' "$MANIFEST")
  after_text=$(printf '%s\n' "$before_text" | awk 'index($0, "# autonoma-scheduler") == 0' | sed '/^[[:space:]]*$/N;/^\n$/D' || true)
  before_hash=''
  current_hash=''

  if [[ -n "$before_text" ]]; then
    before_hash=$(sha256_text "$before_text")
  fi
  if [[ -n "$desired_line" ]] && ! grep -Fq "$desired_line" <<<"$before_text"; then
    warn "Manifest-tracked crontab line was already changed or removed externally."
  fi

  if [[ "$before_text" == "$after_text" ]]; then
    info "Autonoma crontab entry already absent. Clearing manifest cron entry."
    if ! $DRY_RUN; then
      manifest_delete_target "$CRONTAB_TARGET"
    fi
    return 0
  fi

  info "=== crontab changes ==="
  diff -u <(printf '%s\n' "$before_text") <(printf '%s\n' "$after_text") || true
  info ""

  if confirm; then
    if ! $DRY_RUN; then
      local tmpfile
      if [[ -n "$(printf '%s' "$after_text" | tr -d '[:space:]')" ]]; then
        tmpfile=$(mktemp /tmp/autonoma-crontab.XXXXXX)
        printf '%s\n' "$after_text" > "$tmpfile"
        crontab "$tmpfile"
        rm -f "$tmpfile"
        current_hash=$(sha256_text "$after_text")
      else
        crontab -r 2>/dev/null || true
        current_hash='null'
      fi
      log "INFO: Removed crontab scheduler before=${before_hash:-null} after=${current_hash:-null}"
      manifest_delete_target "$CRONTAB_TARGET"
      info "Linux crontab scheduler removed."
    fi
  else
    info "Skipped crontab uninstall."
  fi
}

uninstall_scheduler() {
  if [[ "$(uname -s)" == "Darwin" ]]; then
    uninstall_launchd
  elif [[ "$(uname -s)" == "Linux" ]]; then
    uninstall_linux_crontab
  fi
}

graceful_stop() {
  local up_script="$AUTONOMA_DIR/bin/autonoma-up"
  if [[ -x "$up_script" ]]; then
    if $DRY_RUN; then
      info "(dry-run) Would stop Autonoma runtime via $up_script stop"
    else
      "$up_script" stop >/dev/null 2>&1 || true
    fi
  fi
}

meta_uninstall() {
  if ! $META_UNINSTALL; then
    return 0
  fi

  info "=== Meta uninstall ==="
  info "Will remove the entire $AUTONOMA_DIR directory."
  info ""

  if confirm; then
    graceful_stop
    if ! $DRY_RUN; then
      rm -rf "$AUTONOMA_DIR"
      info "Removed $AUTONOMA_DIR. Autonoma fully uninstalled."
    fi
  else
    info "Skipped meta uninstall."
  fi
}

cleanup_manifest_if_empty() {
  if ! $DRY_RUN && [[ -f "$MANIFEST" ]]; then
    local remaining
    remaining=$(jq '.targets | length' "$MANIFEST" 2>/dev/null || echo 0)
    if [[ "$remaining" == "0" ]]; then
      rm -f "$MANIFEST"
      info "Manifest cleared (no remaining external targets)."
    fi
  fi
}

main() {
  ensure_prereqs

  info "Autonoma Uninstaller"
  info "===================="
  $DRY_RUN && info "(dry-run mode — no changes will be written)"
  info ""

  uninstall_hooks
  uninstall_scheduler
  cleanup_manifest_if_empty
  meta_uninstall

  info "Uninstall complete."
}

main
