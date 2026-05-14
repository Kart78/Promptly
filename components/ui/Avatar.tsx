'use client'
import Image from 'next/image'
import { useState } from 'react'

interface AvatarProps {
  name: string
  image?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg'
  role?: string
}

const sizes = { xs: 'w-6 h-6 text-[10px]', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' }
const px = { xs: 24, sm: 32, md: 40, lg: 56 }

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

const COLORS = [
  'bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700', 'bg-amber-100 text-amber-700',
  'bg-pink-100 text-pink-700', 'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-700', 'bg-cyan-100 text-cyan-700',
]

function colorFor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

function isValidImageUrl(url: string): boolean {
  if (!url) return false
  // Allow data URLs (base64)
  if (url.startsWith('data:image/')) return true
  // Allow http/https URLs
  if (url.startsWith('http://') || url.startsWith('https://')) return true
  return false
}

export function Avatar({ name, image, size = 'md', role }: AvatarProps) {
  const [imgError, setImgError] = useState(false)
  const sizeClass = sizes[size]
  const pxSize = px[size]

  // FIX UX-05: admin ring
  const ringClass = role === 'ADMIN'
    ? 'ring-2 ring-brand-500 ring-offset-1'
    : role === 'MODERATOR'
    ? 'ring-2 ring-purple-400 ring-offset-1'
    : ''

  const base = `relative shrink-0 rounded-full overflow-hidden flex items-center justify-center font-semibold select-none ${sizeClass} ${ringClass}`

  const showImage = image && isValidImageUrl(image) && !imgError

  if (showImage) {
    // Use regular img tag for data URLs and external URLs (Next/Image doesn't support data: URLs)
    if (image!.startsWith('data:')) {
      return (
        <div className={base}>
          <img src={image!} alt={name} className="w-full h-full object-cover"
            onError={() => setImgError(true)} />
        </div>
      )
    }
    return (
      <div className={base}>
        <img src={image!} alt={name} width={pxSize} height={pxSize}
          className="object-cover w-full h-full"
          onError={() => setImgError(true)} />
      </div>
    )
  }

  return (
    <div className={`${base} ${colorFor(name)}`}>
      {initials(name)}
    </div>
  )
}
