'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

interface FollowButtonProps {
  targetId: string
  initialFollowing: boolean
  targetName: string
}

export function FollowButton({ targetId, initialFollowing, targetName }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing)
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch('/api/follow', {
        method: following ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong')
      }

      setFollowing((prev) => !prev)
      toast.success(following ? `Unfollowed ${targetName}` : `Following ${targetName}`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to update follow')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`w-full text-sm py-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        following
          ? 'border border-gray-200 text-gray-700 hover:bg-gray-50'
          : 'bg-brand-500 text-white hover:bg-brand-600'
      }`}
    >
      {loading ? '...' : following ? 'Following' : 'Follow'}
    </button>
  )
}
