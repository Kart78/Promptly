import { prisma } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { getLevelFromXP } from '@/lib/constants'

export default async function MembersPage() {
  const members = await prisma.user.findMany({
    orderBy: { xp: 'desc' },
    select: {
      id: true, name: true, image: true, username: true, bio: true, xp: true, createdAt: true,
      _count: { select: { posts: true, followers: true } },
    },
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-mono text-[#c9a96e] tracking-widest uppercase mb-2">Community</p>
        <h1 className="text-3xl font-serif text-[#f0ece4] mb-2">Members</h1>
        <p className="text-[#666] text-sm">{members.length} builder{members.length !== 1 ? 's' : ''} in the community</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {members.map((member, i) => {
          const level = getLevelFromXP(member.xp)
          return (
            <Link
              key={member.id}
              href={`/profile/${member.username || member.id}`}
              className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-4 flex items-center gap-4 hover:border-[#2a2a2a] transition-colors"
            >
              <span className="text-xs font-mono text-[#333] w-6 flex-shrink-0">#{i + 1}</span>
              {member.image ? (
                <Image src={member.image} alt="" width={44} height={44} className="rounded-full flex-shrink-0" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-[#c9a96e] flex items-center justify-center font-bold text-[#0e0e0e] flex-shrink-0">
                  {member.name?.[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-[#e8e4dc] truncate">{member.name}</p>
                  <span className="text-xs font-mono text-[#c9a96e]">Lv.{level.level}</span>
                </div>
                {member.bio && (
                  <p className="text-xs text-[#555] truncate mt-0.5">{member.bio}</p>
                )}
                <div className="flex gap-3 mt-1">
                  <span className="text-xs text-[#444]">{member._count.posts} posts</span>
                  <span className="text-xs text-[#444]">{member.xp} xp</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
