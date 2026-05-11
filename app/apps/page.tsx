import { APPS } from '@/lib/constants'
import { ExternalLink, Github, Clock, Zap } from 'lucide-react'

export default function AppsPage() {
  const featured = APPS.filter(a => a.featured)
  const rest = APPS.filter(a => !a.featured)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-mono text-[#c9a96e] tracking-widest uppercase mb-2">Everything built</p>
        <h1 className="text-3xl font-serif text-[#f0ece4] mb-2">Apps & Tools</h1>
        <p className="text-[#666] text-sm">A collection of tools I&apos;ve built and am actively shipping.</p>
      </div>

      {/* Featured */}
      <div className="mb-8">
        <p className="text-xs font-mono text-[#555] tracking-widest uppercase mb-4 pb-2 border-b border-[#1a1a1a]">Featured</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featured.map(app => (
            <AppCard key={app.id} app={app} featured />
          ))}
        </div>
      </div>

      {/* All */}
      {rest.length > 0 && (
        <div>
          <p className="text-xs font-mono text-[#555] tracking-widest uppercase mb-4 pb-2 border-b border-[#1a1a1a]">In Progress</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rest.map(app => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function AppCard({ app, featured }: { app: typeof APPS[0]; featured?: boolean }) {
  return (
    <div className={`bg-[#141414] border rounded-xl p-5 flex flex-col gap-3 hover:border-[#2a2a2a] transition-colors ${
      featured ? 'border-[#2a2a2a]' : 'border-[#1a1a1a]'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{app.icon}</span>
          <div>
            <p className="font-medium text-[#e8e4dc]">{app.name}</p>
            <p className="text-xs font-mono text-[#c9a96e]">{app.tag}</p>
          </div>
        </div>
        <span className={`text-xs font-mono px-2 py-1 rounded flex items-center gap-1 ${
          app.status === 'LIVE'
            ? 'text-green-400 bg-green-400/10'
            : 'text-yellow-500 bg-yellow-500/10'
        }`}>
          {app.status === 'LIVE' ? <Zap size={10} /> : <Clock size={10} />}
          {app.status === 'LIVE' ? 'live' : 'in progress'}
        </span>
      </div>

      <p className="text-sm text-[#666] leading-relaxed flex-1">{app.description}</p>

      <div className="flex gap-2">
        {app.url && (
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs bg-[#c9a96e] text-[#0e0e0e] font-medium px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            <ExternalLink size={11} /> Visit
          </a>
        )}
        {app.githubUrl && (
          <a
            href={app.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs border border-[#2a2a2a] text-[#888] px-3 py-1.5 rounded-lg hover:text-[#e8e4dc] hover:border-[#444] transition-colors"
          >
            <Github size={11} /> GitHub
          </a>
        )}
      </div>
    </div>
  )
}
