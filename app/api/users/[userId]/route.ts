import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: {
      id: true, name: true, image: true, bio: true,
      role: true, level: true, xp: true, createdAt: true,
      _count: { select: { posts: true, followers: true, following: true } },
    },
  })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(user)
}

export async function PATCH(req: Request, { params }: { params: { userId: string } }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (session.user.id !== params.userId && (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { name, bio, image } = await req.json()
  const user = await prisma.user.update({
    where: { id: params.userId },
    data: {
      ...(name !== undefined && { name }),
      ...(bio !== undefined && { bio }),
      ...(image !== undefined && { image }),
    },
    select: { id: true, name: true, image: true, bio: true, role: true, level: true, xp: true },
  })
  return NextResponse.json(user)
}
