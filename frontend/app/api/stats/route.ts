import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

const DB_PATH = join(process.cwd(), 'data/db.json')

export async function GET() {
  const db = JSON.parse(readFileSync(DB_PATH, 'utf8'))
  return NextResponse.json({
    totalAgents: db.agents.length,
    totalReviews: db.reviews.length,
    totalMessages: db.messages.length,
    totalStaked: db.agents.reduce((sum: number, a: any) => sum + parseFloat(a.stake || 0), 0).toFixed(0)
  })
}
