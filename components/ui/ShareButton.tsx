'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
  postId: string
  title?: string | null
  className?: string
  /** 'icon' for a compact icon-only button, 'full' for icon + label */
  variant?: 'icon' | 'full'
}

export function ShareButton({ postId, title, className = '', variant = 'full' }: Props) {
  const [copied, setCopied] = useState(false)

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `${window.location.origin}/post/${postId}`

    // Prefer the native share sheet on mobile/supported browsers
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: title || 'Check out this post', url })
        return
      } catch {
        // user cancelled the share sheet — fall through to nothing
        return
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy link')
    }
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        title="Copy link to this post"
        onClick={handleShare}
        className={`flex items-center justify-center rounded-full transition-colors ${className}`}
      >
        {copied ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342a3 3 0 100-2.684m0 2.684a3 3 0 100 2.684m0-2.684l6.632 3.316m0 0a3 3 0 105.98.335 3 3 0 00-5.98-.335zm0-8.684a3 3 0 105.98-.335 3 3 0 00-5.98.335zm0 0L8.684 10.658" />
          </svg>
        )}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`flex items-center gap-1.5 text-sm transition-colors ${className}`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342a3 3 0 100-2.684m0 2.684a3 3 0 100 2.684m0-2.684l6.632 3.316m0 0a3 3 0 105.98.335 3 3 0 00-5.98-.335zm0-8.684a3 3 0 105.98-.335 3 3 0 00-5.98.335zm0 0L8.684 10.658" />
      </svg>
      {copied ? 'Copied!' : 'Share'}
    </button>
  )
}
