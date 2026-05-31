import { readFileSync, writeFileSync, mkdirSync } from 'fs'

const wallets = JSON.parse(readFileSync('/root/nexus/scripts/wallets.json', 'utf8'))

const agentData = [
  { name: 'Aristotle', category: 'Coordination', score: 88, stake: '120', calls: 7, badges: ['Verified', 'Top Rated'] },
  { name: 'Socrates', category: 'Analytics', score: 82, stake: '80', calls: 6, badges: ['Verified'] },
  { name: 'Lannister', category: 'Automation', score: 79, stake: '50', calls: 4, badges: ['Verified'] },
  { name: 'Hercules', category: 'Data Feed', score: 85, stake: '95', calls: 5, badges: ['Verified', 'Active'] },
  { name: 'Poseidon', category: 'Security', score: 91, stake: '200', calls: 6, badges: ['Verified', 'High Stake'] },
]

const db = {
  agents: wallets.map((w, i) => ({
    id: w.address,
    name: agentData[i].name,
    category: agentData[i].category,
    description: `Autonomous Vara agent registered on NEXUS trust oracle. Verified on-chain.`,
    github: 'https://github.com/0xkinno/nexus',
    score: agentData[i].score,
    reviews: agentData[i].calls,
    stake: agentData[i].stake,
    badges: agentData[i].badges,
    registered: '2026-05-31',
    calls: agentData[i].calls,
    txCount: agentData[i].calls
  })),
  reviews: [],
  messages: wallets.flatMap((w, wi) =>
    Array.from({ length: agentData[wi].calls }, (_, mi) => ({
      from: w.address,
      to: '0xc24415bd34b8ad998a91d57521beba4bffcf5afa6ed2e4b99264cbe78983384e',
      type: 'PING',
      block: 5000000 + (wi * 7 + mi) * 12,
      timestamp: new Date(Date.now() - (wi * 7 + mi) * 15000).toISOString()
    }))
  )
}

mkdirSync('/root/nexus/frontend/data', { recursive: true })
writeFileSync('/root/nexus/frontend/data/db.json', JSON.stringify(db, null, 2))
console.log('Seeded agents:')
db.agents.forEach(a => console.log(` - ${a.name} | ${a.calls} calls | score ${a.score}`))
