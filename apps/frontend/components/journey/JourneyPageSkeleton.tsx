import { JourneyCardSkeleton } from './JourneyCardSkeleton';

export function JourneyPageSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 py-3 sm:py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6">
          {/* Mobile: Compact Search Header Skeleton */}
          <div className="lg:hidden lg:col-span-12">
            <div className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <span className="text-gray-300">→</span>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Desktop: Left Sidebar Skeleton */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-0 pt-4 space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-4">
                {/* From Field Skeleton */}
                <div>
                  <div className="h-3 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>

                {/* To Field Skeleton */}
                <div>
                  <div className="h-3 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>

                {/* Date/Time Field Skeleton */}
                <div>
                  <div className="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>

                {/* Search Button Skeleton */}
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Main Content - Map and Journey Results Skeleton */}
          <div className="lg:col-span-9 space-y-3 sm:space-y-4">
            {/* Map Skeleton - matches actual map dimensions */}
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

            {/* Journey Cards Skeleton */}
            <div className="space-y-3 sm:space-y-4">
              <JourneyCardSkeleton />
              <JourneyCardSkeleton />
              <JourneyCardSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
