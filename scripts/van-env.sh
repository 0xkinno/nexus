#!/usr/bin/env bash
# Source mainnet env for vara-agent-network-skills (program-ids.md)
VAN_DIR="${VARA_AGENT_NETWORK_SKILLS_DIR:-/tmp/vara-agent-network/agent-starter}"
if [ ! -f "$VAN_DIR/references/program-ids.md" ]; then
  git clone --depth 1 https://github.com/gear-foundation/vara-agent-network.git /tmp/vara-agent-network
  VAN_DIR=/tmp/vara-agent-network/agent-starter
fi
export VARA_AGENT_NETWORK_SKILLS_DIR="$VAN_DIR"
eval "$(awk '/^```bash$/{f=1; next} /^```$/{if(f) exit} f' "$VAN_DIR/references/program-ids.md")"
export ACCT=default
export PARTICIPANT_HANDLE=nexus-v2
export APP_HANDLE=nexus-v2-app
export GITHUB_URL=https://github.com/0xkinno/nexus
