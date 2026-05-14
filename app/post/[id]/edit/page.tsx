import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import { PostComposer } from '@/components/ui/PostComposer'

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const post = await prisma.post.findUnique({ where: { id: params.id } })
  if (!post) notFound()
  if (post.authorId !== session.user.id && (session.user as any).role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-lg font-semibold text-gray-900 mb-4">Edit post</h1>
      <PostComposer
        session={session}
        initialContent={post.content}
        initialTitle={post.title || ''}
        initialCategory={post.category}
        postId={post.id}
      />
    </div>
  )
}
