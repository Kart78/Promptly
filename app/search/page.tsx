import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { PostCard } from '@/components/ui/PostCard'
import { Avatar } from '@/components/ui/Avatar'
import Link from 'next/link'

interface PageProps {
  searchParams: { q?: string }
}

export function generateMetadata({ searchParams }: PageProps) {
  return { title: searchParams.q ? `"${searchParams.q}" — Search` : 'Search — Promptly' }
}

export default async function SearchPage({ searchParams }: PageProps) {
  const session = await auth()
  const q = searchParams.q?.trim() || ''

  const [posts, members] = q.length >= 2
    ? await Promise.all([
        prisma.post.findMany({
          where: {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { content: { contains: q, mode: 'insensitive' } },
            ],
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: {
            author: { select: { id: true, name: true, image: true, role: true, level: true } },
            _count: { select: { comments: true, likes: true } },
            likes: session?.user?.id ? { where: { userId: session.user.id } } : false,
          },
        }),
        prisma.user.findMany({
          where: { name: { contains: q, mode: 'insensitive' } },
          take: 10,
          select: { id: true, name: true, image: true, role: true, level: true, xp: true, _count: { select: { posts: true } } },
        }),
      ])
    : [[], []]

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">
        {q ? <>Results for <span className="text-brand-600">&ldquo;{q}&rdquo;</span></> : 'Search'}
      </h1>
      {q && (
        <p className="text-sm text-gray-400 mb-6">
          {posts.length + members.length} result{posts.length + members.length !== 1 ? 's' : ''}
        </p>
      )}

      {!q && (
        <p className="text-sm text-gray-500 mt-4">Enter a search term in the bar above.</p>
      )}

      {/* Members */}
      {members.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Members</h2>
          <div className="space-y-2">
            {(members as any[]).map((m) => (
              <Link key={m.id} href={`/profile/${m.id}`}
                className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-brand-100 hover:bg-brand-50/30 transition-all">
                <Avatar name={m.name} image={m.image} size="md" role={m.role} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                  <p className="text-xs text-gray-400">Lv.{m.level} · {m._count.posts} posts</p>
                </div>
                <span className="text-xs text-brand-600 font-medium">{m.xp} XP</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Posts */}
      {posts.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Posts</h2>
          <div className="space-y-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post as any} currentUserId={session?.user?.id} />
            ))}
          </div>
        </div>
      )}

      {q && posts.length === 0 && members.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-medium">Nothing found</p>
          <p className="text-sm mt-1">Try different keywords</p>
        </div>
      )}
    </div>
  )
}
