import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { awardXP, XP_REWARDS } from '@/lib/xp'

export async function POST(req: Request, { params }: { params: { userId: string } }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (session.user.id === params.userId) {
    return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
  }

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: session.user.id, followingId: params.userId } },
  })

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } })
    return NextResponse.json({ following: false })
  }

  await prisma.follow.create({
    data: { followerId: session.user.id, followingId: params.userId },
  })
  await awardXP(params.userId, XP_REWARDS.FOLLOW_RECEIVED)
  await prisma.notification.create({
    data: {
      userId: params.userId,
      type: 'FOLLOW',
      message: `${session.user.name} started following you`,
      link: `/profile/${session.user.id}`,
    },
  })
  return NextResponse.json({ following: true })
}
