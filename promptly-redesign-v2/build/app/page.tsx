import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PostComposer } from '@/components/feed/PostComposer'
import { PostCard } from '@/components/feed/PostCard'
import { RightSidebar } from '@/components/feed/RightSidebar'
import { TopNav } from '@/components/layout/TopNav'
import { SubNav } from '@/components/layout/SubNav'
import { CATEGORIES } from '@/lib/constants'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const session = await auth()
  const { category = 'all', q } = await searchParams

  const where: any = {}
  if (category !== 'all') where.category = category
  if (q) where.OR = [
    { title: { contains: q, mode: 'insensitive' } },
    { content: { contains: q, mode: 'insensitive' } },
  ]

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: { select: { id: true, name: true, image: true, username: true, xp: true } },
      _count: { select: { comments: true, likes: true } },
      likes: session?.user?.id ? { where: { userId: session.user.id }, select: { userId: true } } : { take: 0, select: { userId: true } },
      comments: {
        orderBy: { createdAt: 'desc' },
        take: 4,
        include: { author: { select: { image: true, name: true } } },
      },
    },
    orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    take: 30,
  })

  const enriched = posts.map(p => ({
    ...p,
    recentCommenters: p.comments.map(c => c.author),
    lastCommentAt: p.comments[0]?.createdAt?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
    likes: p.likes,
  }))

  return (
    <>
      <TopNav />
      <SubNav />
      <div className="page-body" style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ flex: 1, maxWidth: 680, padding: '20px 16px', minWidth: 0 }}>
          {/* Event banner */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <span>📅</span>
            <span><strong>Office Hours w/ Karthi</strong> is happening in 7 days</span>
          </div>

          <PostComposer />

          {/* Category pills */}
          <div className="cat-pills">
            <Link href="/" className={`cat-pill ${category === 'all' ? 'active' : ''}`}>All</Link>
            {CATEGORIES.map(cat => (
              <Link key={cat.id} href={`/?category=${cat.id}`} className={`cat-pill ${category === cat.id ? 'active' : ''}`}>
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Search result header */}
          {q && (
            <div style={{ fontSize: 14, color: '#888', marginBottom: 12 }}>
              Showing results for <strong style={{ color: 'var(--text)' }}>&quot;{q}&quot;</strong>
              <Link href="/" style={{ marginLeft: 8, color: 'var(--blue)', fontSize: 13 }}>Clear</Link>
            </div>
          )}

          {/* Posts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#aaa' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#555' }}>No posts yet</div>
                <div style={{ fontSize: 14, marginTop: 6 }}>Be the first to share something!</div>
              </div>
            ) : (
              enriched.map(post => (
                <PostCard
                  key={post.id}
                  post={post as any}
                  currentUserId={session?.user?.id}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {posts.length === 30 && (
            <div className="pagination">
              <span style={{ fontSize: 13, color: '#888' }}>1-30 of many</span>
            </div>
          )}
        </div>

        <RightSidebar />
      </div>
    </>
  )
}
