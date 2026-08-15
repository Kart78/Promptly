'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExt from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Color from '@tiptap/extension-color'
import { FontSize } from '@/lib/tiptap-font-size'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Avatar } from '@/components/ui/Avatar'

const FONT_FAMILIES = [
  { label: 'Default', value: '' },
  { label: 'Sans', value: 'ui-sans-serif, system-ui, sans-serif' },
  { label: 'Serif', value: 'ui-serif, Georgia, serif' },
  { label: 'Mono', value: 'ui-monospace, "SFMono-Regular", monospace' },
  { label: 'Comic', value: '"Comic Sans MS", "Comic Sans", cursive' },
  { label: 'Cursive', value: '"Brush Script MT", cursive' },
]

const FONT_SIZES = [
  { label: 'Small', value: '12px' },
  { label: 'Normal', value: '' },
  { label: 'Medium', value: '18px' },
  { label: 'Large', value: '24px' },
  { label: 'X-Large', value: '32px' },
]

const CATEGORIES = [
  { value: 'general', label: '💬 General Discussion' },
  { value: 'showcase', label: '🚀 App Showcase' },
  { value: 'aviation', label: '✈️ Aviation & Travel' },
  { value: 'ai', label: '🤖 AI & Tools' },
  { value: 'youtube', label: '📹 YouTube' },
  { value: 'resources', label: '📚 Resources' },
]

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/)
  return m ? m[1] : null
}

function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com|youtu\.be)/.test(url)
}

interface Props {
  session: any
  initialContent?: string
  initialTitle?: string
  initialCategory?: string
  initialYoutubeUrl?: string
  initialImageUrl?: string
  postId?: string
  onSuccess?: () => void
}

