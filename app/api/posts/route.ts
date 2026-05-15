import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { awardXP, XP_REWARDS } from '@/lib/xp'
import { linkifyContent } from '@/lib/linkify'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const posts = await prisma.post.findMany({
    where: category ? { category } : {},
    orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    include: {
      author: { select: { id: true, name: true, image: true, role: true, level: true } },
      _count: { select: { comments: true, likes: true } },
    },
  })
  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, content, category, youtubeUrl, imageUrl, linkUrl, linkTitle, linkImage } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Content required' }, { status: 400 })

  const post = await prisma.post.create({
    data: {
      title: title || null,
      content: linkifyContent(content),
      category: category || 'general',
      authorId: session.user.id,
      youtubeUrl: youtubeUrl || null,
      imageUrl: imageUrl || null,
      linkUrl: linkUrl || null,
      linkTitle: linkTitle || null,
      linkImage: linkImage || null,
    },
    include: {
      author: { select: { id: true, name: true, image: true, role: true, level: true } },
      _count: { select: { comments: true, likes: true } },
    },
  })
  await awardXP(session.user.id, XP_REWARDS.POST)
  return NextResponse.json(post, { status: 201 })
}
