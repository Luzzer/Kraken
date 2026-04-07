#!/usr/bin/env bash

UAGENT_DOCKER_LIVE_AUTH_ALL=(.minimax)
UAGENT_DOCKER_LIVE_AUTH_FILES_ALL=(
  .codex/auth.json
  .codex/config.toml
  .claude.json
  .claude/.credentials.json
  .claude/settings.json
  .claude/settings.local.json
)

uagent_live_trim() {
  local value="${1:-}"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"
  printf '%s' "$value"
}

uagent_live_normalize_auth_dir() {
  local value
  value="$(uagent_live_trim "${1:-}")"
  [[ -n "$value" ]] || return 1
  value="${value#.}"
  printf '.%s' "$value"
}

uagent_live_should_include_auth_dir_for_provider() {
  local provider
  provider="$(uagent_live_trim "${1:-}")"
  case "$provider" in
    minimax | minimax-portal)
      printf '%s\n' ".minimax"
      ;;
  esac
}

uagent_live_should_include_auth_file_for_provider() {
  local provider
  provider="$(uagent_live_trim "${1:-}")"
  case "$provider" in
    codex-cli | openai-codex)
      printf '%s\n' ".codex/auth.json"
      printf '%s\n' ".codex/config.toml"
      ;;
    anthropic | claude-cli)
      printf '%s\n' ".claude.json"
      printf '%s\n' ".claude/.credentials.json"
      printf '%s\n' ".claude/settings.json"
      printf '%s\n' ".claude/settings.local.json"
      ;;
  esac
}

uagent_live_collect_auth_dirs_from_csv() {
  local raw="${1:-}"
  local token normalized
  [[ -n "$(uagent_live_trim "$raw")" ]] || return 0
  IFS=',' read -r -a tokens <<<"$raw"
  for token in "${tokens[@]}"; do
    while IFS= read -r normalized; do
      printf '%s\n' "$normalized"
    done < <(uagent_live_should_include_auth_dir_for_provider "$token")
  done | awk 'NF && !seen[$0]++'
}

uagent_live_collect_auth_dirs_from_override() {
  local raw token normalized
  raw="$(uagent_live_trim "${UAGENT_DOCKER_AUTH_DIRS:-}")"
  [[ -n "$raw" ]] || return 1
  case "$raw" in
    all)
      printf '%s\n' "${UAGENT_DOCKER_LIVE_AUTH_ALL[@]}"
      return 0
      ;;
    none)
      return 0
      ;;
  esac
  IFS=',' read -r -a tokens <<<"$raw"
  for token in "${tokens[@]}"; do
    normalized="$(uagent_live_normalize_auth_dir "$token")" || continue
    printf '%s\n' "$normalized"
  done | awk '!seen[$0]++'
  return 0
}

uagent_live_collect_auth_dirs() {
  if uagent_live_collect_auth_dirs_from_override; then
    return 0
  fi
  printf '%s\n' "${UAGENT_DOCKER_LIVE_AUTH_ALL[@]}"
}

uagent_live_collect_auth_files_from_csv() {
  local raw="${1:-}"
  local token normalized
  [[ -n "$(uagent_live_trim "$raw")" ]] || return 0
  IFS=',' read -r -a tokens <<<"$raw"
  for token in "${tokens[@]}"; do
    while IFS= read -r normalized; do
      printf '%s\n' "$normalized"
    done < <(uagent_live_should_include_auth_file_for_provider "$token")
  done | awk 'NF && !seen[$0]++'
}

uagent_live_collect_auth_files_from_override() {
  local raw
  raw="$(uagent_live_trim "${UAGENT_DOCKER_AUTH_DIRS:-}")"
  [[ -n "$raw" ]] || return 1
  case "$raw" in
    all)
      printf '%s\n' "${UAGENT_DOCKER_LIVE_AUTH_FILES_ALL[@]}"
      return 0
      ;;
    none)
      return 0
      ;;
  esac
  return 0
}

uagent_live_collect_auth_files() {
  if uagent_live_collect_auth_files_from_override; then
    return 0
  fi
  printf '%s\n' "${UAGENT_DOCKER_LIVE_AUTH_FILES_ALL[@]}"
}

uagent_live_join_csv() {
  local first=1 value
  for value in "$@"; do
    [[ -n "$value" ]] || continue
    if (( first )); then
      printf '%s' "$value"
      first=0
    else
      printf ',%s' "$value"
    fi
  done
}
