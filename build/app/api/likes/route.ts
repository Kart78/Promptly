import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId } = await request.json()

  const existing = await prisma.$queryRaw<any[]>`
    SELECT id FROM "Like" WHERE "userId" = ${session.user.id} AND "postId" = ${postId} LIMIT 1
  `

  if (existing.length > 0) {
    await prisma.$executeRaw`DELETE FROM "Like" WHERE "userId" = ${session.user.id} AND "postId" = ${postId}`
    return NextResponse.json({ liked: false })
  }

  const likeId = `like_${Date.now()}_${Math.random().toString(36).slice(2)}`
  await prisma.$executeRaw`
    INSERT INTO "Like" (id, "userId", "postId", "createdAt")
    VALUES (${likeId}, ${session.user.id}, ${postId}, NOW())
    ON CONFLICT DO NOTHING
  `

  // Notify post author
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true, title: true, content: true } })
  if (post && post.authorId !== session.user.id) {
    const notifId = `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`
    const preview = (post.title || post.content).slice(0, 40)
    await prisma.$executeRaw`
      INSERT INTO "Notification" (id, "userId", type, message, link, "createdAt")
      VALUES (${notifId}, ${post.authorId}, 'like', ${`<strong>${session.user.name}</strong> liked your post "${preview}..."`}, ${`/post/${postId}`}, NOW())
    `
    await prisma.$executeRaw`UPDATE "User" SET xp = xp + 2 WHERE id = ${session.user.id}`
  }

  return NextResponse.json({ liked: true })
}
