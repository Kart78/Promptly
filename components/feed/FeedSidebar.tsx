import Link from 'next/link'
import { APPS } from '@/lib/constants'
import { prisma } from '@/lib/db'

export async function FeedSidebar() {
  const topMembers = await prisma.user.findMany({
    orderBy: { xp: 'desc' },
    take: 5,
    select: { id: true, name: true, image: true, username: true, xp: true },
  })

  const featuredApps = APPS.filter(a => a.featured).slice(0, 2)

  return (
    <aside className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0">
      {/* Featured Apps */}
      <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-mono text-[#555] tracking-widest uppercase">Featured Apps</p>
          <Link href="/apps" className="text-xs text-[#c9a96e] hover:underline">See all</Link>
        </div>
        <div className="flex flex-col gap-2">
          {featuredApps.map(app => (
            <a
              key={app.id}
              href={app.url || app.githubUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
            >
              <span className="text-xl">{app.icon}</span>
              <div>
                <p className="text-sm font-medium text-[#e8e4dc]">{app.name}</p>
                <p className="text-xs text-[#555]">{app.tag}</p>
              </div>
              <span className={`ml-auto text-xs font-mono px-1.5 py-0.5 rounded ${
                app.status === 'LIVE'
                  ? 'text-green-400 bg-green-400/10'
                  : 'text-yellow-500 bg-yellow-500/10'
              }`}>
                {app.status === 'LIVE' ? 'live' : 'wip'}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Top Members */}
      <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-mono text-[#555] tracking-widest uppercase">Top Members</p>
          <Link href="/members" className="text-xs text-[#c9a96e] hover:underline">See all</Link>
        </div>
        <div className="flex flex-col gap-2">
          {topMembers.map((member, i) => (
            <Link
              key={member.id}
              href={`/profile/${member.username || member.id}`}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors"
            >
              <span className="text-xs font-mono text-[#444] w-4">#{i + 1}</span>
              {member.image ? (
                <img src={member.image} alt="" className="w-6 h-6 rounded-full" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#c9a96e] flex items-center justify-center text-xs font-bold text-[#0e0e0e]">
                  {member.name?.[0]}
                </div>
              )}
              <span className="text-sm text-[#c8c4bc] flex-1 truncate">{member.name}</span>
              <span className="text-xs font-mono text-[#c9a96e]">{member.xp} xp</span>
            </Link>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-4">
        <p className="text-xs font-mono text-[#555] tracking-widest uppercase mb-2">About</p>
        <p className="text-sm text-[#666] leading-relaxed">
          Built by <span className="text-[#c9a96e]">Karthi</span> — indie dev, YouTuber, and aviation nerd based in McKinney, TX.
        </p>
        <div className="flex gap-2 mt-3">
          <a href="https://github.com/Kart78" target="_blank" rel="noopener noreferrer"
            className="text-xs font-mono text-[#444] border border-[#222] px-2 py-1 rounded hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors">
            GitHub
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
            className="text-xs font-mono text-[#444] border border-[#222] px-2 py-1 rounded hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors">
            YouTube
          </a>
        </div>
      </div>
    </aside>
  )
}
