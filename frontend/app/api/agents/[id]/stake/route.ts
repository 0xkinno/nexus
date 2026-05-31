import { NextResponse } from 'next/server'

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const body = await req.json()
  return NextResponse.json({ success: true, id, amount: body.amount })
}
