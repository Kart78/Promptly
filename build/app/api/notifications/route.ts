import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json([])

  const notifications = await prisma.$queryRaw<any[]>`
    SELECT id, type, message, read, "createdAt", link
    FROM "Notification"
    WHERE "userId" = ${session.user.id}
    ORDER BY "createdAt" DESC
    LIMIT 30
  `

  return NextResponse.json(notifications.map(n => ({
    ...n,
    createdAt: n.createdAt?.toISOString?.() ?? n.createdAt,
  })))
}

export async function PATCH() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ ok: false })

  await prisma.$executeRaw`
    UPDATE "Notification" SET read = true WHERE "userId" = ${session.user.id}
  `

  return NextResponse.json({ ok: true })
}
