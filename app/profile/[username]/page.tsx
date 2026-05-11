import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { PostCard } from '@/components/feed/PostCard'
import { ActivityHeatmap } from '@/components/profile/ActivityHeatmap'
import { getLevelFromXP } from '@/lib/constants'
import { Calendar, Link as LinkIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const session = await auth()

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: params.username }, { id: params.username }],
    },
    include: {
      _count: { select: { posts: true, followers: true, following: true } },
      posts: {
        include: {
          author: { select: { id: true, name: true, image: true, username: true, xp: true } },
          _count: { select: { comments: true, likes: true } },
          likes: session?.user?.id ? { where: { userId: session.user.id } } : false,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!user) notFound()

  const level = getLevelFromXP(user.xp)

  return (
    <div className="flex gap-6">
      {/* Posts */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono text-[#555] tracking-widest uppercase mb-4">
          {user._count.posts} Posts
        </p>
        <div className="flex flex-col gap-3">
          {user.posts.map(post => (
            <PostCard key={post.id} post={post as any} currentUserId={session?.user?.id} />
          ))}
          {user.posts.length === 0 && (
            <p className="text-[#555] text-sm text-center py-12">No posts yet.</p>
          )}
        </div>
      </div>

      {/* Profile sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-5 sticky top-20">
          {/* Avatar + name */}
          <div className="flex flex-col items-center text-center mb-4">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || ''}
                width={72}
                height={72}
                className="rounded-full border-2 border-[#c9a96e] mb-3"
              />
            ) : (
              <div className="w-18 h-18 rounded-full bg-[#c9a96e] flex items-center justify-center text-2xl font-bold text-[#0e0e0e] mb-3">
                {user.name?.[0]}
              </div>
            )}
            <h1 className="text-lg font-semibold text-[#f0ece4]">{user.name}</h1>
            {user.username && (
              <p className="text-xs font-mono text-[#555]">@{user.username}</p>
            )}
            <div className="mt-2 px-3 py-1 bg-[#c9a96e]/10 border border-[#c9a96e]/20 rounded-full">
              <span className="text-xs font-mono text-[#c9a96e]">
                Level {level.level} · {level.label}
              </span>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-sm text-[#666] text-center leading-relaxed mb-4">{user.bio}</p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Posts', value: user._count.posts },
              { label: 'Followers', value: user._count.followers },
              { label: 'Following', value: user._count.following },
            ].map(stat => (
              <div key={stat.label} className="text-center p-2 bg-[#0e0e0e] rounded-lg">
                <p className="text-base font-semibold text-[#e8e4dc]">{stat.value}</p>
                <p className="text-xs text-[#555]">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* XP bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#555] font-mono">XP</span>
              <span className="text-[#c9a96e] font-mono">{user.xp}</span>
            </div>
            <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c9a96e] rounded-full transition-all"
                style={{ width: `${Math.min((user.xp % 1000) / 10, 100)}%` }}
              />
            </div>
          </div>

          {/* Activity heatmap */}
          <ActivityHeatmap userId={user.id} />

          {/* Joined */}
          <div className="flex items-center gap-1.5 text-xs text-[#444] mt-4">
            <Calendar size={11} />
            Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
          </div>
        </div>
      </aside>
    </div>
  )
}
