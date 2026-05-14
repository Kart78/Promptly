import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const events = await prisma.event.findMany({
    where: { startAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    orderBy: { startAt: 'asc' },
  })
  return NextResponse.json(events)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { title, description, startAt, endAt, link } = await req.json()
  if (!title || !startAt) {
    return NextResponse.json({ error: 'title and startAt required' }, { status: 400 })
  }
  const event = await prisma.event.create({
    data: { title, description, startAt: new Date(startAt), endAt: endAt ? new Date(endAt) : null, link },
  })
  return NextResponse.json(event, { status: 201 })
}
