'use client'
import { useState } from 'react'
import { PostCard } from '@/components/ui/PostCard'
import { PostModal } from '@/components/ui/PostModal'

interface Props {
  posts: any[]
  currentUser: { id: string; name: string; image?: string | null; role?: string } | null
}

export function FeedWithModal({ posts, currentUser }: Props) {
  const [selectedPost, setSelectedPost] = useState<any | null>(null)

  return (
    <>
      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="text-4xl mb-3">💬</div>
            <p className="font-medium text-gray-600">No posts yet</p>
            <p className="text-sm mt-1">Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUser?.id}
              onClick={() => setSelectedPost(post)}
            />
          ))
        )}
      </div>

      {/* Skool-style post popup modal */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          currentUser={currentUser}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  )
}
