'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

interface Notification {
  id: string
  type: string
  message: string
  read: boolean
  createdAt: string
  link?: string
}

export function TopNav() {
  const { data: session } = useSession()
  const router = useRouter()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [search, setSearch] = useState('')
  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (session) fetchNotifications()
  }, [session])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function fetchNotifications() {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
        setUnreadCount(data.filter((n: Notification) => !n.read).length)
      }
    } catch {}
  }

  async function markAllRead() {
    await fetch('/api/notifications', { method: 'PATCH' })
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  function handleSearch(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && search.trim()) {
      router.push(`/?q=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <nav className="topnav">
      {/* Brand */}
      <Link href="/" className="topnav-brand">
        <div className="brand-logo">P</div>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Promptly</span>
      </Link>

      {/* Search */}
      <div className="topnav-search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search"
        />
      </div>

      <div className="topnav-right">
        {session ? (
          <>
            {/* Messages */}
            <button className="icon-btn" title="Messages">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </button>

            {/* Notifications */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button className="icon-btn" onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }} title="Notifications">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unreadCount > 0 && <span className="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
              </button>

              {notifOpen && (
                <div className="notif-panel">
                  <div className="notif-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} style={{ fontSize: 12, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '24px 16px', textAlign: 'center', color: '#aaa', fontSize: 14 }}>
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`} onClick={() => { if (n.link) router.push(n.link); setNotifOpen(false) }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {n.type === 'like' ? '❤️' : n.type === 'comment' ? '💬' : n.type === 'follow' ? '👋' : n.type === 'mention' ? '@' : '🔔'}
                        </div>
                        <div className="notif-content">
                          <div className="notif-text" dangerouslySetInnerHTML={{ __html: n.message }} />
                          <div className="notif-time">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</div>
                        </div>
                        {!n.read && <div className="notif-unread-dot" />}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Profile */}
            <div ref={profileRef} style={{ position: 'relative' }}>
              <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false) }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <div className="avatar" style={{ width: 34, height: 34, background: '#eff6ff', color: 'var(--blue)', fontSize: 13 }}>
                  {session.user?.image ? (
                    <img src={session.user.image} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    session.user?.name?.[0]?.toUpperCase()
                  )}
                </div>
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-email">{session.user?.email}</div>
                  <Link href={`/profile/${session.user?.id}`} className="dropdown-item" onClick={() => setProfileOpen(false)}>
                    Profile
                  </Link>
                  <Link href="/settings" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                    Settings
                  </Link>
                  {(session.user as any)?.role === 'ADMIN' && (
                    <Link href="/admin" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <div className="dropdown-divider" />
                  <div className="dropdown-item muted" onClick={() => {}}>Help center</div>
                  <div className="dropdown-divider" />
                  <div className="dropdown-item" onClick={() => signOut({ callbackUrl: '/' })}>Log out</div>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            onClick={() => signIn('google')}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            </svg>
            Log in
          </button>
        )}
      </div>
    </nav>
  )
}
