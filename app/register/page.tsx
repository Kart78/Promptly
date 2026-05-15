'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    if (!res.ok) {
      const { error } = await res.json()
      toast.error(error || 'Registration failed')
      setLoading(false)
      return
    }
    await signIn('credentials', { email, password, callbackUrl: '/', redirect: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-3">P</div>
          <h1 className="text-2xl font-bold text-gray-900">Join Promptly</h1>
          <p className="text-sm text-gray-500 mt-1">Build in public with us</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-brand-400 transition-colors" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-brand-400 transition-colors" />
            <input type="password" placeholder="Password (min 8 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-brand-400 transition-colors" />
            <button type="submit" disabled={loading}
              className="w-full bg-brand-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 transition-colors">
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-600 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
