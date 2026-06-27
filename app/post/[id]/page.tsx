import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'
import Link from 'next/link'
import { format } from 'timeago.js'
import { CommentSection } from '@/components/ui/CommentSection'

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/)
  return m ? m[1] : null
}

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { id: true, name: true, image: true, role: true, level: true } },
      _count: { select: { comments: true, likes: true } },
    },
  })

  if (!post) notFound()

  const youtubeId = post.youtubeUrl ? extractYouTubeId(post.youtubeUrl) : null

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-brand-600 mb-4 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to community
      </Link>

      <article className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-4">
        {/* YouTube embed */}
        {youtubeId && (
          <div className="w-full bg-black" style={{ aspectRatio: '16/9' }}>
            <iframe src={`https://www.youtube.com/embed/${youtubeId}`}
              className="w-full h-full" allowFullScreen title={post.title || 'YouTube video'} />
          </div>
        )}

        {/* Image */}
        {post.imageUrl && !youtubeId && (
          <div className="w-full overflow-hidden max-h-96">
            <img src={post.imageUrl} alt={post.title || 'Post image'} className="w-full object-cover" />
          </div>
        )}

        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <Link href={`/profile/${post.author.id}`}>
              <Avatar name={post.author.name || 'U'} image={post.author.image} size="md" role={post.author.role} />
            </Link>
            <div>
              <Link href={`/profile/${post.author.id}`} className="font-semibold text-sm hover:underline">
                {post.author.name}
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                <span title={new Date(post.createdAt).toLocaleString()}>{format(new Date(post.createdAt))}</span>
                <span>·</span>
                <span className="capitalize">{post.category}</span>
              </div>
            </div>
          </div>

          {post.title && <h1 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h1>}

          {/* Rendered content — links are clickable via CSS */}
          <div
            className="post-content text-sm text-gray-700 leading-relaxed [&_a]:text-brand-600 [&_a]:underline [&_a:hover]:text-brand-800 [&_a]:cursor-pointer [&_a]:pointer-events-auto [&_a]:relative [&_a]:z-10"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Link card */}
          {post.linkUrl && !youtubeId && !post.imageUrl && (
            <a href={post.linkUrl} target="_blank" rel="noreferrer"
              className="mt-3 flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-brand-600 hover:bg-gray-100 transition-colors">
              <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="truncate">{post.linkUrl}</span>
            </a>
          )}
        </div>
      </article>

      <CommentSection
        postId={post.id}
        currentUser={session?.user ? {
          id: session.user.id!,
          name: session.user.name!,
          image: session.user.image,
          role: (session.user as any).role,
        } : null}
      />
    </div>
  )
}
