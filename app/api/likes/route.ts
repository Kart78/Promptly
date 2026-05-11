import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { postId } = await request.json()

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId: session.user.id, postId } },
  })

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
    return NextResponse.json({ liked: false })
  } else {
    await prisma.like.create({ data: { userId: session.user.id, postId } })
    await prisma.user.update({
      where: { id: session.user.id },
      data: { xp: { increment: 2 } },
    })
    return NextResponse.json({ liked: true })
  }
}
