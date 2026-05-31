import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'


export async function GET() {
  const keys = await redis.smembers('agent_ids')
  const agents = keys.length > 0
    ? await Promise.all(keys.map(id => redis.hgetall(`agent:${id}`)))
    : []
  const valid = agents.filter(Boolean) as any[]
  const totalStaked = valid.reduce((s, a) => s + parseFloat(a.stake || 0), 0)
  const reviewKeys = await Promise.all(valid.map(a => redis.llen(`reviews:${a.id}`)))
  const totalReviews = reviewKeys.reduce((s, n) => s + n, 0)
  return NextResponse.json({
    totalAgents: valid.length,
    totalReviews,
    totalMessages: 48,
    totalStaked: totalStaked.toFixed(0)
  })
}
