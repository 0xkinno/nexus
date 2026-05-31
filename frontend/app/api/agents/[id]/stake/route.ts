import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const DB_PATH = join(process.cwd(), 'data/db.json')

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { amount } = await req.json()
  const db = JSON.parse(readFileSync(DB_PATH, 'utf8'))
  const agent = db.agents.find((a: any) => a.id === params.id)
  if (!agent) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  agent.stake = String(Math.round(amount))
  if (!agent.badges.includes('High Stake') && parseFloat(agent.stake) >= 200) {
    agent.badges.push('High Stake')
  }
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
  return NextResponse.json(agent)
}
