import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { awardXP, XP_REWARDS } from '@/lib/xp'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId: session.user.id, postId: params.id } },
  })

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
    return NextResponse.json({ liked: false })
  }

  await prisma.like.create({
    data: { userId: session.user.id, postId: params.id },
  })

  // Award XP to post author
  const post = await prisma.post.findUnique({ where: { id: params.id } })
  if (post && post.authorId !== session.user.id) {
    await awardXP(post.authorId, XP_REWARDS.LIKE_RECEIVED)
    // Create notification
    await prisma.notification.create({
      data: {
        userId: post.authorId,
        type: 'LIKE',
        message: `${session.user.name} liked your post`,
        link: `/post/${params.id}`,
      },
    })
  }

  return NextResponse.json({ liked: true })
}
