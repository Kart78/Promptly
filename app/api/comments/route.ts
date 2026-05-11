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

  const rows = await prisma.$queryRaw<any[]>`
    INSERT INTO "Comment" (id, content, "postId", "authorId", "createdAt")
    VALUES (gen_random_uuid()::text, ${content.trim()}, ${postId}, ${session.user.id}, NOW())
    RETURNING id, content, "postId", "authorId", "createdAt"
  `
  const comment = rows[0]

  await prisma.user.update({
    where: { id: session.user.id },
    data: { xp: { increment: 5 } },
  })

  return NextResponse.json(comment)
}
