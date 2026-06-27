import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { awardXP, XP_REWARDS } from '@/lib/xp'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const comments = await prisma.comment.findMany({
    where: { postId: params.id, parentId: null },
    orderBy: { createdAt: 'asc' },
    include: {
      author: { select: { id: true, name: true, image: true, role: true } },
      _count: { select: { likes: true } },
      replies: {
        include: {
          author: { select: { id: true, name: true, image: true, role: true } },
          _count: { select: { likes: true } },
        },
      },
    },
  })
  return NextResponse.json(comments)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { content, parentId } = await req.json()
  if (!content?.trim()) {
    return NextResponse.json({ error: 'Content required' }, { status: 400 })
  }
  const comment = await prisma.comment.create({
    data: {
      content,
      postId: params.id,
      authorId: session.user.id,
      parentId: parentId || null,
    },
    include: {
      author: { select: { id: true, name: true, image: true, role: true } },
      _count: { select: { likes: true } },
      replies: { include: { author: { select: { id: true, name: true, image: true, role: true } }, _count: { select: { likes: true } } } },
    },
  })
  await awardXP(session.user.id, XP_REWARDS.COMMENT)
  const post = await prisma.post.findUnique({ where: { id: params.id } })
  if (post && post.authorId !== session.user.id) {
    await prisma.notification.create({
      data: {
        userId: post.authorId,
        type: 'COMMENT',
        message: `${session.user.name} commented on your post`,
        link: `/post/${params.id}`,
      },
    })
  }
  return NextResponse.json(comment, { status: 201 })
}
