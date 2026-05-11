import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { content, category, title } = await request.json()

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Content required' }, { status: 400 })
  }

  const post = await prisma.post.create({
    data: {
      content: content.trim(),
      category: category || 'general',
      title: title?.trim() || null,
      authorId: session.user.id,
    },
  })

  // Award XP for posting
  await prisma.user.update({
    where: { id: session.user.id },
    data: { xp: { increment: 10 } },
  })

  return NextResponse.json(post)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  const posts = await prisma.post.findMany({
    where: category ? { category } : {},
    include: {
      author: { select: { id: true, name: true, image: true, username: true, xp: true } },
      _count: { select: { comments: true, likes: true } },
    },
    orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    take: 30,
  })

  return NextResponse.json(posts)
}
