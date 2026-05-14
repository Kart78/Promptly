export const metadata = { title: 'Classroom — Promptly' }

export default function ClassroomPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Classroom</h1>
      <p className="text-sm text-gray-400 mb-8">Structured courses and learning resources</p>

      <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
        <div className="text-5xl mb-4">🎓</div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Coming soon</h2>
        <p className="text-sm text-gray-400 max-w-xs mx-auto">
          We&apos;re building out structured courses for builders and indie hackers. Stay tuned!
        </p>
        <a
          href="/"
          className="inline-block mt-6 text-sm text-brand-600 hover:underline font-medium"
        >
          ← Back to community
        </a>
      </div>
    </div>
  )
}
