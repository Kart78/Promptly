'use client'
import { useState, useEffect, useRef } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { CommentSection } from '@/components/ui/CommentSection'
import { format } from 'timeago.js'
import { linkifyContent } from '@/lib/linkify'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Post {
  id: string
  title?: string | null
  content: string
  category: string
  youtubeUrl?: string | null
  imageUrl?: string | null
  linkUrl?: string | null
  createdAt: string | Date
  author: { id: string; name: string | null; image?: string | null; role: string; level: number }
  _count: { comments: number; likes: number }
  likes?: { id: string }[]
}

interface Props {
  post: Post
  currentUser: { id: string; name: string; image?: string | null; role?: string } | null
  onClose: () => void
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/)
  return m ? m[1] : null
}

function extractImageFromContent(content: string): string | null {
  const match = content.match(/src="(data:image[^"]+)"/)
  return match ? match[1] : null
}

export function PostModal({ post, currentUser, onClose }: Props) {
  const [liked, setLiked] = useState((post.likes?.length ?? 0) > 0)
  const [likeCount, setLikeCount] = useState(post._count.likes)
  const overlayRef = useRef<HTMLDivElement>(null)
  const youtubeId = post.youtubeUrl ? getYouTubeId(post.youtubeUrl) : null
  const embeddedImage = !post.imageUrl ? extractImageFromContent(post.content) : null
  const displayImage = post.imageUrl || embeddedImage
  const cleanContent = embeddedImage
    ? post.content.replace(/<img[^>]+>/g, '').replace(/<p><\/p>/g, '').trim()
    : post.content

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleLike = async () => {
    if (!currentUser) { toast.error('Sign in to like'); return }
    setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1)
    await fetch(`/api/posts/${post.id}/like`, { method: 'POST' })
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 pt-8 overflow-y-auto"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Close button */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        {/* YouTube embed */}
        {youtubeId && (
          <div className="w-full bg-black" style={{ aspectRatio: '16/9' }}>
            <iframe src={`https://www.youtube.com/embed/${youtubeId}?rel=0&autoplay=0`}
              className="w-full h-full" allowFullScreen title={post.title || 'Video'} />
          </div>
        )}

        {/* Image */}
        {displayImage && !youtubeId && (
          <div className="w-full overflow-hidden max-h-80 bg-gray-50">
            <img src={displayImage} alt={post.title || 'Post image'} className="w-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          </div>
        )}

        <div className="p-5">
          {/* Author row */}
          <div className="flex items-start gap-3 mb-4">
            <Link href={`/profile/${post.author.id}`} onClick={onClose}>
              <Avatar name={post.author.name || 'U'} image={post.author.image} size="md" role={post.author.role} />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Link href={`/profile/${post.author.id}`} onClick={onClose}
                  className="font-semibold text-sm text-gray-900 hover:underline">{post.author.name}</Link>
                <span className="text-xs bg-brand-50 text-brand-600 px-1.5 py-0.5 rounded-full font-medium">Lv.{post.author.level}</span>
                <span className="text-xs text-gray-400" title={new Date(post.createdAt).toLocaleString()}>
                  · {format(new Date(post.createdAt))}
                </span>
                <span className="text-xs text-gray-400 capitalize">· {post.category}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          {post.title && <h2 className="text-lg font-bold text-gray-900 mb-3 leading-snug">{post.title}</h2>}

          {/* Content */}
          <div
            className="post-content text-sm text-gray-700 leading-relaxed mb-4 [&_a]:text-brand-600 [&_a]:underline [&_a]:cursor-pointer [&_a]:pointer-events-auto [&_a]:relative [&_a]:z-10 [&_a:hover]:text-brand-800"
            dangerouslySetInnerHTML={{ __html: linkifyContent(cleanContent) }}
          />

          {/* Link card */}
          {post.linkUrl && !youtubeId && !displayImage && (
            <a href={post.linkUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-brand-600 hover:bg-gray-100 mb-4">
              <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              <span className="truncate">{post.linkUrl}</span>
            </a>
          )}

          {/* Like + comment count */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <button onClick={handleLike}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'}`}>
              <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              {likeCount > 0 ? likeCount : 'Like'}
            </button>
            <span className="text-sm text-gray-400">
              <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              {post._count.comments} comment{post._count.comments !== 1 ? 's' : ''}
            </span>
            <Link href={`/post/${post.id}`} onClick={onClose}
              className="ml-auto text-xs text-gray-400 hover:text-brand-600 transition-colors">
              Open full page →
            </Link>
          </div>

          {/* Comments */}
          <div className="mt-4">
            <CommentSection postId={post.id} currentUser={currentUser} compact />
          </div>
        </div>
      </div>
    </div>
  )
}
