import { prisma } from '@/lib/prisma'
import { PostCard } from '@/components/ui/PostCard'
import { auth } from '@/lib/auth'

export const metadata = { title: 'App Showcase — Promptly' }

export default async function AppsPage() {
  const session = await auth()

  const posts = await prisma.post.findMany({
    where: { category: 'showcase' },
    orderBy: [{ createdAt: 'desc' }],
    include: {
      author: { select: { id: true, name: true, image: true, role: true, level: true } },
      _count: { select: { comments: true, likes: true } },
      likes: session?.user?.id ? { where: { userId: session.user.id } } : false,
    },
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">App Showcase 🚀</h1>
      <p className="text-sm text-gray-400 mb-6">Projects built by our community</p>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🚀</div>
          <p className="font-medium">No apps yet</p>
          <p className="text-sm mt-1">Be the first to share your project!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post as any} currentUserId={session?.user?.id} />
          ))}
        </div>
      )}
    </div>
  )
}
