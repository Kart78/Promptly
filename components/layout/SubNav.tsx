'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { label: 'Community', href: '/' },
  { label: 'Classroom', href: '/classroom' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'Members', href: '/members' },
  { label: 'Leaderboards', href: '/leaderboards' },
  { label: 'About', href: '/about' },
]

export function SubNav() {
  const pathname = usePathname()
  return (
    <div className="subnav">
      {TABS.map(tab => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`subnav-item ${pathname === tab.href ? 'active' : ''}`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
