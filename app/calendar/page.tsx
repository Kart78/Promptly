import { prisma } from '@/lib/prisma'

export const metadata = { title: 'Calendar — Promptly' }

export default async function CalendarPage() {
  const events = await prisma.event.findMany({
    where: { startAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    orderBy: { startAt: 'asc' },
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Calendar</h1>
      <p className="text-sm text-gray-400 mb-6">Upcoming community events</p>

      {events.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">📅</div>
          <p className="font-medium">No upcoming events</p>
          <p className="text-sm mt-1">Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const start = new Date(event.startAt)
            const isPast = start < new Date()
            return (
              <div
                key={event.id}
                className={`bg-white border rounded-xl p-4 ${isPast ? 'opacity-60 border-gray-100' : 'border-brand-100'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-center bg-brand-50 rounded-lg px-3 py-2 shrink-0">
                    <p className="text-xs text-brand-600 font-semibold uppercase">{start.toLocaleString('default', { month: 'short' })}</p>
                    <p className="text-2xl font-bold text-brand-700 leading-none">{start.getDate()}</p>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    {event.description && <p className="text-sm text-gray-500 mt-0.5">{event.description}</p>}
                    <p className="text-xs text-gray-400 mt-1">
                      {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {event.endAt && ` – ${new Date(event.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    </p>
                    {event.link && (
                      <a href={event.link} target="_blank" rel="noreferrer" className="text-xs text-brand-600 hover:underline mt-1 block">
                        Join event →
                      </a>
                    )}
                  </div>
                  {!isPast && (
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium shrink-0">Upcoming</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
