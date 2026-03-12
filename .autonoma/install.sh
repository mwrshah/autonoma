#!/usr/bin/env bash
set -euo pipefail

AUTONOMA_DIR="$HOME/.autonoma"
MANIFEST="$AUTONOMA_DIR/manifest.json"
SETTINGS="$HOME/.claude/settings.json"
PLIST_DEST="$HOME/Library/LaunchAgents/com.autonoma.scheduler.plist"
PLIST_LABEL="com.autonoma.scheduler"
CRONTAB_TARGET="crontab:user"
HOOKS_DIR="$AUTONOMA_DIR/hooks"
LOG_FILE="$AUTONOMA_DIR/logs/install.log"
VERSION_FILE="$AUTONOMA_DIR/VERSION"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT=""
CURRENT_OS="$(uname -s)"

DRY_RUN=false
AUTO_YES=false

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --yes) AUTO_YES=true ;;
    *) ;;
  esac
done

TOP_LEVEL_FILES=(install.sh uninstall.sh init.sh VERSION)
HOOK_EVENTS=(
  SessionStart
  PreToolUse
  PostToolUse
  PostToolUseFailure
  Stop
  SessionEnd
  SubagentStart
  SubagentStop
)
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
SOURCE_FILES=(blackboard/schema.sql)
CRON_FILES=(autonoma-checkin.sh scheduler.sh com.autonoma.scheduler.plist)
BIN_FILES=(autonoma-up autonoma-wa)
WHATSAPP_FILES=(README.md config.json.example)
WHATSAPP_EXEC_FILES=(run-entry.js cli.js daemon.js)

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

json_sorted_file() {
  local path="$1"
  jq -S . "$path"
}

json_sorted_text() {
  local text="$1"
  printf '%s' "$text" | jq -S .
}

show_json_diff() {
  local before_path="$1"
  local after_text="$2"
  if [[ -f "$before_path" ]]; then
    diff -u <(json_sorted_file "$before_path") <(json_sorted_text "$after_text") || true
  else
    printf '%s\n' '--- /dev/null'
    printf '%s\n' '+++ proposed'
    json_sorted_text "$after_text"
  fi
}

show_text_diff() {
  local before_path="$1"
  local after_text="$2"
  if [[ -f "$before_path" ]]; then
    diff -u "$before_path" <(printf '%s' "$after_text") || true
  else
    printf '%s\n' '--- /dev/null'
    printf '%s\n' '+++ proposed'
    printf '%s' "$after_text"
    [[ "$after_text" == *$'\n' ]] || printf '\n'
  fi
}

generate_token() {
  python3 - <<'PY'
import uuid
print(uuid.uuid4())
PY
}

canonical_json() {
  local text="$1"
  printf '%s' "$text" | jq -cS .
}

manifest_init() {
  mkdir -p "$AUTONOMA_DIR"
  if [[ -f "$MANIFEST" ]] && ! jq empty "$MANIFEST" >/dev/null 2>&1; then
    local backup="$MANIFEST.bak.$(date -u +%Y%m%dT%H%M%SZ)"
    warn "Manifest is malformed. Backing it up to $backup and recreating."
    mv "$MANIFEST" "$backup"
  fi

  if [[ ! -f "$MANIFEST" ]]; then
    atomic_write "$MANIFEST" '{"version":"1","autonoma_version":"0.0.0","installed_at":null,"targets":{}}'
    chmod 600 "$MANIFEST"
  fi
}

