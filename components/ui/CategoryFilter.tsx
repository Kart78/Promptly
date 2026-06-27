'use client'
import Link from 'next/link'

interface CategoryFilterProps {
  categories: { value: string; label: string }[]
  active: string
}

export function CategoryFilter({ categories, active }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map(({ value, label }) => {
        const isActive = (active === 'all' && value === 'all') || active === value
        const href = value === 'all' ? '/' : `/?category=${value}`
        return (
          <Link
            key={value}
            href={href}
            // FIX UX-03: active pill has solid fill
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
              isActive
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
