import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'USER' | 'ADMIN'
      username?: string | null
      xp: number
    } & DefaultSession['user']
  }
}

export interface PostWithAuthor {
  id: string
  title: string | null
  content: string
  category: string
  pinned: boolean
  createdAt: Date
  author: {
    id: string
    name: string | null
    image: string | null
    username: string | null
    xp: number
  }
  _count: {
    comments: number
    likes: number
  }
  likes: { userId: string }[]
}

export interface AppItem {
  id: string
  name: string
  description: string
  url: string | null
  githubUrl: string | null
  tag: string
  status: 'LIVE' | 'IN_PROGRESS' | 'ARCHIVED'
  featured: boolean
  icon: string | null
}
