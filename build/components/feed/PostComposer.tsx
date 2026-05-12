'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'
import { CATEGORIES } from '@/lib/constants'

export function PostComposer({ onPosted }: { onPosted?: () => void }) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('general')
  const [loading, setLoading] = useState(false)

  function handleOpen() {
    if (!session) { signIn('google'); return }
    setOpen(true)
  }

  async function handlePost() {
    if (!content.trim()) { toast.error('Write something first'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, category }),
      })
      if (!res.ok) throw new Error()
      toast.success('Posted!')
      setOpen(false)
      setTitle('')
      setContent('')
      setCategory('general')
      onPosted?.()
    } catch {
      toast.error('Failed to post')
    } finally {
      setLoading(false)
    }
  }

  const userImg = session?.user?.image
  const userName = session?.user?.name

  return (
    <>
      {/* Collapsed composer bar */}
      <div className="composer" onClick={handleOpen}>
        <div className="avatar" style={{ width: 36, height: 36, background: '#eff6ff', color: 'var(--blue)', flexShrink: 0 }}>
          {userImg ? (
            <img src={userImg} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <span>{userName?.[0]?.toUpperCase() || '?'}</span>
          )}
        </div>
        <span className="composer-placeholder">Write something</span>
      </div>

      {/* Full composer modal */}
      {open && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div className="modal-box">
            <div className="modal-header">
              <span>Create post</span>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888', lineHeight: 1 }}>×</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Category */}
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="form-input"
                style={{ width: 'auto', alignSelf: 'flex-start' }}
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              {/* Title */}
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title (optional)"
                className="form-input"
                style={{ fontWeight: 600, fontSize: 16 }}
              />
              {/* Body */}
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write something... Use @name to mention, #topic for hashtags"
                className="form-textarea"
                rows={6}
                autoFocus
              />
              {/* Toolbar */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { icon: '📷', label: 'Photo' },
                  { icon: '🎬', label: 'GIF' },
                  { icon: '📊', label: 'Poll' },
                  { icon: '📎', label: 'File' },
                  { icon: '@', label: 'Mention', style: { fontWeight: 700, fontSize: 14 } },
                  { icon: '#', label: 'Hashtag', style: { fontWeight: 700, fontSize: 14 } },
                ].map(t => (
                  <button key={t.label} title={t.label} className="btn-ghost" style={{ padding: '6px 10px', fontSize: 14, ...(t.style || {}) }}>
                    {t.icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <span style={{ fontSize: 13, color: '#aaa' }}>{content.length} chars</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
                <button className="btn-primary" onClick={handlePost} disabled={loading || !content.trim()}>
                  {loading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
