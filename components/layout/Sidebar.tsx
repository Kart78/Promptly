import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'

interface SidebarProps {
  memberCount: number
  onlineCount: number
  adminCount: number
  leaderboard: Array<{
    id: string
    name: string
    image?: string
    xp: number
    level: number
    role: string
  }>
}

const MEDALS = ['🥇', '🥈', '🥉']

export function Sidebar({ memberCount, onlineCount, adminCount, leaderboard }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col gap-4 w-72 shrink-0">
      {/* Community info */}
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 text-white text-sm font-bold flex items-center justify-center">P</div>
          <div>
            <p className="font-semibold text-sm text-gray-900">Promptly</p>
            <p className="text-xs text-gray-400">promptly.vercel.app</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          A community for builders, indie developers, and creators. Share wins, discover tools, and grow together.
        </p>
        <div className="flex gap-3 text-center">
          {[
            { label: 'Members', value: memberCount },
            { label: 'Online', value: onlineCount },
            { label: 'Admins', value: adminCount },
          ].map(({ label, value }) => (
            <div key={label} className="flex-1">
              <p className="text-base font-semibold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-50 flex flex-col gap-1">
          <a href="/apps" className="text-xs text-brand-600 hover:underline">🚀 Browse all apps</a>
          <a href="https://github.com/Kart78" className="text-xs text-brand-600 hover:underline" target="_blank" rel="noreferrer">💻 GitHub projects</a>
          <a href="https://youtube.com" className="text-xs text-brand-600 hover:underline" target="_blank" rel="noreferrer">📹 YouTube channel</a>
        </div>
      </div>

      {/* Leaderboard — FIX UX-06: single render, no duplication */}
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-900">Leaderboard</p>
          <span className="text-xs text-gray-400">30-day</span>
        </div>
        <div className="space-y-2">
          {leaderboard.map((user, i) => (
            <Link
              key={user.id}
              href={`/profile/${user.id}`}
              className="flex items-center gap-2.5 hover:bg-gray-50 rounded-lg px-1 py-1 transition-colors"
            >
              <span className="text-base w-5 text-center">{MEDALS[i] || `${i + 1}`}</span>
              <Avatar name={user.name || 'U'} image={user.image} size="xs" role={user.role} />
              <span className="text-xs font-medium text-gray-700 flex-1 truncate">{user.name}</span>
              <span className="text-xs text-brand-600 font-medium">+{user.xp}</span>
            </Link>
          ))}
        </div>
        <Link href="/leaderboards" className="block mt-3 text-xs text-center text-brand-600 hover:underline">
          See all leaderboards
        </Link>
      </div>
    </aside>
  )
}
