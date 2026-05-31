import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

const SEED_AGENTS = [
  { id: 'kGgDkwS7ezDmQRmCjHXcaL1T6jvtEedNUkBrH1EhpN3Kp6rDZ', name: 'Aristotle', category: 'Coordination', description: 'Autonomous Vara agent registered on NEXUS trust oracle.', github: 'https://github.com/0xkinno/nexus', score: 88, reviews: 0, stake: '120', badges: ['Verified', 'Top Rated'], registered: '2026-05-31', calls: 7, txCount: 7 },
  { id: 'kGmFc8adByhRmyJw365znvprqJCAhxUQd2ZMQeU9HjBNAcRgh', name: 'Socrates', category: 'Analytics', description: 'Autonomous Vara agent registered on NEXUS trust oracle.', github: 'https://github.com/0xkinno/nexus', score: 82, reviews: 0, stake: '80', badges: ['Verified'], registered: '2026-05-31', calls: 6, txCount: 6 },
  { id: 'kGkP9LKLDeCPyyYhfUtj19ev7j4dqBfpFjToUxKJNnDSiLwvs', name: 'Lannister', category: 'Automation', description: 'Autonomous Vara agent registered on NEXUS trust oracle.', github: 'https://github.com/0xkinno/nexus', score: 79, reviews: 0, stake: '50', badges: ['Verified'], registered: '2026-05-31', calls: 4, txCount: 4 },
  { id: 'kGjoZwthzg5a9Wq696ZT4LdCx4cwDjsCM79ZQTgTdaUSPyUqw', name: 'Hercules', category: 'Data Feed', description: 'Autonomous Vara agent registered on NEXUS trust oracle.', github: 'https://github.com/0xkinno/nexus', score: 85, reviews: 0, stake: '95', badges: ['Verified', 'Active'], registered: '2026-05-31', calls: 5, txCount: 5 },
  { id: 'kGjJkpLGAW5mtNHokeK3LCXoLiuAWKjUnePcxdtbVVEa44Gwb', name: 'Poseidon', category: 'Security', description: 'Autonomous Vara agent registered on NEXUS trust oracle.', github: 'https://github.com/0xkinno/nexus', score: 91, reviews: 0, stake: '200', badges: ['Verified', 'High Stake'], registered: '2026-05-31', calls: 6, txCount: 6 },
]

async function getAgents() {
  const keys = await redis.smembers('agent_ids')
  if (!keys || keys.length === 0) {
    await seedAgents()
    return SEED_AGENTS
  }
  const agents = await Promise.all(keys.map(id => redis.hgetall(`agent:${id}`)))
  return agents.filter(Boolean)
}

async function seedAgents() {
  for (const agent of SEED_AGENTS) {
    await redis.sadd('agent_ids', agent.id)
    await redis.hset(`agent:${agent.id}`, {
      ...agent,
      badges: JSON.stringify(agent.badges)
    })
  }
}

export async function GET() {
  const agents = await getAgents()
  const parsed = agents.map((a: any) => ({
    ...a,
    badges: typeof a.badges === 'string' ? JSON.parse(a.badges) : (a.badges || [])
  }))
  return NextResponse.json(parsed)
}

export async function POST(req: Request) {
  const body = await req.json()
  const agent = {
    id: body.id,
    name: body.name,
    category: body.category,
    description: body.description || '',
    github: body.github || '',
    score: 50,
    reviews: 0,
    stake: '0',
    badges: JSON.stringify([]),
    registered: new Date().toISOString().slice(0, 10),
    calls: 0,
    txCount: 1
  }
  await redis.sadd('agent_ids', body.id)
  await redis.hset(`agent:${body.id}`, agent)
  return NextResponse.json({ ...agent, badges: [] })
}

export async function DELETE(req: Request) {
  const body = await req.json()
  await redis.srem('agent_ids', body.id)
  await redis.del(`agent:${body.id}`)
  await redis.del(`reviews:${body.id}`)
  return NextResponse.json({ ok: true })
}
