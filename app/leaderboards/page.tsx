import { prisma } from '@/lib/prisma'
import { Avatar } from '@/components/ui/Avatar'
import Link from 'next/link'

export const metadata = { title: 'Leaderboards — Promptly' }

const MEDALS = ['🥇', '🥈', '🥉']

export default async function LeaderboardsPage() {
  const allTime = await prisma.user.findMany({
    orderBy: { xp: 'desc' },
    take: 20,
    select: { id: true, name: true, image: true, xp: true, level: true, role: true, _count: { select: { posts: true } } },
  })

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const recentPosts = await prisma.post.groupBy({
    by: ['authorId'],
    where: { createdAt: { gte: thirtyDaysAgo } },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 20,
  })

  const monthlyUserIds = recentPosts.map((p) => p.authorId)
  const monthlyUsers = monthlyUserIds.length > 0
    ? await prisma.user.findMany({
        where: { id: { in: monthlyUserIds } },
        select: { id: true, name: true, image: true, xp: true, level: true, role: true, _count: { select: { posts: true } } },
      })
    : allTime

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Leaderboards</h1>
      <p className="text-sm text-gray-400 mb-6">Top members ranked by XP earned</p>

      {/* 30-day */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-gray-700">30-day ranking</h2>
          <span className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full">Active this month</span>
        </div>
        <div className="space-y-2">
          {monthlyUsers.map((user, i) => (
            <Link key={user.id} href={`/profile/${user.id}`}
              className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-brand-100 hover:bg-brand-50/30 transition-all">
              <span className="text-lg w-6 text-center">{MEDALS[i] || <span className="text-sm text-gray-400">{i + 1}</span>}</span>
              <Avatar name={user.name || 'U'} image={user.image} size="sm" role={user.role} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-400">Level {user.level} · {user._count.posts} posts</p>
              </div>
              <span className="text-sm font-semibold text-brand-600">+{user.xp}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* All-time */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">All-time ranking</h2>
        <div className="space-y-2">
          {allTime.map((user, i) => (
            <Link key={user.id} href={`/profile/${user.id}`}
              className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-brand-100 hover:bg-brand-50/30 transition-all">
              <span className="text-lg w-6 text-center">{MEDALS[i] ?? <span className="text-sm text-gray-400">{i + 1}</span>}</span>
              <Avatar name={user.name || 'U'} image={user.image} size="sm" role={user.role} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-400">Level {user.level} · {user._count.posts} posts</p>
              </div>
              <span className="text-sm font-semibold text-brand-600">+{user.xp}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
