import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const agent = await redis.hgetall(`agent:${id}`)
  if (!agent) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  const reviews = await redis.lrange(`reviews:${id}`, 0, -1)
  const parsedReviews = reviews.map(r => typeof r === 'string' ? JSON.parse(r) : r)
  const badges = typeof agent.badges === 'string' ? JSON.parse(agent.badges as string) : (agent.badges || [])
  return NextResponse.json({ ...agent, badges, reviewHistory: parsedReviews })
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  await redis.srem('agent_ids', id)
  await redis.del(`agent:${id}`)
  await redis.del(`reviews:${id}`)
  return NextResponse.json({ ok: true })
}
