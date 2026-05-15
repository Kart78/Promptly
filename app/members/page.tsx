import { prisma } from '@/lib/prisma'
import { Avatar } from '@/components/ui/Avatar'
import Link from 'next/link'
import { getLevelTitle } from '@/lib/xp'

export const metadata = { title: 'Members — Promptly' }

export default async function MembersPage() {
  const members = await prisma.user.findMany({
    orderBy: { xp: 'desc' },
    select: { id: true, name: true, image: true, role: true, level: true, xp: true, _count: { select: { posts: true } }, createdAt: true },
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Members</h1>
      <p className="text-sm text-gray-400 mb-6">{members.length} builder{members.length !== 1 ? 's' : ''} in the community</p>
      <div className="space-y-2">
        {members.map((member, i) => (
          <Link
            key={member.id}
            href={`/profile/${member.id}`}
            className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-brand-100 hover:bg-brand-50/30 transition-all"
          >
            <span className="text-sm text-gray-400 w-6 text-right">#{i + 1}</span>
            <Avatar name={member.name || 'U'} image={member.image} size="md" role={member.role} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900">{member.name}</p>
              <p className="text-xs text-gray-400">Lv.{member.level} — {getLevelTitle(member.level)} · {member._count.posts} posts</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-brand-600">{member.xp} XP</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
