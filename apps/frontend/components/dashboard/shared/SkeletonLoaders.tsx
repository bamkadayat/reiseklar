export function StatCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title skeleton */}
          <div className="h-4 bg-muted rounded w-24 mb-2"></div>
          {/* Value skeleton */}
          <div className="h-8 bg-muted rounded w-20 mb-2"></div>
          {/* Description skeleton */}
          <div className="h-3 bg-muted rounded w-32"></div>
        </div>
        {/* Icon skeleton */}
        <div className="w-12 h-12 bg-muted rounded-lg"></div>
      </div>
    </div>
  );
}

export function RecentUserCardSkeleton() {
  return (
    <div className="px-6 py-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar skeleton */}
          <div className="w-10 h-10 bg-muted rounded-full"></div>
          <div>
            {/* Name skeleton */}
            <div className="h-4 bg-muted rounded w-32 mb-2"></div>
            {/* Email skeleton */}
            <div className="h-3 bg-muted rounded w-40"></div>
          </div>
        </div>
        <div className="text-right">
          {/* Time skeleton */}
          <div className="h-4 bg-muted rounded w-16 mb-2 ml-auto"></div>
          {/* Status badge skeleton */}
          <div className="h-6 bg-muted rounded-full w-16 ml-auto"></div>
        </div>
      </div>
    </div>
  );
}

export function SystemHealthSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-2">
        {/* Metric name skeleton */}
        <div className="h-4 bg-muted rounded w-24"></div>
        {/* Status skeleton */}
        <div className="h-4 bg-muted rounded w-16"></div>
      </div>
      {/* Progress bar skeleton */}
      <div className="w-full bg-muted rounded-full h-2"></div>
    </div>
  );
}

export function QuickActionSkeleton() {
  return (
    <div className="p-6 bg-card border border-border rounded-lg animate-pulse">
      {/* Icon skeleton */}
      <div className="w-8 h-8 bg-muted rounded mb-3"></div>
      {/* Title skeleton */}
      <div className="h-5 bg-muted rounded w-32 mb-2"></div>
      {/* Description skeleton */}
      <div className="h-4 bg-muted rounded w-full"></div>
      <div className="h-4 bg-muted rounded w-3/4 mt-1"></div>
    </div>
  );
}
