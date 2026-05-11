import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { postId, content } = await request.json()

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Content required' }, { status: 400 })
  }

  const comment = await prisma.comment.create({
    data: {
      content: content.trim(),
      post: { connect: { id: postId } },
      author: { connect: { id: session.user.id } },
    },
    include: {
      author: { select: { id: true, name: true, image: true, username: true } },
    },
  })

  await prisma.user.update({
    where: { id: session.user.id },
    data: { xp: { increment: 5 } },
  })

  return NextResponse.json(comment)
}
