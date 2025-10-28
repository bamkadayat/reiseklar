'use client';

import { ReactNode, useState, useEffect } from 'react';
import { UserSidebar } from '@/components/user/layout/UserSidebar';
import { UserLayoutSkeleton } from '@/components/user/layout/UserLayoutSkeleton';
import { DashboardHeader } from '@/components/shared/layout/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useRouter, useParams } from 'next/navigation';

export default function UserLayout({
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
    if (!isCheckingAuth && !isAuthenticated) {
      router.push(`/${locale}/signIn`);
    }
  }, [isCheckingAuth, isAuthenticated, router, locale]);

  if (isCheckingAuth) {
    return <UserLayoutSkeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ThemeProvider initialTheme={user?.theme}>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar */}
        <UserSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <DashboardHeader
            onMenuClick={() => setIsSidebarOpen(true)}
            userName={user?.name || user?.email || 'User'}
            userRole="user"
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
