'use client';

import { ReactNode, useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { DashboardHeader } from '@/components/shared/layout/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useRouter, useParams } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isCheckingAuth, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!isAuthenticated) {
        router.push(`/${locale}/signIn`);
      } else if (user?.role !== 'ADMIN') {
        // If user is not admin, redirect to home page
        router.push(`/${locale}`);
      }
    }
  }, [isCheckingAuth, isAuthenticated, user, router, locale]);

  if (isCheckingAuth) {
    return (
      <ThemeProvider initialTheme="light">
        <div className="flex h-screen bg-background overflow-hidden">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block w-64 bg-background border-r border-border">
            <div className="h-16 px-6 border-b border-border flex items-center animate-pulse">
              <div className="h-8 w-32 bg-muted rounded"></div>
            </div>
            <div className="p-3 space-y-2 animate-pulse">
              <div className="h-10 bg-muted rounded-lg"></div>
              <div className="h-10 bg-muted rounded-lg"></div>
              <div className="h-10 bg-muted rounded-lg"></div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header Skeleton */}
            <header className="h-16 bg-background border-b border-border px-6 flex items-center justify-between animate-pulse">
              <div className="h-6 w-6 bg-muted rounded lg:hidden"></div>
              <div className="ml-auto flex items-center gap-4">
                <div className="w-32 h-10 bg-muted rounded-lg hidden md:block"></div>
                <div className="w-10 h-10 bg-muted rounded-full"></div>
              </div>
            </header>

            {/* Main Content Area Skeleton */}
            <main className="flex-1 overflow-y-auto bg-background p-6">
              <div className="max-w-7xl space-y-6 animate-pulse">
                {/* Title skeleton */}
                <div className="h-8 w-64 bg-muted rounded"></div>
                <div className="h-4 w-96 bg-muted rounded"></div>

                {/* Stats Grid skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="h-32 bg-card border border-border rounded-lg"></div>
                  <div className="h-32 bg-card border border-border rounded-lg"></div>
                  <div className="h-32 bg-card border border-border rounded-lg"></div>
                  <div className="h-32 bg-card border border-border rounded-lg"></div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <ThemeProvider initialTheme={user?.theme}>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <DashboardHeader
            onMenuClick={() => setIsSidebarOpen(true)}
            userName={user?.name || user?.email || 'Admin'}
            userRole="admin"
            notificationCount={0}
          />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