export function PostComposer({
  session, initialContent = '', initialTitle = '', initialCategory = 'general',
  initialYoutubeUrl = '', initialImageUrl = '', postId, onSuccess,
}: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(initialTitle)
  const [category, setCategory] = useState(initialCategory)
  const [expanded, setExpanded] = useState(!!postId)
  const [loading, setLoading] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState(initialYoutubeUrl)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl || null)
  const [imageStoredUrl, setImageStoredUrl] = useState(initialImageUrl)
  const [attachedLinkUrl, setAttachedLinkUrl] = useState('')
  const [activeMedia, setActiveMedia] = useState<'youtube' | 'image' | 'link' | null>(
    initialYoutubeUrl ? 'youtube' : initialImageUrl ? 'image' : null
  )
  const [showMediaPanel, setShowMediaPanel] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkInputValue, setLinkInputValue] = useState('')
  const [youtubeInput, setYoutubeInput] = useState('')
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [showFontMenu, setShowFontMenu] = useState(false)
  const [showSizeMenu, setShowSizeMenu] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily.configure({ types: ['textStyle'] }),
      FontSize,
      Color.configure({ types: ['textStyle'] }),
      LinkExt.configure({
        openOnClick: true,
        autolink: false,
        HTMLAttributes: {
          class: 'text-brand-600 underline cursor-pointer',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Placeholder.configure({
        placeholder: 'Share something with the community…',
      }),
    ],
    content: initialContent,
    editorProps: { attributes: { class: 'ProseMirror' } },
    onUpdate: ({ editor }) => {
      const text = editor.getText()
      const lines = text.split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (isYouTubeUrl(trimmed) && extractYouTubeId(trimmed) && !activeMedia) {
          setYoutubeUrl(trimmed)
          setActiveMedia('youtube')
          const html = editor.getHTML().replace(trimmed, '').replace(/<p><\/p>/g, '')
          editor.commands.setContent(html || '<p></p>')
          toast.success('YouTube video attached! 🎬')
          break
        }
      }
    },
  })

  const youtubeId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Only image files allowed'); return }
    if (file.size > 10 * 1024 * 1024) { toast.error('Image must be under 10MB'); return }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImagePreview(result)
      setImageStoredUrl('')
    }
    reader.readAsDataURL(file)
    setActiveMedia('image')
    setShowMediaPanel(false)
  }

  const handleAddInlineLink = useCallback(() => {
    if (!linkInputValue) return
    const url = linkInputValue.startsWith('http') ? linkInputValue : `https://${linkInputValue}`
    const { from, to } = editor?.state.selection ?? { from: 0, to: 0 }
    const hasSelection = from !== to
    if (hasSelection) {
      editor?.chain().focus().setLink({ href: url, target: '_blank' }).run()
    } else {
      editor
        ?.chain()
        .focus()
        .insertContent(`<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`)
        .run()
    }
    setLinkInputValue('')
    setShowLinkInput(false)
  }, [editor, linkInputValue])

  const handleSubmit = async () => {
    const html = editor?.getHTML() || ''
    if ((!html || html === '<p></p>') && !title) { toast.error('Write something first'); return }
    setLoading(true)
    try {
      let finalImageUrl = imageStoredUrl
      if (imageFile && activeMedia === 'image') {
        const formData = new FormData()
        formData.append('file', imageFile)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        if (uploadRes.ok) {
          const { url } = await uploadRes.json()
          finalImageUrl = url
        } else {
          finalImageUrl = imagePreview || ''
        }
      }
      const method = postId ? 'PATCH' : 'POST'
      const url = postId ? `/api/posts/${postId}` : '/api/posts'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || null,
          content: html === '<p></p>' ? '<p></p>' : html,
          category,
          youtubeUrl: activeMedia === 'youtube' && youtubeId ? youtubeUrl : null,
          imageUrl: activeMedia === 'image' ? finalImageUrl : null,
          linkUrl: activeMedia === 'link' ? attachedLinkUrl : null,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success(postId ? 'Post updated! ✅' : 'Post published! 🎉')
      editor?.commands.clearContent()
      setTitle(''); setYoutubeUrl(''); setImageFile(null)
      setImagePreview(null); setImageStoredUrl(''); setAttachedLinkUrl('')
      setActiveMedia(null); setExpanded(false); setShowMediaPanel(false)
      if (onSuccess) onSuccess()
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const removeMedia = () => {
    setActiveMedia(null); setYoutubeUrl(''); setYoutubeInput('')
    setImageFile(null); setImagePreview(null); setImageStoredUrl('')
    setAttachedLinkUrl(''); setImageUrlInput('')
  }

  const ytId = youtubeInput ? extractYouTubeId(youtubeInput) : null

  return (
    <div className="bg-white border border-gray-100 rounded-xl mb-4 shadow-sm">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Avatar name={session.user.name || 'U'} image={session.user.image} size="md" role={(session.user as any).role} />
          <div className="flex-1 min-w-0">
            {!expanded ? (
              <button onClick={() => setExpanded(true)}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-400 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors">
                Write something…
              </button>
            ) : (
              <div>
                <input type="text" placeholder="Add a title (optional)" value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm font-semibold bg-transparent border-b border-gray-100 pb-2 mb-3 outline-none placeholder-gray-300 text-gray-900" />

                {/* Rich text toolbar */}
                <div className="flex items-center gap-0.5 mb-2 pb-2 border-b border-gray-50 flex-wrap">
                  {[
                    { label: 'B', title: 'Bold', cmd: () => editor?.chain().focus().toggleBold().run(), active: () => !!editor?.isActive('bold') },
                    { label: 'I', title: 'Italic', cmd: () => editor?.chain().focus().toggleItalic().run(), active: () => !!editor?.isActive('italic') },
                    { label: '<>', title: 'Code', cmd: () => editor?.chain().focus().toggleCode().run(), active: () => !!editor?.isActive('code') },
                    { label: '❝', title: 'Quote', cmd: () => editor?.chain().focus().toggleBlockquote().run(), active: () => !!editor?.isActive('blockquote') },
                    { label: '≡', title: 'Bullets', cmd: () => editor?.chain().focus().toggleBulletList().run(), active: () => !!editor?.isActive('bulletList') },
                    { label: '1.', title: 'Numbered', cmd: () => editor?.chain().focus().toggleOrderedList().run(), active: () => !!editor?.isActive('orderedList') },
                  ].map(({ label, title: t, cmd, active }) => (
                    <button key={t} title={t} onClick={cmd} type="button"
                      className={`px-2 py-1 text-xs rounded font-mono transition-colors ${active() ? 'bg-brand-100 text-brand-700' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}>
                      {label}
                    </button>
                  ))}
                  <button title="Add hyperlink" type="button" onClick={() => setShowLinkInput(!showLinkInput)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${showLinkInput ? 'bg-brand-100 text-brand-700' : 'text-gray-400 hover:bg-gray-100'}`}>
                    🔗
                  </button>

                  <span className="w-px h-4 bg-gray-100 mx-1" />

                  {/* Font family */}
                  <div className="relative">
                    <button type="button" title="Font family"
                      onClick={() => { setShowFontMenu(!showFontMenu); setShowSizeMenu(false) }}
                      className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${showFontMenu ? 'bg-brand-100 text-brand-700' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}>
                      <span className="font-serif">A</span>
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {showFontMenu && (
                      <div className="absolute z-10 top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                        {FONT_FAMILIES.map((f) => (
                          <button key={f.label} type="button"
                            onClick={() => {
                              if (f.value) editor?.chain().focus().setFontFamily(f.value).run()
                              else editor?.chain().focus().unsetFontFamily().run()
                              setShowFontMenu(false)
                            }}
                            style={{ fontFamily: f.value || undefined }}
                            className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
                            {f.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Font size */}
                  <div className="relative">
                    <button type="button" title="Font size"
                      onClick={() => { setShowSizeMenu(!showSizeMenu); setShowFontMenu(false) }}
                      className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${showSizeMenu ? 'bg-brand-100 text-brand-700' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}>
                      <span>A</span><span className="text-[9px]">A</span>
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {showSizeMenu && (
                      <div className="absolute z-10 top-full left-0 mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                        {FONT_SIZES.map((s) => (
                          <button key={s.label} type="button"
                            onClick={() => {
                              if (s.value) editor?.chain().focus().setFontSize(s.value).run()
                              else editor?.chain().focus().unsetFontSize().run()
                              setShowSizeMenu(false)
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Text color */}
                  <label title="Text color" className="relative flex items-center px-1.5 py-1 rounded cursor-pointer text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                    <span className="text-xs font-semibold" style={{ color: editor?.getAttributes('textStyle').color || undefined }}>A</span>
                    <input
                      type="color"
                      onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
                      value={editor?.getAttributes('textStyle').color || '#000000'}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </label>
                </div>

                {/* Inline link input */}
                {showLinkInput && (
                  <div className="flex items-center gap-2 mb-2 p-2 bg-blue-50 rounded-lg border border-brand-100">
                    <input
                      type="url"
                      placeholder="Paste a URL and press Enter"
                      value={linkInputValue}
                      onChange={(e) => setLinkInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddInlineLink()}
                      autoFocus
                      className="flex-1 text-xs border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-brand-300 bg-white"
                    />
                    <button onClick={handleAddInlineLink}
                      className="text-xs bg-brand-600 text-white px-3 py-1.5 rounded-lg hover:bg-brand-700 whitespace-nowrap">
                      Apply link
                    </button>
                    <button onClick={() => { editor?.chain().focus().unsetLink().run(); setShowLinkInput(false) }}
                      className="text-xs text-gray-400 hover:text-red-500">✕</button>
                  </div>
                )}

                {/* Editor */}
                <div className="min-h-[90px] rounded-xl px-3 py-2.5 focus-within:ring-1 focus-within:ring-brand-200 border border-gray-100 transition-all mb-3">
                  <EditorContent editor={editor} />
                </div>

                {/* YouTube preview */}
                {activeMedia === 'youtube' && youtubeId && (
                  <div className="relative mb-3 rounded-xl overflow-hidden bg-black group/yt" style={{ aspectRatio: '16/9' }}>
                    <iframe src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                      className="w-full h-full" allowFullScreen title="YouTube preview" />
                    <button onClick={removeMedia}
                      className="absolute top-2 right-2 opacity-0 group-hover/yt:opacity-100 bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-black transition-all">✕</button>
                  </div>
                )}

                {/* Image preview */}
                {activeMedia === 'image' && imagePreview && (
                  <div className="relative mb-3 rounded-xl overflow-hidden group/img">
                    <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover rounded-xl" />
                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-all rounded-xl" />
                    <button onClick={removeMedia}
                      className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-black transition-all">✕</button>
                  </div>
                )}

                {/* Link card preview */}
                {activeMedia === 'link' && attachedLinkUrl && (
                  <div className="mb-3 flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                    <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className="text-xs text-brand-600 truncate flex-1">{attachedLinkUrl}</span>
                    <button onClick={removeMedia} className="text-gray-400 hover:text-red-500 text-sm shrink-0">✕</button>
                  </div>
                )}

                {/* Media attachment panel */}
                {showMediaPanel && !activeMedia && (
                  <div className="mb-3 border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Attach media</p>
                    </div>
                    <div className="p-3 space-y-3">
                      {/* YouTube embed */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1.5">
                          <span className="text-red-500">▶</span> YouTube video
                        </p>
                        <div className="flex gap-2">
                          <input type="url" placeholder="https://youtube.com/watch?v=... or youtu.be/..."
                            value={youtubeInput} onChange={(e) => setYoutubeInput(e.target.value)}
                            className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-100" />
                          <button
                            disabled={!ytId}
                            onClick={() => { if (ytId) { setYoutubeUrl(youtubeInput); setActiveMedia('youtube'); setShowMediaPanel(false) } }}
                            className="text-xs bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap">
                            Embed
                          </button>
                        </div>
                        {youtubeInput && !ytId && (
                          <p className="text-xs text-red-400 mt-1">Not a valid YouTube URL</p>
                        )}
                        {youtubeInput && ytId && (
                          <div className="mt-2 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                            <iframe src={`https://www.youtube.com/embed/${ytId}?rel=0`} className="w-full h-full" allowFullScreen title="Preview" />
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-100" />

                      {/* Image URL */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1.5">
                          <span>🖼️</span> Image URL
                        </p>
                        <div className="flex gap-2">
                          <input type="url" placeholder="https://example.com/image.jpg"
                            value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)}
                            className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-brand-300" />
                          <button disabled={!imageUrlInput}
                            onClick={() => { setImagePreview(imageUrlInput); setImageStoredUrl(imageUrlInput); setActiveMedia('image'); setShowMediaPanel(false) }}
                            className="text-xs bg-brand-600 text-white px-3 py-2 rounded-lg hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed">
                            Add
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-gray-100" />

                      {/* Link card */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1.5">
                          <span>🔗</span> Link card
                        </p>
                        <div className="flex gap-2">
                          <input type="url" placeholder="https://example.com"
                            value={attachedLinkUrl} onChange={(e) => setAttachedLinkUrl(e.target.value)}
                            className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-brand-300" />
                          <button disabled={!attachedLinkUrl}
                            onClick={() => { setActiveMedia('link'); setShowMediaPanel(false) }}
                            className="text-xs bg-brand-600 text-white px-3 py-2 rounded-lg hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed">
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom action bar */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <button type="button" title="Upload image from device" onClick={() => fileRef.current?.click()}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => { if (e.target.files?.[0]) handleImageFile(e.target.files[0]) }} />

                    <button type="button" title="Attach YouTube, image URL or link"
                      onClick={() => setShowMediaPanel(!showMediaPanel)}
                      className={`p-2 rounded-lg transition-colors ${showMediaPanel ? 'bg-red-50 text-red-500' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                      </svg>
                    </button>

                    <select value={category} onChange={(e) => setCategory(e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 bg-white outline-none focus:border-brand-300 ml-1">
                      {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => { setExpanded(false); editor?.commands.clearContent(); removeMedia() }}
                      className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSubmit} disabled={loading}
                      className="text-xs bg-brand-600 text-white px-4 py-1.5 rounded-lg hover:bg-brand-700 disabled:opacity-50 font-medium flex items-center gap-1.5">
                      {loading && <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                      {loading ? 'Posting…' : postId ? 'Save changes' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
