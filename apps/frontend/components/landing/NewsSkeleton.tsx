export function NewsSkeleton() {
  return (
    <div className="w-full h-full min-h-[450px]">
      <div className="rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 h-full flex flex-col gap-4 sm:gap-6 animate-pulse">
        {/* Header */}
        <div className="flex items-center gap-2 h-8">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-200 rounded flex-shrink-0"></div>
          <div className="h-6 bg-blue-200 rounded w-40"></div>
        </div>

        {/* News Items */}
        <div className="flex-1 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Title lines */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  </div>

                  {/* Category and date */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="h-5 bg-blue-100 rounded-full w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>

                {/* External link icon */}
                <div className="w-4 h-4 bg-gray-200 rounded flex-shrink-0"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Attribution */}
        <div className="pt-4 border-t border-blue-200">
          <div className="h-3 bg-gray-200 rounded w-40 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
