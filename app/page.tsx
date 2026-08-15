import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { PostComposer } from '@/components/ui/PostComposer'
import { Sidebar } from '@/components/layout/Sidebar'
import { CategoryFilter } from '@/components/ui/CategoryFilter'
import { FeedWithModal } from '@/components/ui/FeedWithModal'

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'general', label: 'General Discussion 💬' },
  { value: 'showcase', label: 'App Showcase 🚀' },
  { value: 'aviation', label: 'Aviation & Travel ✈️' },
  { value: 'ai', label: 'AI & Tools 🤖' },
  { value: 'youtube', label: 'YouTube 📹' },
  { value: 'resources', label: 'Resources 📚' },
]

export default async function HomePage({ searchParams }: { searchParams: { category?: string } }) {
  const session = await auth()
  const category = searchParams.category

  const posts = await prisma.post.findMany({
    where: category && category !== 'all' ? { category } : {},
    orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    include: {
      author: { select: { id: true, name: true, image: true, role: true, level: true } },
      _count: { select: { comments: true, likes: true } },
      likes: session?.user?.id
        ? { where: { userId: session.user.id }, select: { id: true } }
        : false,
    },
  })

  const memberCount = await prisma.user.count()
  const adminCount = await prisma.user.count({ where: { role: { in: ['ADMIN', 'MODERATOR'] } } })
  const leaderboard = await prisma.user.findMany({
    orderBy: { xp: 'desc' },
    take: 5,
    select: { id: true, name: true, image: true, xp: true, level: true, role: true },
  })
  const upcomingEvent = await prisma.event.findFirst({
    where: { startAt: { gte: new Date() } },
    orderBy: { startAt: 'asc' },
  })
  // Fall back to defaults (rendered by Sidebar) if the table isn't there yet
  // (e.g. `prisma db push` hasn't been run against this database) — a missing
  // branding row should never take down the whole homepage.
  const community = await prisma.communitySettings
    .findUnique({ where: { id: 'singleton' } })
    .catch(() => null)

  const currentUser = session?.user ? {
    id: session.user.id!,
    name: session.user.name!,
    image: session.user.image,
    role: (session.user as any).role,
  } : null

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
      <div className="flex-1 min-w-0">
        {upcomingEvent && (
          <div className="mb-4 px-4 py-2.5 bg-brand-50 border border-brand-100 rounded-xl text-sm flex items-center gap-2">
            <span>📅</span>
            <span className="font-semibold text-brand-800">{upcomingEvent.title}</span>
            <span className="text-brand-600">is happening soon</span>
          </div>
        )}

        {session?.user ? (
          <PostComposer session={session} />
        ) : (
          <div className="mb-4 p-4 bg-white border border-gray-100 rounded-xl text-sm text-gray-500 text-center">
            <a href="/login" className="text-brand-600 font-medium hover:underline">Sign in</a> to post and join the conversation.
          </div>
        )}

        <CategoryFilter categories={CATEGORIES} active={category || 'all'} />

        <div className="mt-3">
          <FeedWithModal posts={posts as any} currentUser={currentUser} />
        </div>
      </div>

      <Sidebar memberCount={memberCount} onlineCount={1} adminCount={adminCount} leaderboard={leaderboard as any} community={community} />
    </div>
  )
}
