import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'


export async function POST(req: Request) {
  const body = await req.json()
  const agent = await redis.hgetall(`agent:${body.agentId}`)
  if (!agent) return NextResponse.json({ error: 'agent_not_found' }, { status: 404 })
  const review = {
    id: Date.now().toString(),
    agentId: body.agentId,
    reviewer: body.reviewer || '0xanon',
    score: Math.min(100, Math.max(0, body.score)),
    evidence: body.evidence || '',
    date: new Date().toISOString().slice(0, 10)
  }
  await redis.lpush(`reviews:${body.agentId}`, JSON.stringify(review))
  const reviews = await redis.lrange(`reviews:${body.agentId}`, 0, -1)
  const parsed = reviews.map(r => typeof r === 'string' ? JSON.parse(r) : r)
  const avgScore = Math.round(parsed.reduce((s: number, r: any) => s + r.score, 0) / parsed.length)
  await redis.hset(`agent:${body.agentId}`, { score: avgScore, reviews: parsed.length })
  return NextResponse.json(review)
}
