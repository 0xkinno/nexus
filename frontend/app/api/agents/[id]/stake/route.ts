import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'


export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const { amount } = await req.json()
  await redis.hset(`agent:${id}`, { stake: String(Math.round(amount)) })
  if (amount >= 200) {
    const badges = await redis.hget(`agent:${id}`, 'badges')
    const b = typeof badges === 'string' ? JSON.parse(badges as string) : (badges || [])
    if (!b.includes('High Stake')) {
      b.push('High Stake')
      await redis.hset(`agent:${id}`, { badges: JSON.stringify(b) })
    }
  }
  return NextResponse.json({ ok: true })
}
