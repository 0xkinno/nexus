import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const DB_PATH = join(process.cwd(), 'data/db.json')

export async function POST(req: Request) {
  const body = await req.json()
  const db = JSON.parse(readFileSync(DB_PATH, 'utf8'))
  const agent = db.agents.find((a: any) => a.id === body.agentId)
  if (!agent) return NextResponse.json({ error: 'agent_not_found' }, { status: 404 })

  const review = {
    id: Date.now().toString(),
    agentId: body.agentId,
    reviewer: body.reviewer || '0xanon',
    score: Math.min(100, Math.max(0, body.score)),
    evidence: body.evidence || '',
    date: new Date().toISOString().slice(0, 10)
  }

  db.reviews.push(review)
  const allReviews = db.reviews.filter((r: any) => r.agentId === body.agentId)
  agent.score = Math.round(allReviews.reduce((sum: number, r: any) => sum + r.score, 0) / allReviews.length)
  agent.reviews = allReviews.length
  if (agent.score >= 80 && !agent.badges.includes('Verified')) agent.badges.push('Verified')

  writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
  return NextResponse.json(review)
}
