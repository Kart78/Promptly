'use client'
import { useState, useEffect } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { format } from 'timeago.js'
import toast from 'react-hot-toast'

interface Comment {
  id: string
  content: string
  createdAt: string
  author: { id: string; name: string; image?: string; role: string }
  _count: { likes: number }
  replies: Comment[]
}

interface Props {
  postId: string
  currentUser: { id: string; name: string; image?: string | null; role?: string } | null
  compact?: boolean
}

export function CommentSection({ postId, currentUser, compact }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then((r) => r.json())
      .then(setComments)
      .finally(() => setLoading(false))
  }, [postId])

  const submit = async (content: string, parentId?: string) => {
    if (!currentUser) { toast.error('Sign in to comment'); return }
    if (!content.trim()) return
    setSubmitting(true)
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, parentId }),
    })
    if (res.ok) {
      const newComment = await res.json()
      if (parentId) {
        setComments((prev) => prev.map((c) =>
          c.id === parentId ? { ...c, replies: [...(c.replies || []), newComment] } : c
        ))
        setReplyTo(null); setReplyText('')
      } else {
        setComments((prev) => [...prev, { ...newComment, replies: [] }])
        setText('')
      }
    } else toast.error('Failed to post comment')
    setSubmitting(false)
  }

  return (
    <div>
      {/* New comment input */}
      {currentUser && (
        <div className="flex gap-3 mb-4">
          <Avatar name={currentUser.name} image={currentUser.image} size="sm" role={currentUser.role} />
          <div className="flex-1">
            <textarea value={text} onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment…" rows={compact ? 2 : 3}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-300 resize-none transition-colors" />
            <button onClick={() => submit(text)} disabled={submitting || !text.trim()}
              className="mt-1.5 text-xs bg-brand-600 text-white px-3 py-1.5 rounded-lg hover:bg-brand-700 disabled:opacity-40 transition-colors font-medium">
              {submitting ? 'Posting…' : 'Comment'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1,2].map(i => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-100 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-100 rounded w-1/4" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        !currentUser && <p className="text-sm text-gray-400 text-center py-4">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id}>
              <CommentItem comment={comment} currentUser={currentUser}
                onReply={(id) => setReplyTo(replyTo === id ? null : id)} />
              {comment.replies?.length > 0 && (
                <div className="ml-10 mt-2 space-y-3 border-l-2 border-gray-50 pl-3">
                  {comment.replies.map((reply) => (
                    <CommentItem key={reply.id} comment={reply} currentUser={currentUser} />
                  ))}
                </div>
              )}
              {replyTo === comment.id && currentUser && (
                <div className="ml-10 mt-2 flex gap-2">
                  <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${comment.author.name}…`} rows={2}
                    className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-300 resize-none" />
                  <div className="flex flex-col gap-1">
                    <button onClick={() => submit(replyText, comment.id)} disabled={submitting}
                      className="text-xs bg-brand-600 text-white px-3 py-1.5 rounded-lg hover:bg-brand-700 disabled:opacity-40">Reply</button>
                    <button onClick={() => setReplyTo(null)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CommentItem({ comment, currentUser, onReply }: {
  comment: Comment
  currentUser: Props['currentUser']
  onReply?: (id: string) => void
}) {
  return (
    <div className="flex gap-3">
      <Avatar name={comment.author.name} image={comment.author.image} size="sm" role={comment.author.role} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className="text-sm font-semibold text-gray-900">{comment.author.name}</span>
          <span className="text-xs text-gray-400" title={new Date(comment.createdAt).toLocaleString()}>
            {format(new Date(comment.createdAt))}
          </span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
        {onReply && currentUser && (
          <button onClick={() => onReply(comment.id)}
            className="mt-1 text-xs text-gray-400 hover:text-brand-600 transition-colors font-medium">
            Reply
          </button>
        )}
      </div>
    </div>
  )
}
