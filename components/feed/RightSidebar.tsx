import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getLevelFromXP } from '@/lib/constants'

export async function RightSidebar() {
  const [topMembers, totalMembers] = await Promise.all([
    prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 5,
      select: { id: true, name: true, image: true, username: true, xp: true },
    }),
    prisma.user.count(),
  ])

  const medals = ['🥇', '🥈', '🥉', '4', '5']

  return (
    <aside className="sidebar-right">
      {/* Community card */}
      <div className="right-card">
        <div className="right-card-img">
          <span style={{ fontSize: 40, fontWeight: 900, letterSpacing: -2 }}>P</span>
        </div>
        <div className="right-card-body">
          <div className="community-name">Promptly</div>
          <div className="community-url">promptly.vercel.app</div>
          <div className="community-desc">
            A community for builders, indie developers, and creators. Share wins, discover tools, and grow together.
          </div>
          <div className="community-links">
            <a href="/apps" className="community-link">
              <span>🚀</span> Browse all apps
            </a>
            <a href="https://github.com/Kart78" target="_blank" rel="noopener noreferrer" className="community-link">
              <span>💻</span> GitHub projects
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="community-link">
              <span>📹</span> YouTube channel
            </a>
          </div>
          <div className="community-stats">
            <div className="stat-item">
              <div className="stat-num">{totalMembers.toLocaleString()}</div>
              <div className="stat-label">Members</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">1</div>
              <div className="stat-label">Online</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">1</div>
              <div className="stat-label">Admins</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="right-card">
        <div className="leaderboard-title">Leaderboard (30-day)</div>
        {topMembers.map((m, i) => {
          const level = getLevelFromXP(m.xp)
          return (
            <Link href={`/profile/${m.username || m.id}`} key={m.id}>
              <div className="lb-row">
                <div className={`lb-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}`}>
                  {i < 3 ? medals[i] : i + 1}
                </div>
                <div className="avatar" style={{ width: 32, height: 32, background: '#eff6ff', color: 'var(--blue)', fontSize: 12, flexShrink: 0 }}>
                  {m.image ? (
                    <img src={m.image} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : m.name?.[0]?.toUpperCase()}
                </div>
                <div className="lb-name">{m.name}</div>
                <div className="lb-xp">+{m.xp}</div>
              </div>
            </Link>
          )
        })}
        <Link href="/leaderboards" className="see-all-link">See all leaderboards</Link>
      </div>

      <div style={{ textAlign: 'center', fontSize: 12, color: '#ccc', paddingTop: 8 }}>
        Powered by <strong style={{ color: '#aaa' }}>Promptly</strong>
      </div>
    </aside>
  )
}
