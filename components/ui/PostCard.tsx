'use client'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'
import { format } from 'timeago.js'
import { linkifyContent } from '@/lib/linkify'
import toast from 'react-hot-toast'

interface Post {
  id: string
  content: string
  title?: string | null
  category: string
  pinned: boolean
  createdAt: string | Date
  youtubeUrl?: string | null
  imageUrl?: string | null
  linkUrl?: string | null
  linkTitle?: string | null
  author: { id: string; name: string | null; image?: string | null; role: string; level: number }
  _count: { comments: number; likes: number }
  likes?: { id: string }[]
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/)
  return m ? m[1] : null
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').trim()
}

// FIX: detect base64 or broken image in content
function extractImageFromContent(content: string): string | null {
  const match = content.match(/src="(data:image[^"]+)"/)
  return match ? match[1] : null
}

interface Props { post: Post; currentUserId?: string; onClick?: () => void }

export function PostCard({ post, currentUserId, onClick }: Props) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [liked, setLiked] = useState((post.likes?.length ?? 0) > 0)
  const [likeCount, setLikeCount] = useState(post._count.likes)
  const [deleted, setDeleted] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const isAuthor = currentUserId && currentUserId === post.author.id

  const youtubeId = post.youtubeUrl ? getYouTubeId(post.youtubeUrl) : null
  // Extract image if stored in content instead of imageUrl field
  const embeddedImage = !post.imageUrl ? extractImageFromContent(post.content) : null
  const displayImage = post.imageUrl || embeddedImage
  // Strip base64 from display content
  const cleanContent = embeddedImage
    ? post.content.replace(/<img[^>]+>/g, '').replace(/<p><\/p>/g, '').trim()
    : post.content
  const plainText = stripHtml(cleanContent)
  const linkedContent = linkifyContent(cleanContent)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  if (deleted) return null

  const handleCardClick = (e: React.MouseEvent) => {
    // Allow clicks on anchor tags inside post content to open links
    const target = e.target as HTMLElement
    if (target.tagName === 'A' || target.closest('a[href]')) return
    if ((e.target as HTMLElement).closest('[data-no-nav]')) return
    if (onClick) { onClick(); return }
    router.push(`/post/${post.id}`)
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!currentUserId) { toast.error('Sign in to like posts'); return }
    setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1)
    await fetch(`/api/posts/${post.id}/like`, { method: 'POST' })
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); setMenuOpen(false)
    if (!confirm('Delete this post?')) return
    const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Post deleted'); setDeleted(true) }
    else toast.error('Failed to delete')
  }

  return (
    <div
      className="group bg-white border border-gray-100 rounded-xl overflow-hidden cursor-pointer transition-all duration-150 hover:border-gray-200 hover:shadow-sm"
      onClick={handleCardClick}
    >
      {/* YouTube embed — full width like Skool */}
      {youtubeId && (
        <div className="w-full bg-black relative" style={{ aspectRatio: '16/9' }}
          data-no-nav onClick={(e) => e.stopPropagation()}>
          <iframe src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
            className="w-full h-full" allowFullScreen loading="lazy" title={post.title || 'Video'} />
        </div>
      )}

      {/* Image — full width */}
      {displayImage && !youtubeId && (
        <div className="w-full overflow-hidden max-h-80 bg-gray-50">
          <img src={displayImage} alt={post.title || 'Post image'}
            className="w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            loading="lazy" />
        </div>
      )}

      <div className="p-4">
        {post.pinned && (
          <div className="flex items-center gap-1 text-xs text-amber-600 mb-2 font-medium">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Pinned
          </div>
        )}

        <div className="flex items-start gap-3">
          <div data-no-nav onClick={(e) => e.stopPropagation()} className="shrink-0">
            <Link href={`/profile/${post.author.id}`}>
              <Avatar name={post.author.name || 'U'} image={post.author.image} size="md" role={post.author.role} />
            </Link>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <div data-no-nav onClick={(e) => e.stopPropagation()}>
                <Link href={`/profile/${post.author.id}`} className="font-semibold text-sm text-gray-900 hover:underline">
                  {post.author.name}
                </Link>
              </div>
              <span className="text-xs font-medium text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-full">{post.author.level}</span>
              <span className="text-xs text-gray-400" title={new Date(post.createdAt).toLocaleString()}>
                · {format(new Date(post.createdAt))}
              </span>
              <span className="text-xs text-gray-400">·</span>
              <Link href={`/?category=${post.category}`} className="text-xs text-gray-400 hover:text-brand-600 capitalize"
                data-no-nav onClick={(e) => e.stopPropagation()}>{post.category}</Link>
            </div>

            {post.title && <h3 className="font-semibold text-gray-900 mb-1 text-[15px] leading-snug">{post.title}</h3>}
            {plainText && <div className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-2 post-content" dangerouslySetInnerHTML={{ __html: linkifyContent(cleanContent) }} />}

            {/* Link preview card */}
            {post.linkUrl && !youtubeId && !displayImage && (
              <a href={post.linkUrl} target="_blank" rel="noreferrer"
                data-no-nav onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-brand-600 hover:bg-gray-100 mb-2 truncate">
                <svg className="w-3.5 h-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span className="truncate">{post.linkTitle || post.linkUrl}</span>
              </a>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 mt-2" data-no-nav onClick={(e) => e.stopPropagation()}>
              <button onClick={handleLike}
                className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'}`}>
                <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-xs">{likeCount > 0 ? likeCount : 'Like'}</span>
              </button>
              <button onClick={(e) => { e.stopPropagation(); if (onClick) onClick(); else router.push(`/post/${post.id}`) }}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-brand-500 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-xs">{post._count.comments > 0 ? post._count.comments : 'Comment'}</span>
              </button>
            </div>
          </div>

          {/* Author menu */}
          {isAuthor && (
            <div className="relative shrink-0" ref={menuRef} data-no-nav onClick={(e) => e.stopPropagation()}>
              <button onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
                </svg>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-8 w-40 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-30">
                  <Link href={`/post/${post.id}/edit`}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={(e) => e.stopPropagation()}>
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Edit post
                  </Link>
                  <button onClick={handleDelete}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Delete post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
