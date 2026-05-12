import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { TopNav } from '@/components/layout/TopNav'
import { SubNav } from '@/components/layout/SubNav'
import { getLevelFromXP } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function LeaderboardsPage() {
  const allTime = await prisma.user.findMany({
    orderBy: { xp: 'desc' },
    take: 50,
    select: { id: true, name: true, image: true, username: true, xp: true, createdAt: true, _count: { select: { posts: true } } },
  })

  const medals = ['🥇', '🥈', '🥉']

  return (
    <>
      <TopNav />
      <SubNav />
      <div className="page-body" style={{ justifyContent: 'center' }}>
        <div style={{ flex: 1, maxWidth: 680, padding: '20px 16px' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Leaderboards</h1>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 20 }}>Top members ranked by XP earned</p>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            {/* Top 3 podium */}
            {allTime.slice(0, 3).length > 0 && (
              <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)' }}>
                {[allTime[1], allTime[0], allTime[2]].filter(Boolean).map((m, i) => {
                  const actualRank = m === allTime[0] ? 0 : m === allTime[1] ? 1 : 2
                  const level = getLevelFromXP(m.xp)
                  return (
                    <Link href={`/profile/${m.username || m.id}`} key={m.id} style={{ flex: 1, textAlign: 'center', padding: '20px 10px', borderRight: i < 2 ? '1px solid var(--border)' : 'none', transition: 'background 0.1s' }}>
                      <div style={{ fontSize: actualRank === 0 ? 36 : 28, marginBottom: 8 }}>{medals[actualRank]}</div>
                      <div className="avatar" style={{ width: 48, height: 48, margin: '0 auto 8px', background: '#eff6ff', color: 'var(--blue)', fontSize: 18 }}>
                        {m.image ? <img src={m.image} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} /> : m.name?.[0]}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>Lv.{level.level}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)', marginTop: 4 }}>+{m.xp}</div>
                    </Link>
                  )
                })}
              </div>
            )}

            {/* Full list */}
            {allTime.map((m, i) => {
              const level = getLevelFromXP(m.xp)
              return (
                <Link href={`/profile/${m.username || m.id}`} key={m.id}>
                  <div className="lb-row" style={{ borderBottom: i < allTime.length - 1 ? '1px solid #f5f5f3' : 'none' }}>
                    <div className={`lb-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}`}>
                      {i < 3 ? medals[i] : i + 1}
                    </div>
                    <div className="avatar" style={{ width: 36, height: 36, background: '#eff6ff', color: 'var(--blue)', fontSize: 13, flexShrink: 0 }}>
                      {m.image ? <img src={m.image} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} /> : m.name?.[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="lb-name">{m.name}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>Level {level.level} · {m._count.posts} posts</div>
                    </div>
                    <div className="lb-xp">+{m.xp.toLocaleString()}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
