'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { NotificationBell } from '@/components/ui/NotificationBell'
import { SearchBar } from '@/components/ui/SearchBar'

const NAV_LINKS = [
  { href: '/', label: 'Community' },
  { href: '/classroom', label: 'Classroom' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/members', label: 'Members' },
  { href: '/leaderboards', label: 'Leaderboards' },
  { href: '/about', label: 'About' },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-gray-900 shrink-0 mr-1">
          <span className="w-7 h-7 rounded-lg bg-brand-600 text-white text-xs font-bold flex items-center justify-center">P</span>
          <span className="hidden sm:block text-sm">Promptly</span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
                isActive(href) ? 'font-semibold text-brand-700 bg-brand-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />
        <SearchBar />

        <div className="flex items-center gap-1 shrink-0">
          {session?.user ? (
            <>
              <NotificationBell />
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 rounded-full pl-1 pr-2 py-1 hover:bg-gray-100 transition-colors">
                  <Avatar name={session.user.name || 'U'} image={session.user.image} size="sm" role={(session.user as any).role} />
                  <svg className="w-3 h-3 text-gray-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                    <div className="px-3 py-2.5 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                    </div>
                    <Link href={`/profile/${(session.user as any).id}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}>
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      Your profile
                    </Link>
                    <Link href="/settings"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}>
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Settings
                    </Link>
                    <div className="border-t border-gray-50 mt-1" />
                    <button onClick={() => { signOut({ callbackUrl: '/' }); setUserMenuOpen(false) }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm px-3 py-1.5 text-gray-600 hover:text-gray-900">Log in</Link>
              <Link href="/register" className="text-sm px-3 py-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium">Sign up</Link>
            </div>
          )}
          <button className="md:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 ml-1"
            onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-2 flex flex-col gap-0.5">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm ${isActive(href) ? 'font-semibold text-brand-700 bg-brand-50' : 'text-gray-600 hover:bg-gray-50'}`}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
