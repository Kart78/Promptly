import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PostCard } from '@/components/feed/PostCard'
import { TopNav } from '@/components/layout/TopNav'
import { SubNav } from '@/components/layout/SubNav'
import { getLevelFromXP, XP_LEVELS } from '@/lib/constants'
import { formatDistanceToNow } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const session = await auth()
  const { username } = await params

  const user = await prisma.user.findFirst({
    where: { OR: [{ username }, { id: username }] },
    include: {
      _count: { select: { posts: true, followers: true, following: true } },
    },
  })

  if (!user) notFound()

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
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
    orderBy: { createdAt: 'desc' },
  })

  const level = getLevelFromXP(user.xp)
  const nextLevel = XP_LEVELS.find(l => l.level === level.level + 1)
  const xpProgress = nextLevel ? Math.min(((user.xp - level.min) / (nextLevel.min - level.min)) * 100, 100) : 100
  const isOwnProfile = session?.user?.id === user.id

  const enriched = posts.map(p => ({
    ...p,
    recentCommenters: p.comments.map(c => c.author),
    lastCommentAt: p.comments[0]?.createdAt?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
  }))

  return (
    <>
      <TopNav />
      <SubNav />
      <div className="page-body" style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ flex: 1, maxWidth: 720, padding: '20px 16px', minWidth: 0 }}>

          {/* Profile hero */}
          <div className="profile-hero" style={{ marginBottom: 16 }}>
            {/* Avatar */}
            <div className="avatar" style={{ width: 72, height: 72, background: '#eff6ff', color: 'var(--blue)', fontSize: 28, fontWeight: 700, flexShrink: 0 }}>
              {user.image ? (
                <img src={user.image} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }} />
              ) : user.name?.[0]?.toUpperCase()}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700 }}>{user.name}</h1>
                <div className="level-badge" style={{ width: 24, height: 24, fontSize: 12 }}>{level.level}</div>
                <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>{level.label}</span>
              </div>

              {user.bio && <p style={{ fontSize: 14, color: '#555', marginBottom: 10, lineHeight: 1.5 }}>{user.bio}</p>}

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 20, marginBottom: 12, flexWrap: 'wrap' }}>
                {[
                  { label: 'posts', value: user._count.posts },
                  { label: 'followers', value: user._count.followers },
                  { label: 'following', value: user._count.following },
                  { label: 'XP', value: user.xp.toLocaleString() },
                ].map(s => (
                  <div key={s.label}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{s.value}</span>
                    <span style={{ fontSize: 13, color: '#888', marginLeft: 4 }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* XP bar */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888', marginBottom: 4 }}>
                  <span>Level {level.level} — {level.label}</span>
                  {nextLevel && <span>{user.xp} / {nextLevel.min} XP</span>}
                </div>
                <div className="xp-bar-wrap">
                  <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }} />
                </div>
              </div>

              {/* Joined */}
              <div style={{ fontSize: 12, color: '#aaa' }}>
                Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              {isOwnProfile ? (
                <Link href="/settings" className="btn-ghost" style={{ fontSize: 14 }}>Edit profile</Link>
              ) : (
                <button className="btn-primary" style={{ fontSize: 14 }}>Follow</button>
              )}
            </div>
          </div>

          {/* Posts header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>{user._count.posts} Posts</h2>
          </div>

          {/* All posts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {enriched.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#aaa', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✍️</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#555' }}>No posts yet</div>
              </div>
            ) : (
              enriched.map(post => (
                <PostCard key={post.id} post={post as any} currentUserId={session?.user?.id} />
              ))
            )}
          </div>
        </div>

        {/* Mini sidebar */}
        <div style={{ width: 260, flexShrink: 0, padding: '20px 16px 20px 0' }}>
          <div className="right-card" style={{ padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>About</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 14, color: '#555' }}>
                <strong>Level:</strong> {level.level} — {level.label}
              </div>
              <div style={{ fontSize: 14, color: '#555' }}>
                <strong>XP:</strong> {user.xp.toLocaleString()}
              </div>
              <div style={{ fontSize: 14, color: '#555' }}>
                <strong>Posts:</strong> {user._count.posts}
              </div>
              <div style={{ fontSize: 14, color: '#555' }}>
                <strong>Followers:</strong> {user._count.followers}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
