import { ThemeProvider } from '@/contexts/ThemeContext';

/**
 * Skeleton loader for user layout
 * Shows the structure of sidebar + header while auth is being checked
 */
export function UserLayoutSkeleton() {
  return (
    <ThemeProvider initialTheme="light">
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar Skeleton */}
        <aside className="hidden lg:block w-64 bg-card border-r border-border">
          <div className="h-16 px-6 border-b border-border flex items-center">
            <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="p-3 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header Skeleton */}
          <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
            <div className="h-6 w-6 bg-muted rounded lg:hidden animate-pulse"></div>
            <div className="ml-auto flex items-center gap-4">
              <div className="w-32 h-10 bg-muted rounded-lg hidden md:block animate-pulse"></div>
              <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
            </div>
          </header>

          {/* Main Content Area Skeleton */}
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <div className="space-y-6 sm:space-y-8 animate-pulse">
                {/* Title skeleton */}
                <div className="space-y-2">
                  <div className="h-8 sm:h-9 bg-muted rounded-lg w-64"></div>
                  <div className="h-4 sm:h-5 bg-muted rounded-lg w-96 max-w-full"></div>
                </div>

                {/* Stats Grid skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-card border border-border rounded-lg"></div>
                  ))}
                </div>

                {/* Content card skeleton */}
                <div className="h-64 bg-card border border-border rounded-lg"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
