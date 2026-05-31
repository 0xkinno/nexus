import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const DB_PATH = join(process.cwd(), 'data/db.json')

function getDB() {
  return JSON.parse(readFileSync(DB_PATH, 'utf8'))
}

function saveDB(db: any) {
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

export async function GET() {
  const db = getDB()
  return NextResponse.json(db.agents)
}

export async function POST(req: Request) {
  const body = await req.json()
  const db = getDB()
  const existing = db.agents.find((a: any) => a.id === body.id)
  if (existing) return NextResponse.json({ error: 'already_registered' }, { status: 400 })
  const agent = {
    id: body.id,
    name: body.name,
    category: body.category,
    description: body.description || '',
    github: body.github || '',
    score: 50,
    reviews: 0,
    stake: '0',
    badges: [],
    registered: new Date().toISOString().slice(0, 10),
    calls: 0,
    txCount: 1
  }
  db.agents.push(agent)
  saveDB(db)
  return NextResponse.json(agent)
}
