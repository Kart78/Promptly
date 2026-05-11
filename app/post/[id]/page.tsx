import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PostCard } from '@/components/feed/PostCard'
import { CommentSection } from '@/components/feed/CommentSection'

export default async function PostPage({ params }: { params: { id: string } }) {
  const session = await auth()

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { id: true, name: true, image: true, username: true, xp: true } },
      _count: { select: { comments: true, likes: true } },
      likes: session?.user?.id ? { where: { userId: session.user.id } } : false,
      comments: {
        include: {
          author: { select: { id: true, name: true, image: true, username: true, xp: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!post) notFound()

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/" className="text-xs font-mono text-[#555] hover:text-[#888] transition-colors mb-4 inline-block">
        ← Back to feed
      </Link>
      <PostCard post={post as any} currentUserId={session?.user?.id} />
      <CommentSection
        postId={post.id}
        comments={post.comments as any}
        currentUser={session?.user}
      />
    </div>
  )
}
