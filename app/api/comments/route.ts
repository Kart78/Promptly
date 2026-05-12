import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId, content } = await request.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Content required' }, { status: 400 })

  const commentId = `comment_${Date.now()}_${Math.random().toString(36).slice(2)}`
  await prisma.$executeRaw`
    INSERT INTO "Comment" (id, content, "postId", "authorId", "createdAt")
    VALUES (${commentId}, ${content.trim()}, ${postId}, ${session.user.id}, NOW())
  `

  await prisma.$executeRaw`UPDATE "User" SET xp = xp + 5 WHERE id = ${session.user.id}`

  // Notify post author
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true, title: true, content: true } })
  if (post && post.authorId !== session.user.id) {
    const notifId = `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`
    const preview = (post.title || post.content).slice(0, 40)
    await prisma.$executeRaw`
      INSERT INTO "Notification" (id, "userId", type, message, link, "createdAt")
      VALUES (${notifId}, ${post.authorId}, 'comment', ${`<strong>${session.user.name}</strong> commented on your post "${preview}..."`}, ${`/post/${postId}`}, NOW())
    `
  }

  const comment = await prisma.$queryRaw<any[]>`
    SELECT c.id, c.content, c."createdAt", u.id as "authorId", u.name, u.image, u.username
    FROM "Comment" c JOIN "User" u ON c."authorId" = u.id
    WHERE c.id = ${commentId}
  `

  return NextResponse.json(comment[0] ?? {})
}
