'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

interface Comment {
  id: string
  content: string
  createdAt: Date
  author: { id: string; name: string | null; image: string | null; username: string | null }
}

interface Props {
  postId: string
  comments: Comment[]
  currentUser?: { id: string; name?: string | null; image?: string | null } | null
}

export function CommentSection({ postId, comments: initialComments, currentUser }: Props) {
  const [comments, setComments] = useState(initialComments)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleComment() {
    if (!content.trim() || !currentUser) return
    setLoading(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content }),
      })
      const comment = await res.json()
      setComments(prev => [...prev, { ...comment, author: currentUser }])
      setContent('')
    } catch {
      toast.error('Failed to comment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 bg-[#141414] border border-[#1e1e1e] rounded-xl p-4">
      <p className="text-xs font-mono text-[#555] tracking-widest uppercase mb-4">
        {comments.length} Comment{comments.length !== 1 ? 's' : ''}
      </p>

      {/* Composer */}
      {currentUser && (
        <div className="flex gap-3 mb-6">
          {currentUser.image ? (
            <Image src={currentUser.image} alt="" width={32} height={32} className="rounded-full flex-shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#c9a96e] flex items-center justify-center text-xs font-bold text-[#0e0e0e] flex-shrink-0">
              {currentUser.name?.[0]}
            </div>
          )}
          <div className="flex-1">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write a comment..."
              rows={2}
              className="w-full bg-[#0e0e0e] border border-[#2a2a2a] rounded-lg p-2.5 text-sm text-[#e8e4dc] placeholder-[#444] resize-none outline-none focus:border-[#444]"
            />
            <button
              onClick={handleComment}
              disabled={loading || !content.trim()}
              className="mt-2 text-xs bg-[#c9a96e] text-[#0e0e0e] font-medium px-3 py-1.5 rounded-lg hover:opacity-90 disabled:opacity-40"
            >
              {loading ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </div>
      )}

      {/* Comments list */}
      <div className="flex flex-col gap-4">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-3">
            {comment.author.image ? (
              <Image src={comment.author.image} alt="" width={28} height={28} className="rounded-full flex-shrink-0 mt-0.5" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#c9a96e] flex items-center justify-center text-xs font-bold text-[#0e0e0e] flex-shrink-0">
                {comment.author.name?.[0]}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link href={`/profile/${comment.author.username || comment.author.id}`}
                  className="text-sm font-medium text-[#e8e4dc] hover:text-[#c9a96e] transition-colors">
                  {comment.author.name}
                </Link>
                <span className="text-xs text-[#444]">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-[#aaa] leading-relaxed">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
