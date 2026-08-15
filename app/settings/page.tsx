'use client'
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fetched, setFetched] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Community branding (admin only)
  const [communityName, setCommunityName] = useState('')
  const [communityUrl, setCommunityUrl] = useState('')
  const [communityDesc, setCommunityDesc] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  const [communityFetched, setCommunityFetched] = useState(false)
  const [communityLoading, setCommunityLoading] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const logoFileRef = useRef<HTMLInputElement>(null)
  const bannerFileRef = useRef<HTMLInputElement>(null)

  const userId = session?.user?.id as string | undefined
  const isAdmin = (session?.user as any)?.role === 'ADMIN'

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

  useEffect(() => {
    if (isAdmin && !communityFetched) {
      fetch('/api/community')
        .then((r) => r.json())
        .then((c) => {
          setCommunityName(c.name || '')
          setCommunityUrl(c.url || '')
          setCommunityDesc(c.description || '')
          setLogoUrl(c.logoUrl || '')
          setBannerUrl(c.bannerUrl || '')
          setCommunityFetched(true)
        })
    }
  }, [isAdmin, communityFetched])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 flex justify-center">
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Only image files allowed'); return }
    if (file.size > 10 * 1024 * 1024) { toast.error('Image must be under 10MB'); return }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      setImage(url)
      toast.success('Photo uploaded — click Save changes to apply')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const uploadCommunityImage = async (
    file: File,
    setUrl: (u: string) => void,
    setBusy: (b: boolean) => void,
    ref: React.RefObject<HTMLInputElement>
  ) => {
    if (!file.type.startsWith('image/')) { toast.error('Only image files allowed'); return }
    if (file.size > 10 * 1024 * 1024) { toast.error('Image must be under 10MB'); return }
    setBusy(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      setUrl(url)
      toast.success('Uploaded — click Save community branding to apply')
    } catch {
      toast.error('Upload failed')
    } finally {
      setBusy(false)
      if (ref.current) ref.current.value = ''
    }
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

  const handleSaveCommunity = async () => {
    setCommunityLoading(true)
    try {
      const res = await fetch('/api/community', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: communityName,
          url: communityUrl,
          description: communityDesc,
          logoUrl: logoUrl || null,
          bannerUrl: bannerUrl || null,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Community branding updated!')
      router.refresh()
    } catch {
      toast.error('Failed to save community branding')
    } finally {
      setCommunityLoading(false)
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
            <p className="text-xs text-gray-500 mb-1">Profile photo</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="text-xs font-medium border border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                {uploading ? 'Uploading…' : 'Upload photo'}
              </button>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="or paste an image URL…"
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-brand-400 transition-colors"
              />
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <p className="text-xs text-gray-400 mt-1">Upload an image (under 10MB) or paste a direct image URL</p>
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

      {isAdmin && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mt-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Community branding</h2>
          <p className="text-xs text-gray-400 mb-4">Admin only — controls the logo, banner, and info shown in the sidebar.</p>

          <div className="mb-4">
            <p className="text-xs font-medium text-gray-600 mb-1">Banner image</p>
            {bannerUrl && (
              <img src={bannerUrl} alt="" className="w-full rounded-lg mb-2 object-cover" style={{ aspectRatio: '2.5 / 1' }} />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => bannerFileRef.current?.click()}
                disabled={uploadingBanner}
                className="text-xs font-medium border border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                {uploadingBanner ? 'Uploading…' : 'Upload banner'}
              </button>
              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="or paste an image URL…"
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-brand-400 transition-colors"
              />
            </div>
            <input
              ref={bannerFileRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) uploadCommunityImage(file, setBannerUrl, setUploadingBanner, bannerFileRef)
              }}
              className="hidden"
            />
          </div>

          <div className="flex items-center gap-4 mb-5">
            {logoUrl ? (
              <img src={logoUrl} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-brand-600 text-white text-xl font-bold flex items-center justify-center shrink-0">
                {communityName[0]?.toUpperCase() || 'P'}
              </div>
            )}
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-600 mb-1">Logo / thumbnail</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => logoFileRef.current?.click()}
                  disabled={uploadingLogo}
                  className="text-xs font-medium border border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  {uploadingLogo ? 'Uploading…' : 'Upload logo'}
                </button>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="or paste an image URL…"
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-brand-400 transition-colors"
                />
              </div>
              <input
                ref={logoFileRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) uploadCommunityImage(file, setLogoUrl, setUploadingLogo, logoFileRef)
                }}
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Community name</label>
              <input
                type="text"
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
                maxLength={50}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-brand-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
              <input
                type="text"
                value={communityUrl}
                onChange={(e) => setCommunityUrl(e.target.value)}
                maxLength={80}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-brand-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea
                value={communityDesc}
                onChange={(e) => setCommunityDesc(e.target.value)}
                rows={3}
                maxLength={200}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-brand-400 transition-colors resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleSaveCommunity}
            disabled={communityLoading || !communityName.trim()}
            className="mt-4 w-full bg-brand-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 transition-colors"
          >
            {communityLoading ? 'Saving…' : 'Save community branding'}
          </button>
        </div>
      )}
    </div>
  )
}
