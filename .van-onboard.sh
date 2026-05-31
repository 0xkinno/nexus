#!/usr/bin/env bash
set -euo pipefail
exec > /root/nexus/.van-onboard.out 2>&1

VAN_DIR="/tmp/vara-agent-network/agent-starter"
if [ ! -f "$VAN_DIR/idl/agents_network_client.idl" ]; then
  rm -rf /tmp/vara-agent-network
  git clone --depth 1 https://github.com/gear-foundation/vara-agent-network.git /tmp/vara-agent-network
fi

export VARA_AGENT_NETWORK_SKILLS_DIR="$VAN_DIR"
eval "$(awk '/^```bash$/{f=1; next} /^```$/{if(f) exit} f' "$VAN_DIR/references/program-ids.md")"

ACCT="${ACCT:-nexus-main}"
PARTICIPANT_HANDLE="${PARTICIPANT_HANDLE:-}"
GITHUB_URL="${GITHUB_URL:-}"

echo "=== PREFLIGHT ==="
vara-wallet --version 2>&1 || true
echo "PID=$PID"
echo "IDL=$IDL"
echo "ACCT=$ACCT"

if [ -z "$PARTICIPANT_HANDLE" ] || [ -z "$GITHUB_URL" ]; then
  echo "NEED_INTERVIEW=1"
  exit 0
fi

echo "=== WALLET ==="
vara-wallet --account "$ACCT" --network "$VARA_NETWORK" --json balance "" 2>&1 || echo "WALLET_MISSING"

echo "=== HANDLE CHECK ==="
vara-wallet --network "$VARA_NETWORK" --json call "$PID" \
  Registry/ResolveHandle --args "[\"$PARTICIPANT_HANDLE\"]" --idl "$IDL" 2>&1 || true

if vara-wallet wallet list 2>/dev/null | grep -q "^${ACCT}$"; then
  echo "WALLET_EXISTS=1"
else
  echo "WALLET_EXISTS=0"
fi
