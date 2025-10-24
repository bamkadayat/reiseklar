'use client';

import { ReactNode, useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { DashboardHeader } from '@/components/shared/layout/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isCheckingAuth, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!isAuthenticated) {
        router.push('/signIn');
      } else if (user?.role !== 'ADMIN') {
        router.push('/');
      }
    }
  }, [isCheckingAuth, isAuthenticated, user, router]);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-norwegian-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <ThemeProvider initialTheme={user?.theme}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
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
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
