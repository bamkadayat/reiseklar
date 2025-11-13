export function JourneyMapSkeleton() {
  return (
    <div className="relative">
      <div className="w-full h-[300px] lg:h-[400px] rounded-xl overflow-hidden shadow-md border-2 border-gray-200 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 animate-pulse">
        {/* Map marker placeholders */}
        <div className="absolute top-1/4 left-1/4">
          <div className="w-10 h-10 bg-blue-300 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute top-1/2 left-1/2">
          <div className="w-10 h-10 bg-red-300 rounded-full animate-pulse"></div>
        </div>

        {/* Legend Skeleton */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <div className="h-3 bg-gray-200 rounded w-12 mb-2 animate-pulse"></div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-2 bg-gray-200 rounded w-12 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-2 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-2 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-gray-200 animate-pulse"></div>
              <div className="h-2 bg-gray-200 rounded w-14 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
