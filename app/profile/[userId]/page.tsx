import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'
import { PostCard } from '@/components/ui/PostCard'
import { FollowButton } from '@/components/ui/FollowButton'
import { getLevelTitle, xpToNextLevel } from '@/lib/xp'
import Link from 'next/link'

export default async function ProfilePage({ params }: { params: { userId: string } }) {
  const session = await auth()

  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    include: {
      posts: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, image: true, role: true, level: true } },
          _count: { select: { comments: true, likes: true } },
          likes: session?.user?.id ? { where: { userId: session.user.id } } : false,
        },
      },
      _count: { select: { posts: true, followers: true, following: true } },
    },
  })

  if (!user) notFound()

  const isOwnProfile = session?.user?.id === user.id
  const { current, needed, progress } = xpToNextLevel(user.xp)

  let isFollowing = false
  if (session?.user?.id && !isOwnProfile) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: user.id,
        },
      },
    })
    isFollowing = !!follow
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex gap-6">
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">{user._count.posts} Posts</h2>
        <div className="space-y-3">
          {user.posts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">No posts yet.</p>
          ) : (
            user.posts.map((post) => (
              <PostCard key={post.id} post={post as any} currentUserId={session?.user?.id} />
            ))
          )}
        </div>
      </div>

      <aside className="w-64 shrink-0">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 sticky top-20">
          <div className="text-center mb-4">
            <div className="flex justify-center mb-2">
              <Avatar name={user.name || 'U'} image={user.image} size="lg" role={user.role} />
            </div>
            <h1 className="font-bold text-gray-900">{user.name}</h1>
            <p className="text-xs text-gray-400 mt-0.5">Lv.{user.level} — {getLevelTitle(user.level)}</p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{current} XP</span>
              <span>{needed} XP to next level</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center mb-4">
            {[
              { label: 'Posts', value: user._count.posts },
              { label: 'Followers', value: user._count.followers },
              { label: 'Following', value: user._count.following },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="font-semibold text-gray-900 text-sm">{value}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>

          {isOwnProfile ? (
            <Link href="/settings" className="block w-full text-center text-sm py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
              Edit profile
            </Link>
          ) : session?.user ? (
            <FollowButton targetId={user.id} initialFollowing={isFollowing} targetName={user.name || 'user'} />
          ) : null}

          {user.bio && <p className="text-xs text-gray-500 mt-3 text-center">{user.bio}</p>}
          <p className="text-xs text-gray-400 text-center mt-3">
            Joined {new Date(user.createdAt).toLocaleDateString('en', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </aside>
    </div>
  )
}
