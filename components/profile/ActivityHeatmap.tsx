import { prisma } from '@/lib/db'

export async function ActivityHeatmap({ userId }: { userId: string }) {
  const posts = await prisma.post.findMany({
    where: { authorId: userId, createdAt: { gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } },
    select: { createdAt: true },
  })

  // Build day map
  const dayMap: Record<string, number> = {}
  posts.forEach(p => {
    const key = p.createdAt.toISOString().split('T')[0]
    dayMap[key] = (dayMap[key] || 0) + 1
  })

  // Last 16 weeks x 7 days
  const weeks: { date: string; count: number }[][] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let w = 15; w >= 0; w--) {
    const week: { date: string; count: number }[] = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(today)
      date.setDate(date.getDate() - (w * 7 + (6 - d)))
      const key = date.toISOString().split('T')[0]
      week.push({ date: key, count: dayMap[key] || 0 })
    }
    weeks.push(week)
  }

  const maxCount = Math.max(...Object.values(dayMap), 1)

  function getColor(count: number) {
    if (count === 0) return '#1a1a1a'
    const intensity = Math.min(count / maxCount, 1)
    if (intensity < 0.25) return '#2a1f0e'
    if (intensity < 0.5) return '#6b4a1a'
    if (intensity < 0.75) return '#a07030'
    return '#c9a96e'
  }

  return (
    <div>
      <p className="text-xs font-mono text-[#555] tracking-widest uppercase mb-2">Activity</p>
      <div className="flex gap-0.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {week.map(day => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} post${day.count !== 1 ? 's' : ''}`}
                className="w-2.5 h-2.5 rounded-sm"
                style={{ background: getColor(day.count) }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
