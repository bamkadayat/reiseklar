import { Card, CardContent } from "@/components/ui/card";

export function JourneyCardSkeleton() {
  return (
    <Card className="shadow-sm border border-gray-200 bg-white">
      <CardContent className="p-3 sm:p-4 md:p-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>

        {/* Timeline Skeleton */}
        <div className="flex items-start gap-0 overflow-x-auto pb-2">
          {/* First Walking Skeleton */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="bg-gray-200 rounded-lg px-2 sm:px-3 py-2 sm:py-2.5 mb-1 w-16 h-12 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
          </div>

          {/* Dotted line connector */}
          <div className="flex items-center px-2 sm:px-3 pt-3 flex-shrink-0">
            <div className="border-t-2 border-dotted border-gray-300 w-4 sm:w-8"></div>
          </div>

          {/* Transport Badge Skeleton */}
          <div className="flex flex-col items-center flex-1 min-w-0">
            <div className="bg-gray-200 rounded-lg px-2 sm:px-2.5 py-1.5 mb-1 w-full h-8 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
          </div>

          {/* Dotted line connector */}
          <div className="flex items-center px-2 sm:px-3 pt-3 flex-shrink-0">
            <div className="border-t-2 border-dotted border-gray-300 w-4 sm:w-8"></div>
          </div>

          {/* Last Walking Skeleton */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="bg-gray-200 rounded-lg px-2 sm:px-3 py-2 sm:py-2.5 mb-1 w-16 h-12 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
          </div>

          {/* Dotted line connector */}
          <div className="flex items-center px-2 sm:px-3 pt-3 flex-shrink-0">
            <div className="border-t-2 border-dotted border-gray-300 w-4 sm:w-8"></div>
          </div>

          {/* Flag Skeleton */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="bg-gray-200 rounded-lg px-2 sm:px-3 py-2 sm:py-2.5 mb-1 w-12 h-12 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
          </div>

          {/* Show Details Button Skeleton - Desktop */}
          <div className="hidden sm:flex p-2 rounded-md flex-shrink-0 mt-1 ml-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Mobile Button Skeleton */}
        <div className="sm:hidden mt-3 w-full bg-gray-200 py-2.5 rounded-lg animate-pulse h-10"></div>
      </CardContent>
    </Card>
  );
}
