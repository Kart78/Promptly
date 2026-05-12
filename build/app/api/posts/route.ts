import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content, category, title } = await request.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Content required' }, { status: 400 })

  const post = await prisma.post.create({
    data: {
      content: content.trim(),
      category: category || 'general',
      title: title?.trim() || null,
      author: { connect: { id: session.user.id } },
    },
  })

  await prisma.$executeRaw`UPDATE "User" SET xp = xp + 10 WHERE id = ${session.user.id}`

  return NextResponse.json(post)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const q = searchParams.get('q')

  const where: any = {}
  if (category && category !== 'all') where.category = category
  if (q) where.OR = [
    { title: { contains: q, mode: 'insensitive' } },
    { content: { contains: q, mode: 'insensitive' } },
  ]

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: { select: { id: true, name: true, image: true, username: true, xp: true } },
      _count: { select: { comments: true, likes: true } },
    },
    orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    take: 30,
  })

  return NextResponse.json(posts)
}
