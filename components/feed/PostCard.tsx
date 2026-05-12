'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { getLevelFromXP } from '@/lib/constants'

interface Post {
  id: string
  title: string | null
  content: string
  category: string
  pinned: boolean
  createdAt: string
  author: { id: string; name: string | null; image: string | null; username: string | null; xp: number }
  _count: { comments: number; likes: number }
  likes: { userId: string }[]
  recentCommenters?: { image: string | null; name: string | null }[]
  lastCommentAt?: string | null
}

interface Props {
  post: Post
  currentUserId?: string
  onClick?: () => void
}

function renderContent(text: string) {
  return text
    .replace(/@(\w+)/g, '<span class="mention">@$1</span>')
    .replace(/#(\w+)/g, '<span class="hashtag">#$1</span>')
}

export function PostCard({ post, currentUserId, onClick }: Props) {
  const router = useRouter()
  const [liked, setLiked] = useState(post.likes?.some(l => l.userId === currentUserId) ?? false)
  const [likeCount, setLikeCount] = useState(post._count.likes)
  const level = getLevelFromXP(post.author.xp || 0)

  async function handleLike(e: React.MouseEvent) {
    e.stopPropagation()
    if (!currentUserId) { router.push('/auth/signin'); return }
    const wasLiked = liked
    setLiked(!wasLiked)
    setLikeCount(wasLiked ? likeCount - 1 : likeCount + 1)
    await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: post.id }),
    })
  }

  function handleCardClick() {
    if (onClick) onClick()
    else router.push(`/post/${post.id}`)
  }

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: false })
  const lastComment = post.lastCommentAt
    ? formatDistanceToNow(new Date(post.lastCommentAt), { addSuffix: true })
    : null

  return (
    <div className="post-card" onClick={handleCardClick}>
      {post.pinned && (
        <div className="post-pin-bar">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L8 8H2l5 5-1.5 7L12 17l6.5 3L17 13l5-5h-6z"/></svg>
          Pinned
        </div>
      )}

      <div className="post-header">
        <Link href={`/profile/${post.author.username || post.author.id}`} onClick={e => e.stopPropagation()}>
          <div className="avatar" style={{ width: 40, height: 40, background: '#eff6ff', color: 'var(--blue)', fontSize: 15 }}>
            {post.author.image ? (
              <img src={post.author.image} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              post.author.name?.[0]?.toUpperCase()
            )}
          </div>
        </Link>

        <div className="post-meta">
          <div className="post-author-row">
            <Link href={`/profile/${post.author.username || post.author.id}`} className="post-author" onClick={e => e.stopPropagation()}>
              {post.author.name}
            </Link>
            <div className="level-badge" title={`Level ${level.level} — ${level.label}`}>
              {level.level}
            </div>
          </div>
          <div className="post-meta-row">
            <span>{timeAgo}</span>
            <span>·</span>
            <span className="cat-link">{post.category}</span>
          </div>
        </div>
      </div>

      {post.title && <div className="post-title">{post.title}</div>}

      <div
        className="post-body"
        dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
      />

      <div className="post-footer">
        <button className={`post-action ${liked ? 'liked' : ''}`} onClick={handleLike}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? '#ef4444' : 'none'} stroke={liked ? '#ef4444' : 'currentColor'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {likeCount > 0 && likeCount}
        </button>

        <button className="post-action" onClick={e => { e.stopPropagation(); handleCardClick() }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {post._count.comments > 0 && post._count.comments}
        </button>

        {/* Recent commenter avatars */}
        {post.recentCommenters && post.recentCommenters.length > 0 && (
          <div className="comment-avatars">
            {post.recentCommenters.slice(0, 4).map((c, i) => (
              <div key={i} className="avatar" style={{ width: 20, height: 20, fontSize: 8, background: '#e5e7eb', color: '#555', border: '2px solid white', marginLeft: i === 0 ? 0 : -6 }}>
                {c.image ? (
                  <img src={c.image} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : c.name?.[0]?.toUpperCase()}
              </div>
            ))}
          </div>
        )}

        {lastComment && (
          <span className="new-comment-badge">New comment {lastComment}</span>
        )}
      </div>
    </div>
  )
}
