'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)

  const userId = session?.user?.id as string | undefined

  useEffect(() => {
    if (userId && !fetched) {
      fetch(`/api/users/${userId}`)
        .then((r) => r.json())
        .then((u) => {
          setName(u.name || '')
          setBio(u.bio || '')
          setImage(u.image || '')
          setFetched(true)
        })
    }
  }, [userId, fetched])

  if (!session?.user) {
    router.push('/login')
    return null
  }

  const handleSave = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, image: image || null }),
      })
      if (!res.ok) throw new Error()
      await update({ name, image: image || null })
      toast.success('Profile updated!')
      router.refresh()
    } catch {
      toast.error('Failed to save changes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Settings</h1>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Profile</h2>

        <div className="flex items-center gap-4 mb-5">
          <Avatar name={name || 'U'} image={image || null} size="lg" role={(session.user as any).role} />
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Profile photo URL</p>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://…"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-brand-400 transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">Paste a direct image URL (e.g. from Gravatar or Cloudinary)</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Display name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-brand-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the community about yourself…"
              rows={3}
              maxLength={160}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-brand-400 transition-colors resize-none"
            />
            <p className="text-xs text-gray-400 text-right">{bio.length}/160</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading || !name.trim()}
          className="mt-4 w-full bg-brand-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Account</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Email</span>
            <span className="text-sm text-gray-700">{session.user.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Role</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium capitalize">
              {((session.user as any).role || 'member').toLowerCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
