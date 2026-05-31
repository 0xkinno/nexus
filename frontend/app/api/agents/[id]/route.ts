import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

const DB_PATH = join(process.cwd(), 'data/db.json')

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const db = JSON.parse(readFileSync(DB_PATH, 'utf8'))
  const agent = db.agents.find((a: any) => a.id === id)
  if (!agent) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  const reviews = db.reviews.filter((r: any) => r.agentId === id)
  return NextResponse.json({ ...agent, reviewHistory: reviews })
}
