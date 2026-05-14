import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-100 mb-2">404</p>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Page not found</h1>
        <p className="text-sm text-gray-500 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="text-sm bg-brand-600 text-white px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-colors font-medium">
          Back to community
        </Link>
      </div>
    </div>
  )
}
