'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { CATEGORIES } from '@/lib/constants'

export function PostComposer() {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('general')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!content.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, category }),
      })
      if (!res.ok) throw new Error()
      setContent('')
      toast.success('Posted!')
      window.location.reload()
    } catch {
      toast.error('Failed to post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-4">
      <div className="flex gap-3">
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt=""
            width={36}
            height={36}
            className="rounded-full flex-shrink-0 mt-1"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-[#c9a96e] flex items-center justify-center text-sm font-bold text-[#0e0e0e] flex-shrink-0">
            {session?.user?.name?.[0]}
          </div>
        )}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Share something with the community..."
            rows={3}
            className="w-full bg-transparent text-[#e8e4dc] placeholder-[#444] text-sm resize-none outline-none"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1e1e1e]">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="bg-[#0e0e0e] border border-[#2a2a2a] text-[#888] text-xs rounded-lg px-2 py-1 outline-none"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
            <button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="flex items-center gap-2 bg-[#c9a96e] text-[#0e0e0e] text-sm font-medium px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              <Send size={13} />
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
