/**
 * Skeleton loader for user dashboard
 * Matches the actual dashboard layout and works in both dark and light modes
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Welcome Section Skeleton */}
      <div>
        <div className="h-8 sm:h-9 bg-muted rounded-lg w-64 mb-2"></div>
        <div className="h-4 sm:h-5 bg-muted rounded-lg w-96 max-w-full"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-lg p-6 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-10 w-10 bg-muted rounded-lg"></div>
            </div>
            <div className="h-8 bg-muted rounded w-16"></div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Trips Skeleton */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <div className="h-6 bg-muted rounded w-32"></div>
        </div>
        <div className="divide-y divide-border">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-muted rounded"></div>
                    <div className="h-5 bg-muted rounded w-48"></div>
                  </div>
                  <div className="h-4 bg-muted rounded w-32"></div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="h-4 bg-muted rounded w-16"></div>
                  <div className="h-6 w-20 bg-muted rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="p-6 bg-card border border-border rounded-lg space-y-3"
          >
            <div className="h-8 w-8 bg-muted rounded"></div>
            <div className="h-5 bg-muted rounded w-32"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
