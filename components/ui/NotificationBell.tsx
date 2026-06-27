'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { format } from 'timeago.js'

interface Notification {
  id: string
  type: string
  message: string
  read: boolean
  link: string | null
  createdAt: string
}

const TYPE_ICON: Record<string, string> = {
  LIKE: '❤️',
  COMMENT: '💬',
  FOLLOW: '👤',
  MENTION: '@',
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const unread = notifications.filter((n) => !n.read).length

  // Fetch notifications when bell is opened
  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) setNotifications(await res.json())
    } finally {
      setLoading(false)
    }
  }

  // Poll for new notifications every 30s
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30_000)
    return () => clearInterval(interval)
  }, [])

  // Mark all read when dropdown opens
  const handleOpen = async () => {
    setOpen(!open)
    if (!open && unread > 0) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      await fetch('/api/notifications', { method: 'PATCH' })
    }
  }

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        {/* Bell icon */}
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {/* Unread badge */}
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">Notifications</p>
            {notifications.length > 0 && (
              <button
                onClick={async () => {
                  setNotifications([])
                  await fetch('/api/notifications', { method: 'PATCH' })
                }}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Clear all
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">Loading…</div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-2xl mb-2">🔔</p>
                <p className="text-sm text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link || '/'}
                  onClick={() => setOpen(false)}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${!n.read ? 'bg-brand-50/40' : ''}`}
                >
                  <span className="text-base mt-0.5 shrink-0">{TYPE_ICON[n.type] || '🔔'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-snug">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{format(new Date(n.createdAt))}</p>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 bg-brand-500 rounded-full shrink-0 mt-1.5" />
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
