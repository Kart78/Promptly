'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
  targetId: string
  initialFollowing: boolean
  targetName: string
}

export function FollowButton({ targetId, initialFollowing, targetName }: Props) {
  const [following, setFollowing] = useState(initialFollowing)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setLoading(true)
    setFollowing(!following)
    const res = await fetch(`/api/users/${targetId}/follow`, { method: 'POST' })
    if (!res.ok) {
      setFollowing(following)
      toast.error('Something went wrong')
    } else {
      toast.success(following ? `Unfollowed ${targetName}` : `Following ${targetName}!`)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`w-full text-sm py-2 rounded-xl font-medium transition-colors ${
        following
          ? 'border border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600 hover:bg-red-50'
          : 'bg-brand-600 text-white hover:bg-brand-700'
      }`}
    >
      {loading ? '…' : following ? 'Following' : 'Follow'}
    </button>
  )
}
