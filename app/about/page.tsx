import { prisma } from '@/lib/prisma'
import { Avatar } from '@/components/ui/Avatar'
import Link from 'next/link'

export const metadata = { title: 'About — Promptly' }

export default async function AboutPage() {
  const admins = await prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'MODERATOR'] } },
    select: { id: true, name: true, image: true, role: true, bio: true },
  })
  const stats = await prisma.user.aggregate({ _count: true })
  const postCount = await prisma.post.count()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-brand-600 text-white text-xl font-bold flex items-center justify-center">P</div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Promptly</h1>
            <p className="text-sm text-gray-400">promptly.vercel.app</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          A community for builders, indie developers, and creators. Share wins, discover tools, and grow together.
          Whether you&apos;re shipping your first side project or scaling your thousandth user, this is your home base.
        </p>
        <div className="flex gap-6">
          {[{ label: 'Members', value: stats._count }, { label: 'Posts', value: postCount }].map(({ label, value }) => (
            <div key={label}>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Community guidelines */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Community guidelines</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          {[
            '🤝 Be kind and respectful — we\'re all here to learn and grow.',
            '🚀 Share your work, wins, and learnings openly.',
            '🔍 Search before posting to avoid duplicate questions.',
            '🏷️ Use the right category when posting.',
            '🚫 No spam, self-promotion without value, or off-topic content.',
            '💬 Give feedback constructively — lift others up.',
          ].map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>

      {/* Team */}
      {admins.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Team</h2>
          <div className="space-y-3">
            {admins.map((admin) => (
              <Link key={admin.id} href={`/profile/${admin.id}`} className="flex items-center gap-3 hover:bg-gray-50 rounded-xl px-2 py-1.5 transition-colors">
                <Avatar name={admin.name || 'U'} image={admin.image} size="md" role={admin.role} />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{admin.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{admin.role.toLowerCase()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
