#!/usr/bin/env bash
# Participant-only onboarding for Vara Agent Network (agent-onboarding.md Steps 0–3.5)
# Usage:
#   export ACCT=nexus-main
#   export PARTICIPANT_HANDLE=your-handle
#   export GITHUB_URL=https://github.com/you/your-repo
#   bash scripts/van-register-participant.sh

set -euo pipefail

: "${ACCT:?Set ACCT (local wallet name, e.g. nexus-main)}"
: "${PARTICIPANT_HANDLE:?Set PARTICIPANT_HANDLE (3-32 chars, [a-z0-9_-])}"
: "${GITHUB_URL:?Set GITHUB_URL (https://github.com/...)}"

if ! [[ "$PARTICIPANT_HANDLE" =~ ^[a-z0-9_-]{3,32}$ ]]; then
  echo "ERROR: PARTICIPANT_HANDLE must match ^[a-z0-9_-]{3,32}$"
  exit 1
fi
if [[ "$GITHUB_URL" != https://github.com/* ]]; then
  echo "ERROR: GITHUB_URL must start with https://github.com/"
  exit 1
fi

VAN_DIR="/tmp/vara-agent-network/agent-starter"
if [ ! -f "$VAN_DIR/idl/agents_network_client.idl" ]; then
  echo "Cloning vara-agent-network for IDL..."
  rm -rf /tmp/vara-agent-network
  git clone --depth 1 https://github.com/gear-foundation/vara-agent-network.git /tmp/vara-agent-network
fi

export VARA_AGENT_NETWORK_SKILLS_DIR="$VAN_DIR"
eval "$(awk '/^```bash$/{f=1; next} /^```$/{if(f) exit} f' "$VAN_DIR/references/program-ids.md")"

command -v vara-wallet >/dev/null || { echo "Install: npm install -g vara-wallet"; exit 1; }
command -v jq >/dev/null || { echo "Install: apt install jq"; exit 1; }
command -v curl >/dev/null || { echo "Install: apt install curl"; exit 1; }

echo "[1/6] Handle availability..."
TAKEN=$(vara-wallet --network "$VARA_NETWORK" --json call "$PID" \
  Registry/ResolveHandle --args "[\"$PARTICIPANT_HANDLE\"]" --idl "$IDL" \
  2>/dev/null | jq -r '.result.value // empty')
if [ -n "$TAKEN" ]; then
  echo "ERROR: handle '$PARTICIPANT_HANDLE' already registered to $TAKEN"
  exit 1
fi
echo "OK: handle is free"

if ! vara-wallet wallet list 2>/dev/null | grep -qx "$ACCT"; then
  echo "[2/6] Creating wallet $ACCT..."
  vara-wallet wallet create --name "$ACCT" --no-encrypt
else
  echo "[2/6] Wallet $ACCT exists"
fi

echo "[3/6] Operator address..."
INFO=$(vara-wallet --account "$ACCT" --network "$VARA_NETWORK" --json balance "")
OPERATOR_HEX=$(echo "$INFO" | jq -r .address)
SS58=$(echo "$INFO" | jq -r .addressSS58)
echo "  SS58: $SS58"
echo "  hex:  $OPERATOR_HEX"

echo "[4/6] Gas voucher..."
LOW_VOUCHER_BALANCE=10000000000000
VOUCHER_STATE=$(curl -fsS "$VOUCHER_URL/$OPERATOR_HEX")
VOUCHER_ID=$(echo "$VOUCHER_STATE" | jq -r .voucherId)
CAN_TOP_UP=$(echo "$VOUCHER_STATE" | jq -r .canTopUpNow)
VARA_BALANCE=$(echo "$VOUCHER_STATE" | jq -r .varaBalance)
BALANCE_KNOWN=$(echo "$VOUCHER_STATE" | jq -r .balanceKnown)
HAS_PID=$(echo "$VOUCHER_STATE" | jq -r --arg pid "$PID" '.programs | index($pid) != null')
NEED_TOP_UP=false
if [ "$BALANCE_KNOWN" = "true" ] && [ "$VARA_BALANCE" -lt "$LOW_VOUCHER_BALANCE" ]; then NEED_TOP_UP=true; fi
if [ "$VOUCHER_ID" = "null" ] || [ "$HAS_PID" != "true" ] || { [ "$NEED_TOP_UP" = "true" ] && [ "$CAN_TOP_UP" = "true" ]; }; then
  RESP=$(curl -sS -w "\n%{http_code}" -X POST "$VOUCHER_URL" \
    -H 'Content-Type: application/json' \
    -d '{"account":"'"$OPERATOR_HEX"'","programs":["'"$PID"'"]}')
  HTTP_CODE=$(echo "$RESP" | tail -n1)
  BODY=$(echo "$RESP" | sed '$d')
  case "$HTTP_CODE" in
    200|201) VOUCHER_ID=$(echo "$BODY" | jq -r .voucherId) ;;
    429)
      if [ -z "$VOUCHER_ID" ] || [ "$VOUCHER_ID" = "null" ]; then
        echo "Voucher rate-limited; retry later"
        exit 1
      fi
      echo "Rate-limited; reusing voucher $VOUCHER_ID"
      ;;
    *) echo "Voucher POST failed: HTTP $HTTP_CODE — $BODY"; exit 1 ;;
  esac
fi
echo "  VOUCHER_ID=$VOUCHER_ID"

echo "[5/6] RegisterParticipant..."
vara-wallet --account "$ACCT" --network "$VARA_NETWORK" call "$PID" \
  Registry/RegisterParticipant \
  --args "[\"$PARTICIPANT_HANDLE\", \"$GITHUB_URL\"]" \
  --voucher "$VOUCHER_ID" \
  --idl "$IDL"

echo "[6/6] Claim 100 VARA (manual step)"
echo ""
echo "Registered as Participant: $PARTICIPANT_HANDLE"
echo "Open https://agents.vara.network/hackathon"
echo "  - Card: Social Reward — 100 VARA for your X post"
echo "  - Post the tweet from YOUR X account, then paste tweet URL + wallet:"
echo "      SS58: $SS58"
echo "      hex:  $OPERATOR_HEX"
echo ""
echo "After claim succeeds, verify balance:"
echo "  vara-wallet --account $ACCT --network $VARA_NETWORK balance"
echo ""
echo "Next: scope your app (agent-create.md), deploy with vara-skills, then RegisterApplication."
