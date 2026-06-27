'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'

interface SearchResult {
  posts: Array<{
    id: string
    title: string | null
    content: string
    category: string
    createdAt: string
    author: { id: string; name: string; image?: string; role: string; level: number }
    _count: { comments: number; likes: number }
  }>
  members: Array<{
    id: string
    name: string
    image?: string
    role: string
    level: number
    xp: number
  }>
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').slice(0, 100)
}

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced search
  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults(null); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      if (res.ok) setResults(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300)
    return () => clearTimeout(timer)
  }, [query, search])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Keyboard shortcut Cmd/Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const hasResults = results && (results.posts.length > 0 || results.members.length > 0)

  return (
    <div className="relative flex-1 max-w-xs" ref={ref}>
      {/* Input */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Search…"
          className="w-full pl-8 pr-10 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-brand-300 focus:bg-white transition-colors placeholder-gray-400"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 bg-gray-100 rounded px-1 hidden sm:block">⌘K</kbd>
      </div>

      {/* Dropdown */}
      {open && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto">
          {loading ? (
            <div className="py-6 text-center text-sm text-gray-400">Searching…</div>
          ) : !hasResults ? (
            <div className="py-6 text-center text-sm text-gray-400">No results for &ldquo;{query}&rdquo;</div>
          ) : (
            <>
              {/* Members */}
              {results.members.length > 0 && (
                <div>
                  <p className="px-3 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Members</p>
                  {results.members.map((m) => (
                    <Link
                      key={m.id}
                      href={`/profile/${m.id}`}
                      onClick={() => { setOpen(false); setQuery('') }}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <Avatar name={m.name} image={m.image} size="sm" role={m.role} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{m.name}</p>
                        <p className="text-xs text-gray-400">Lv.{m.level} · {m.xp} XP</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Posts */}
              {results.posts.length > 0 && (
                <div className={results.members.length > 0 ? 'border-t border-gray-50' : ''}>
                  <p className="px-3 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Posts</p>
                  {results.posts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/post/${p.id}`}
                      onClick={() => { setOpen(false); setQuery('') }}
                      className="flex items-start gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <Avatar name={p.author.name} image={p.author.image} size="xs" role={p.author.role} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {p.title || stripHtml(p.content)}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          by {p.author.name} · {p.category}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
