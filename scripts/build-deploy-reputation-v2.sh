#!/usr/bin/env bash
set -euo pipefail
LOG=/root/nexus/.build-deploy.log
: > "$LOG"
exec > >(tee -a "$LOG") 2>&1
echo "=== $(date -Is) build-deploy-reputation-v2 ==="

rustup toolchain install nightly-2025-10-20 --target wasm32v1-none 2>&1 || true

cd /root/nexus/contracts/reputation-core-v2
cargo clean 2>&1 || true
cargo build --release 2>&1

echo "=== WASM artifacts ==="
find target -name "*.opt.wasm" 2>/dev/null || true
find target -name "*.wasm" -path "*/wasm32-gear/*" 2>/dev/null | head -20

OPT=$(find target -name "*.opt.wasm" | head -1)
if [ -z "$OPT" ]; then
  echo "ERROR: no .opt.wasm found"
  exit 1
fi
echo "OPT_WASM=$OPT"

npm install -g vara-wallet@latest 2>&1 || true
vara-wallet --version 2>&1

echo "=== Deploy ==="
DEPLOY_OUT=$(vara-wallet --account default --network mainnet --json program upload "$OPT" --value 2000000000000 2>&1) || \
DEPLOY_OUT=$(vara-wallet --account default --network mainnet --json code upload "$OPT" 2>&1) || true
echo "$DEPLOY_OUT"

PROGRAM_ID=$(echo "$DEPLOY_OUT" | jq -r '.programId // .program_id // empty' 2>/dev/null || true)
CODE_ID=$(echo "$DEPLOY_OUT" | jq -r '.codeId // empty' 2>/dev/null || true)
if [ -n "$CODE_ID" ] && [ "$CODE_ID" != "null" ] && { [ -z "$PROGRAM_ID" ] || [ "$PROGRAM_ID" = "null" ]; }; then
  DEPLOY_OUT2=$(vara-wallet --account default --network mainnet --json program deploy "$CODE_ID" --value 2000000000000 2>&1) || true
  echo "$DEPLOY_OUT2"
  PROGRAM_ID=$(echo "$DEPLOY_OUT2" | jq -r '.programId // .program_id // empty' 2>/dev/null || true)
fi

if [ -z "$PROGRAM_ID" ] || [ "$PROGRAM_ID" = "null" ]; then
  echo "ERROR: deploy failed"
  exit 1
fi
echo "PROGRAM_ID=$PROGRAM_ID"
echo "$PROGRAM_ID" > /root/nexus/.program-id

source /root/nexus/scripts/van-env.sh
export PROGRAM_ID
bash /root/nexus/scripts/van-hackathon-continue.sh 2>&1
echo "=== ALL DONE ==="