manifest_write_target() {
  local target_key="$1"
  local target_json="$2"
  manifest_init
  local version now updated
  version=$(<"$VERSION_FILE")
  now=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  updated=$(jq --arg key "$target_key" --arg ver "$version" --arg now "$now" --argjson value "$target_json" '
    .version = "1"
    | .autonoma_version = $ver
    | .installed_at = $now
    | .targets[$key] = $value
  ' "$MANIFEST")
  atomic_write "$MANIFEST" "$(printf '%s' "$updated" | jq .)"
  chmod 600 "$MANIFEST"
}

prepare_directories() {
  mkdir -p \
    "$AUTONOMA_DIR" \
    "$AUTONOMA_DIR/bin" \
    "$AUTONOMA_DIR/cron" \
    "$AUTONOMA_DIR/control-surface" \
    "$AUTONOMA_DIR/hooks" \
    "$AUTONOMA_DIR/logs" \
    "$AUTONOMA_DIR/scripts" \
    "$AUTONOMA_DIR/src/blackboard" \
    "$AUTONOMA_DIR/whatsapp/auth" \
    "$AUTONOMA_DIR/whatsapp/logs"
  chmod 700 "$AUTONOMA_DIR/whatsapp/auth" "$AUTONOMA_DIR/whatsapp/logs" 2>/dev/null || true
}

copy_runtime_file() {
  local src="$1"
  local dest="$2"
  local mode="$3"
  mkdir -p "$(dirname "$dest")"
  if [[ "$src" != "$dest" ]]; then
    cp "$src" "$dest"
  fi
  chmod "$mode" "$dest"
}

append_runtime_change() {
  local action="$1"
  local path="$2"
  RUNTIME_CHANGES+="$action $path"$'\n'
}

note_runtime_file() {
  local src="$1"
  local dest="$2"
  if [[ ! -f "$dest" ]]; then
    append_runtime_change create "$dest"
    return 0
  fi

  local src_hash dest_hash
  src_hash=$(sha256_file "$src")
  dest_hash=$(sha256_file "$dest")
  if [[ "$src_hash" != "$dest_hash" ]]; then
    append_runtime_change update "$dest"
  fi
}

bootstrap_config() {
  local config_path="$AUTONOMA_DIR/config.json"
  local config_before='{}'
  local before_hash='null'
  local token project_root command_hint config_after

  if [[ -f "$config_path" ]]; then
    if ! jq empty "$config_path" >/dev/null 2>&1; then
      error "Config is malformed JSON: $config_path"
      exit 1
    fi
    config_before=$(<"$config_path")
    before_hash=$(sha256_file "$config_path")
  fi

  token=$(printf '%s' "$config_before" | jq -r '.controlSurfaceToken // empty')
  if [[ -z "$token" ]]; then
    token=$(generate_token)
  fi

  project_root=$(printf '%s' "$config_before" | jq -r 'if (.projectRoot // "") != "" then .projectRoot elif (.sourceRoot // "") != "" then .sourceRoot else empty end')
  if [[ -z "$project_root" && -n "$PROJECT_ROOT" ]]; then
    project_root="$PROJECT_ROOT"
  fi

  command_hint=$(printf '%s' "$config_before" | jq -r '.controlSurfaceCommand // empty')
  if [[ -z "$command_hint" && -n "$project_root" ]]; then
    if [[ -f "$project_root/dist/control-surface/server.js" ]]; then
      command_hint="cd $(printf '%q' "$project_root") && exec node $(printf '%q' "$project_root/dist/control-surface/server.js")"
    elif [[ -f "$project_root/src/control-surface/server.ts" ]]; then
      command_hint="cd $(printf '%q' "$project_root") && exec node --experimental-strip-types $(printf '%q' "$project_root/src/control-surface/server.ts")"
    fi
  fi

  config_after=$(printf '%s' "$config_before" | jq \
    --arg token "$token" \
    --arg projectRoot "$project_root" \
    --arg commandHint "$command_hint" '
      .controlSurfaceHost = (.controlSurfaceHost // "127.0.0.1")
      | .controlSurfacePort = (.controlSurfacePort // 18820)
      | .controlSurfaceToken = (if (.controlSurfaceToken // "") == "" then $token else .controlSurfaceToken end)
      | .piModel = (if (.piModel // "") == "" or .piModel == "claude-sonnet-4-6" then "claude-opus-4-6" else .piModel end)
      | .piThinkingLevel = (.piThinkingLevel // "low")
      | .stallMinutes = (.stallMinutes // 15)
      | .toolTimeoutMinutes = (.toolTimeoutMinutes // 60)
      | .blackboardPath = (.blackboardPath // "~/.autonoma/blackboard.db")
      | .whatsappAuthDir = (.whatsappAuthDir // "~/.autonoma/whatsapp/auth")
      | .whatsappSocketPath = (.whatsappSocketPath // "~/.autonoma/whatsapp/daemon.sock")
      | .whatsappPidPath = (.whatsappPidPath // "~/.autonoma/whatsapp/daemon.pid")
      | .whatsappCliPath = (.whatsappCliPath // "~/.autonoma/whatsapp/cli.js")
      | .whatsappDaemonPath = (.whatsappDaemonPath // "~/.autonoma/whatsapp/daemon.js")
      | .claudeCliCommand = (if (.claudeCliCommand // "") == "" or .claudeCliCommand == "claude" then "claude --dangerously-skip-permissions" else .claudeCliCommand end)
      | .projectRoot = (if (.projectRoot // "") == "" then $projectRoot else .projectRoot end)
      | .sourceRoot = (if (.sourceRoot // "") == "" then ((.projectRoot // "") | if . != "" then . else $projectRoot end) else .sourceRoot end)
      | .controlSurfaceCommand = (if (.controlSurfaceCommand // "") == "" then $commandHint else .controlSurfaceCommand end)
    ')

  if [[ "$(canonical_json "$config_before")" == "$(canonical_json "$config_after")" ]]; then
    return 0
  fi

  info "=== Runtime config changes ==="
  if [[ -f "$config_path" ]]; then
    diff -u <(json_sorted_text "$config_before") <(json_sorted_text "$config_after") || true
  else
    printf '%s\n' '--- /dev/null'
    printf '%s\n' '+++ proposed'
    json_sorted_text "$config_after"
  fi
  info ""

  if confirm; then
    if ! $DRY_RUN; then
      atomic_write "$config_path" "$(printf '%s' "$config_after" | jq .)"
      chmod 600 "$config_path"
      local after_hash
      after_hash=$(sha256_file "$config_path")
      log "INFO: Bootstrapped config.json before=$before_hash after=$after_hash"
    fi
  else
    info "Skipped config bootstrap update."
  fi
}

prompt_whatsapp_phone() {
  local prompt_text="$1"
  local entered=""
  local normalized=""

  if $AUTO_YES || $DRY_RUN; then
    printf '\n'
    return 0
  fi

  while true; do
    printf '%s' "$prompt_text"
    read -r entered
    entered="${entered//[$'\t\r\n']/}"
    if [[ -z "$entered" ]]; then
      printf '\n'
      return 0
    fi

    normalized=$(printf '%s' "$entered" | tr -cd '0-9')
    if [[ -n "$normalized" ]]; then
      printf '%s\n' "$normalized"
      return 0
    fi

    warn "Please enter digits only (country code included), or leave blank to skip."
  done
}

bootstrap_whatsapp_config() {
  local whatsapp_config="$AUTONOMA_DIR/whatsapp/config.json"
  local pairing_phone=""
  local recipient_jid=""
  local whatsapp_after

  if [[ -f "$whatsapp_config" ]]; then
    if ! jq empty "$whatsapp_config" >/dev/null 2>&1; then
      error "WhatsApp config is malformed JSON: $whatsapp_config"
      exit 1
    fi
    return 0
  fi

  pairing_phone=$(prompt_whatsapp_phone 'WhatsApp phone number for pairing (digits with country code, blank to skip for now): ')
  if [[ -n "$pairing_phone" ]]; then
    recipient_jid="$pairing_phone"
  fi

  whatsapp_after=$(jq -n \
    --arg recipientJid "$recipient_jid" \
    --arg pairingPhoneNumber "$pairing_phone" '
      {
        recipientJid: $recipientJid,
        pairingPhoneNumber: $pairingPhoneNumber,
        typingDelayMs: 800
      }
    ')

  info "=== WhatsApp config bootstrap ==="
  printf '%s\n' '--- /dev/null'
  printf '%s\n' '+++ proposed'
  json_sorted_text "$whatsapp_after"
  if [[ -n "$pairing_phone" ]]; then
    info ""
    info "Using $pairing_phone for both pairingPhoneNumber and recipientJid."
  fi
  info ""

  if confirm; then
    if ! $DRY_RUN; then
      atomic_write "$whatsapp_config" "$(printf '%s' "$whatsapp_after" | jq .)"
      chmod 600 "$whatsapp_config"
    fi
  else
    info "Skipped WhatsApp config bootstrap."
  fi
}

init_blackboard() {
  local init_script="$AUTONOMA_DIR/scripts/init-db.sh"
  if [[ ! -x "$init_script" ]]; then
    warn "init-db.sh not available; skipping blackboard initialization"
    return 0
  fi

  if $DRY_RUN; then
    info "(dry-run) Would initialize blackboard.db"
    return 0
  fi

  bash "$init_script" >> "$LOG_FILE" 2>&1 || warn "Blackboard initialization reported an error. See $LOG_FILE"
}

compute_project_root() {
  if [[ -d "$SCRIPT_DIR/../features" && -d "$SCRIPT_DIR/../src" ]]; then
    PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
    return 0
  fi

  if [[ -f "$AUTONOMA_DIR/source-root" ]]; then
    IFS= read -r PROJECT_ROOT < "$AUTONOMA_DIR/source-root" || true
    return 0
  fi

  PROJECT_ROOT=""
}

preflight() {
  if ! command -v jq >/dev/null 2>&1; then
    error "jq is required but not found."
    exit 1
  fi

  case "$CURRENT_OS" in
    Darwin)
      command -v plutil >/dev/null 2>&1 || { error "plutil is required on macOS."; exit 1; }
      command -v launchctl >/dev/null 2>&1 || { error "launchctl is required on macOS."; exit 1; }
      ;;
    Linux)
      command -v crontab >/dev/null 2>&1 || { error "crontab is required on Linux."; exit 1; }
      ;;
    *)
      warn "Unsupported OS: $CURRENT_OS. Hooks will install, scheduler may be skipped."
      ;;
  esac

  compute_project_root
  prepare_directories

  local version="0.1.0"
  if [[ -f "$SCRIPT_DIR/VERSION" ]]; then
    version=$(<"$SCRIPT_DIR/VERSION")
  fi
  printf '%s\n' "$version" > "$VERSION_FILE"

  info "Autonoma Installer v$version"
  info "=========================="
  $DRY_RUN && info "(dry-run mode — no changes will be written)"
  info ""
}

deploy_runtime_files() {
  local src dest file
  RUNTIME_CHANGES=""

  for file in "${TOP_LEVEL_FILES[@]}"; do
    src="$SCRIPT_DIR/$file"
    dest="$AUTONOMA_DIR/$file"
    [[ -f "$src" ]] || continue
    note_runtime_file "$src" "$dest"
  done

  for file in "${HOOK_SCRIPTS[@]}"; do
    src="$SCRIPT_DIR/hooks/$file"
    dest="$AUTONOMA_DIR/hooks/$file"
    [[ -f "$src" ]] || continue
    note_runtime_file "$src" "$dest"
  done

  for file in "${SCRIPT_FILES[@]}"; do
    src="$SCRIPT_DIR/scripts/$file"
    dest="$AUTONOMA_DIR/scripts/$file"
    [[ -f "$src" ]] || continue
    note_runtime_file "$src" "$dest"
  done

  for file in "${CRON_FILES[@]}"; do
    src="$SCRIPT_DIR/cron/$file"
    dest="$AUTONOMA_DIR/cron/$file"
    [[ -f "$src" ]] || continue
    note_runtime_file "$src" "$dest"
  done

  for file in "${SOURCE_FILES[@]}"; do
    src="$SCRIPT_DIR/../src/$file"
    dest="$AUTONOMA_DIR/src/$file"
    [[ -f "$src" ]] || continue
    note_runtime_file "$src" "$dest"
  done

  for file in "${BIN_FILES[@]}"; do
    src="$SCRIPT_DIR/bin/$file"
    dest="$AUTONOMA_DIR/bin/$file"
    [[ -f "$src" ]] || continue
    note_runtime_file "$src" "$dest"
  done

  for file in "${WHATSAPP_FILES[@]}"; do
    src="$SCRIPT_DIR/whatsapp/$file"
    dest="$AUTONOMA_DIR/whatsapp/$file"
    [[ -f "$src" ]] || continue
    note_runtime_file "$src" "$dest"
  done

  for file in "${WHATSAPP_EXEC_FILES[@]}"; do
    src="$SCRIPT_DIR/whatsapp/$file"
    dest="$AUTONOMA_DIR/whatsapp/$file"
    [[ -f "$src" ]] || continue
    note_runtime_file "$src" "$dest"
  done

  if [[ -z "$RUNTIME_CHANGES" ]]; then
    info "Runtime files already up to date."
  else
    info "=== Runtime file deployment ==="
    printf '%s' "$RUNTIME_CHANGES"
    info ""
    if confirm; then
      if ! $DRY_RUN; then
        for file in "${TOP_LEVEL_FILES[@]}"; do
          src="$SCRIPT_DIR/$file"
          dest="$AUTONOMA_DIR/$file"
          [[ -f "$src" ]] || continue
          copy_runtime_file "$src" "$dest" 755
        done

        for file in "${HOOK_SCRIPTS[@]}"; do
          src="$SCRIPT_DIR/hooks/$file"
          dest="$AUTONOMA_DIR/hooks/$file"
          [[ -f "$src" ]] || continue
          copy_runtime_file "$src" "$dest" 755
        done

        for file in "${SCRIPT_FILES[@]}"; do
          src="$SCRIPT_DIR/scripts/$file"
          dest="$AUTONOMA_DIR/scripts/$file"
          [[ -f "$src" ]] || continue
          copy_runtime_file "$src" "$dest" 755
        done

        for file in "${CRON_FILES[@]}"; do
          src="$SCRIPT_DIR/cron/$file"
          dest="$AUTONOMA_DIR/cron/$file"
          [[ -f "$src" ]] || continue
          copy_runtime_file "$src" "$dest" 755
        done

        for file in "${SOURCE_FILES[@]}"; do
          src="$SCRIPT_DIR/../src/$file"
          dest="$AUTONOMA_DIR/src/$file"
          [[ -f "$src" ]] || continue
          copy_runtime_file "$src" "$dest" 644
        done

        for file in "${BIN_FILES[@]}"; do
          src="$SCRIPT_DIR/bin/$file"
          dest="$AUTONOMA_DIR/bin/$file"
          [[ -f "$src" ]] || continue
          copy_runtime_file "$src" "$dest" 755
        done

        for file in "${WHATSAPP_FILES[@]}"; do
          src="$SCRIPT_DIR/whatsapp/$file"
          dest="$AUTONOMA_DIR/whatsapp/$file"
          [[ -f "$src" ]] || continue
          copy_runtime_file "$src" "$dest" 644
        done

        for file in "${WHATSAPP_EXEC_FILES[@]}"; do
          src="$SCRIPT_DIR/whatsapp/$file"
          dest="$AUTONOMA_DIR/whatsapp/$file"
          [[ -f "$src" ]] || continue
          copy_runtime_file "$src" "$dest" 755
        done
      fi
    else
      info "Skipped runtime file deployment."
    fi
  fi

  bootstrap_config
  bootstrap_whatsapp_config
  init_blackboard
}

install_hooks() {
  local settings_before='{}'
  local before_hash='null'
  local current desired_group event script idx prefix hook_target changes=false modifications='[]'
  prefix="$HOOKS_DIR/"

  if [[ -f "$SETTINGS" ]]; then
    if ! jq empty "$SETTINGS" >/dev/null 2>&1; then
      error "settings.json is malformed JSON. Aborting."
      exit 1
    fi
    settings_before=$(<"$SETTINGS")
    before_hash=$(sha256_file "$SETTINGS")
  fi

  current=$(printf '%s' "$settings_before" | jq '
    if type != "object" then
      {}
    elif (.hooks // null) == null then
      . + {hooks:{}}
    elif (.hooks | type) != "object" then
      .hooks = {}
    else
      .
    end
  ')

  for idx in "${!HOOK_EVENTS[@]}"; do
    event="${HOOK_EVENTS[$idx]}"
    script="${HOOK_SCRIPTS[$idx]}"
    desired_group=$(jq -n --arg cmd "$HOOKS_DIR/$script" '
      {matcher:"",hooks:[{type:"command",command:$cmd,async:true,timeout:15}]}
    ')

    local needs_update=false
    local autonoma_count identical_count
    autonoma_count=$(printf '%s' "$current" | jq -r --arg event "$event" --arg prefix "$prefix" '
      [(.hooks[$event] // [])[]? | select(any(.hooks[]?; (.command // "") | startswith($prefix)))] | length
    ')
    identical_count=$(printf '%s' "$current" | jq -r --arg event "$event" --argjson desired "$desired_group" '
      [(.hooks[$event] // [])[]? | select(. == $desired)] | length
    ')

    if [[ "$autonoma_count" != "1" || "$identical_count" != "1" ]]; then
      needs_update=true
    fi

    if [[ "$needs_update" == true ]]; then
      current=$(printf '%s' "$current" | jq --arg event "$event" --arg prefix "$prefix" --argjson desired "$desired_group" '
        .hooks[$event] = ((.hooks[$event] // []) | map(select(any(.hooks[]?; (.command // "") | startswith($prefix)) | not)) + [$desired])
      ')
      changes=true
    fi

    hook_target=$(jq -n \
      --arg event "$event" \
      --arg contentSha "$(sha256_text "$(canonical_json "$desired_group")")" \
      --argjson content "$desired_group" '
      {
        id: ("hook:" + $event),
        action: "append",
        content: $content,
        content_sha256: $contentSha
      }
    ')
    modifications=$(printf '%s' "$modifications" | jq --argjson item "$hook_target" '. + [$item]')
  done

  if [[ "$changes" == false && -f "$SETTINGS" ]]; then
    info "Hooks already installed. No changes needed."
  else
    info "=== Hook changes to $SETTINGS ==="
    show_json_diff "$SETTINGS" "$current"
    info ""

    if confirm; then
      if ! $DRY_RUN; then
        mkdir -p "$(dirname "$SETTINGS")"
        atomic_write "$SETTINGS" "$(printf '%s' "$current" | jq .)"
      fi
    else
      info "Skipped hooks install."
      return 0
    fi
  fi

  if ! $DRY_RUN; then
    local after_hash target_json
    if [[ -f "$SETTINGS" ]]; then
      after_hash=$(sha256_file "$SETTINGS")
    else
      after_hash="$before_hash"
    fi
    target_json=$(jq -n \
      --argjson mods "$modifications" \
      --arg beforeHash "$before_hash" \
      --arg afterHash "$after_hash" '
      {
        type: "json-merge",
        modifications: $mods,
        checksums: {
          algorithm: "sha256",
          file_before_install: (if $beforeHash == "null" then null else $beforeHash end),
          file_after_install: (if $afterHash == "null" then null else $afterHash end)
        }
      }
    ')
    manifest_write_target "~/.claude/settings.json" "$target_json"
  fi
}

install_launchd() {
  local plist_src="$SCRIPT_DIR/cron/com.autonoma.scheduler.plist"
  if [[ "$CURRENT_OS" != "Darwin" ]]; then
    return 0
  fi

  [[ -f "$plist_src" ]] || { warn "Missing plist template: $plist_src"; return 0; }

  local plist_content before_hash='null'
  plist_content=$(<"$plist_src")
  plist_content="${plist_content//__HOME__/$HOME}"
  plist_content="${plist_content//__AUTONOMA_DIR__/$AUTONOMA_DIR}"

  if [[ -f "$PLIST_DEST" ]]; then
    before_hash=$(sha256_file "$PLIST_DEST")
  fi

  local tmplist
  tmplist=$(mktemp /tmp/autonoma-plist.XXXXXX)
  printf '%s' "$plist_content" > "$tmplist"
  if ! plutil -lint "$tmplist" >/dev/null 2>&1; then
    rm -f "$tmplist"
    error "Generated plist is invalid."
    exit 1
  fi

  local new_hash existing_hash=''
  new_hash=$(sha256_text "$plist_content")
  if [[ -f "$PLIST_DEST" ]]; then
    existing_hash=$(sha256_file "$PLIST_DEST")
  fi

  if [[ "$existing_hash" == "$new_hash" ]]; then
    info "launchd plist already installed. No changes needed."
  else
    info "=== launchd changes ==="
    show_text_diff "$PLIST_DEST" "$plist_content"
    info ""

    if confirm; then
      if ! $DRY_RUN; then
        mkdir -p "$(dirname "$PLIST_DEST")"
        launchctl bootout "gui/$(id -u)" "$PLIST_DEST" >/dev/null 2>&1 || true
        atomic_write "$PLIST_DEST" "$plist_content"
        chmod 644 "$PLIST_DEST"
        launchctl bootstrap "gui/$(id -u)" "$PLIST_DEST" >/dev/null 2>&1 || true
      fi
    else
      rm -f "$tmplist"
      info "Skipped launchd install."
      return 0
    fi
  fi
  rm -f "$tmplist"

  if ! $DRY_RUN; then
    local after_hash target_json
    after_hash=$(sha256_file "$PLIST_DEST")
    target_json=$(jq -n \
      --arg contentSha "$after_hash" \
      --arg beforeHash "$before_hash" \
      --arg afterHash "$after_hash" '
      {
        type: "file-create",
        modifications: [{id:"launchd:scheduler",action:"insert",content_sha256:$contentSha}],
        checksums: {
          algorithm: "sha256",
          file_before_install: (if $beforeHash == "null" then null else $beforeHash end),
          file_after_install: $afterHash
        }
      }
    ')
    manifest_write_target "~/Library/LaunchAgents/com.autonoma.scheduler.plist" "$target_json"
  fi
}

install_linux_crontab() {
  if [[ "$CURRENT_OS" != "Linux" ]]; then
    return 0
  fi

  local desired_line='*/10 * * * * /bin/bash "$HOME/.autonoma/cron/autonoma-checkin.sh" # autonoma-scheduler'
  local before_text='' before_hash='null' after_text filtered_text
  before_text=$(crontab -l 2>/dev/null || true)
  if [[ -n "$before_text" ]]; then
    before_hash=$(sha256_text "$before_text")
  fi

  filtered_text=$(printf '%s\n' "$before_text" | awk 'index($0, "# autonoma-scheduler") == 0' | sed '/^[[:space:]]*$/N;/^\n$/D' || true)
  if [[ -n "$filtered_text" ]]; then
    after_text="${filtered_text}"$'\n'"$desired_line"
  else
    after_text="$desired_line"
  fi

  if [[ "$(printf '%s' "$before_text")" == "$(printf '%s' "$after_text")" ]]; then
    info "Linux crontab already installed. No changes needed."
  else
    info "=== crontab changes ==="
    diff -u <(printf '%s\n' "$before_text") <(printf '%s\n' "$after_text") || true
    info ""

    if confirm; then
      if ! $DRY_RUN; then
        local tmpfile
        tmpfile=$(mktemp /tmp/autonoma-crontab.XXXXXX)
        printf '%s\n' "$after_text" > "$tmpfile"
        crontab "$tmpfile"
        rm -f "$tmpfile"
      fi
    else
      info "Skipped crontab install."
      return 0
    fi
  fi

  if ! $DRY_RUN; then
    local installed_text after_hash target_json
    installed_text=$(crontab -l 2>/dev/null || true)
    after_hash='null'
    if [[ -n "$installed_text" ]]; then
      after_hash=$(sha256_text "$installed_text")
    fi
    target_json=$(jq -n \
      --arg line "$desired_line" \
      --arg beforeHash "$before_hash" \
      --arg afterHash "$after_hash" \
      --arg lineHash "$(sha256_text "$desired_line")" '
      {
        type: "crontab-merge",
        modifications: [{id:"crontab:scheduler",action:"upsert",content:$line,content_sha256:$lineHash}],
        checksums: {
          algorithm: "sha256",
          file_before_install: (if $beforeHash == "null" then null else $beforeHash end),
          file_after_install: (if $afterHash == "null" then null else $afterHash end)
        }
      }
    ')
    manifest_write_target "$CRONTAB_TARGET" "$target_json"
  fi
}

install_scheduler() {
  install_launchd
  install_linux_crontab
}

main() {
  preflight
  deploy_runtime_files
  install_hooks
  install_scheduler
  info ""
  info "Installation complete."
  info "To uninstall: $AUTONOMA_DIR/uninstall.sh"
}

main
