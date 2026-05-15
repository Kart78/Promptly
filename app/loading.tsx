export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6 animate-pulse">
      <div className="flex-1 space-y-3">
        {/* Composer skeleton */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 h-16" />
        {/* Category filter skeleton */}
        <div className="flex gap-2">
          {[80, 140, 120, 100, 90].map((w, i) => (
            <div key={i} className="h-7 bg-gray-100 rounded-full" style={{ width: w }} />
          ))}
        </div>
        {/* Post skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 space-y-2">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-4/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Sidebar skeleton */}
      <div className="hidden lg:block w-72 space-y-3">
        <div className="bg-white border border-gray-100 rounded-xl h-40" />
        <div className="bg-white border border-gray-100 rounded-xl h-48" />
      </div>
    </div>
  )
}
