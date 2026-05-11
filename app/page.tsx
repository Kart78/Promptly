import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PostComposer } from '@/components/feed/PostComposer'
import { PostCard } from '@/components/feed/PostCard'
import { FeedSidebar } from '@/components/feed/FeedSidebar'
import { CATEGORIES } from '@/lib/constants'

export default async function Home({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const session = await auth()
  const category = searchParams?.category || 'all'

  const posts = await prisma.post.findMany({
    where: category !== 'all' ? { category } : {},
    include: {
      author: { select: { id: true, name: true, image: true, username: true, xp: true } },
      _count: { select: { comments: true, likes: true } },
      likes: session?.user?.id ? { where: { userId: session.user.id } } : false,
    },
    orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    take: 30,
  })

  return (
    <div className="flex gap-6">
      {/* Main feed */}
      <div className="flex-1 min-w-0">
        {/* Category tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <a
            href="/"
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
              category === 'all'
                ? 'bg-[#c9a96e] text-[#0e0e0e] font-medium'
                : 'text-[#666] hover:text-[#e8e4dc]'
            }`}
          >
            All
          </a>
          {CATEGORIES.map(cat => (
            <a
              key={cat.id}
              href={`/?category=${cat.id}`}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                category === cat.id
                  ? 'bg-[#c9a96e] text-[#0e0e0e] font-medium'
                  : 'text-[#666] hover:text-[#e8e4dc]'
              }`}
            >
              {cat.label}
            </a>
          ))}
        </div>

        {/* Composer */}
        {session && <PostComposer />}

        {/* Posts */}
        <div className="flex flex-col gap-3 mt-4">
          {posts.length === 0 ? (
            <div className="text-center py-16 text-[#555]">
              <p className="text-lg">No posts yet.</p>
              <p className="text-sm mt-1">Be the first to share something!</p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard
                key={post.id}
                post={post as any}
                currentUserId={session?.user?.id}
              />
            ))
          )}
        </div>
      </div>

      {/* Sidebar */}
      <FeedSidebar />
    </div>
  )
}
