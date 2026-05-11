'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Heart, MessageCircle, Pin } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { getLevelFromXP } from '@/lib/constants'
import type { PostWithAuthor } from '@/types'

interface Props {
  post: PostWithAuthor
  currentUserId?: string
}

export function PostCard({ post, currentUserId }: Props) {
  const [liked, setLiked] = useState(post.likes?.some(l => l.userId === currentUserId))
  const [likeCount, setLikeCount] = useState(post._count.likes)
  const level = getLevelFromXP(post.author.xp || 0)

  async function handleLike() {
    if (!currentUserId) return
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
    await fetch(`/api/likes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: post.id }),
    })
  }

  return (
    <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-4 hover:border-[#2a2a2a] transition-colors">
      {post.pinned && (
        <div className="flex items-center gap-1.5 text-xs text-[#c9a96e] font-mono mb-3">
          <Pin size={11} /> PINNED
        </div>
      )}

      <div className="flex gap-3">
        {/* Avatar */}
        <Link href={`/profile/${post.author.username || post.author.id}`}>
          {post.author.image ? (
            <Image
              src={post.author.image}
              alt={post.author.name || ''}
              width={36}
              height={36}
              className="rounded-full flex-shrink-0 hover:opacity-80 transition-opacity"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#c9a96e] flex items-center justify-center text-sm font-bold text-[#0e0e0e]">
              {post.author.name?.[0]}
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          {/* Author row */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Link
              href={`/profile/${post.author.username || post.author.id}`}
              className="text-sm font-medium text-[#e8e4dc] hover:text-[#c9a96e] transition-colors"
            >
              {post.author.name}
            </Link>
            <span className="text-xs font-mono text-[#c9a96e] bg-[#c9a96e]/10 px-1.5 py-0.5 rounded">
              {level.level}
            </span>
            <span className="text-xs text-[#444]">·</span>
            <span className="text-xs text-[#444]">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
            <span className="text-xs font-mono text-[#333] border border-[#222] px-1.5 py-0.5 rounded">
              {post.category}
            </span>
          </div>

          {/* Content */}
          {post.title && (
            <p className="text-base font-medium text-[#f0ece4] mb-1">{post.title}</p>
          )}
          <p className="text-sm text-[#aaa] leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs transition-colors ${
                liked ? 'text-red-400' : 'text-[#555] hover:text-red-400'
              }`}
            >
              <Heart size={13} fill={liked ? 'currentColor' : 'none'} />
              {likeCount}
            </button>
            <Link
              href={`/post/${post.id}`}
              className="flex items-center gap-1.5 text-xs text-[#555] hover:text-[#888] transition-colors"
            >
              <MessageCircle size={13} />
              {post._count.comments}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
