import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ posts: [], members: [] })
  }

  const [posts, members] = await Promise.all([
    prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { content: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        author: { select: { id: true, name: true, image: true, role: true, level: true } },
        _count: { select: { comments: true, likes: true } },
      },
    }),
    prisma.user.findMany({
      where: {
        name: { contains: q, mode: 'insensitive' },
      },
      take: 5,
      select: { id: true, name: true, image: true, role: true, level: true, xp: true },
    }),
  ])

  return NextResponse.json({ posts, members })
}
