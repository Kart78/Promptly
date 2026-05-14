import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { id: true, name: true, image: true, role: true, level: true } },
      _count: { select: { comments: true, likes: true } },
      comments: {
        where: { parentId: null },
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
      },
    },
  })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const post = await prisma.post.findUnique({ where: { id: params.id } })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (post.authorId !== session.user.id && (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { title, content, category, pinned, youtubeUrl, imageUrl, linkUrl, linkTitle } = await req.json()
  const updated = await prisma.post.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(category !== undefined && { category }),
      ...(pinned !== undefined && { pinned }),
      ...(youtubeUrl !== undefined && { youtubeUrl }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(linkUrl !== undefined && { linkUrl }),
      ...(linkTitle !== undefined && { linkTitle }),
    },
    include: {
      author: { select: { id: true, name: true, image: true, role: true, level: true } },
      _count: { select: { comments: true, likes: true } },
    },
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const post = await prisma.post.findUnique({ where: { id: params.id } })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (post.authorId !== session.user.id && (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  await prisma.post.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
