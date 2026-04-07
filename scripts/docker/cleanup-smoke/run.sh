#!/usr/bin/env bash
set -euo pipefail

cd /repo

export UAGENT_STATE_DIR="/tmp/uagent-test"
export UAGENT_CONFIG_PATH="${UAGENT_STATE_DIR}/uagent.json"

echo "==> Build"
pnpm build

echo "==> Seed state"
mkdir -p "${UAGENT_STATE_DIR}/credentials"
mkdir -p "${UAGENT_STATE_DIR}/agents/main/sessions"
echo '{}' >"${UAGENT_CONFIG_PATH}"
echo 'creds' >"${UAGENT_STATE_DIR}/credentials/marker.txt"
echo 'session' >"${UAGENT_STATE_DIR}/agents/main/sessions/sessions.json"

echo "==> Reset (config+creds+sessions)"
pnpm uagent reset --scope config+creds+sessions --yes --non-interactive

test ! -f "${UAGENT_CONFIG_PATH}"
test ! -d "${UAGENT_STATE_DIR}/credentials"
test ! -d "${UAGENT_STATE_DIR}/agents/main/sessions"

echo "==> Recreate minimal config"
mkdir -p "${UAGENT_STATE_DIR}/credentials"
echo '{}' >"${UAGENT_CONFIG_PATH}"

echo "==> Uninstall (state only)"
pnpm uagent uninstall --state --yes --non-interactive

test ! -d "${UAGENT_STATE_DIR}"

echo "OK"
