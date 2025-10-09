'use client';

import { ReactNode, useState } from 'react';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { DashboardHeader } from '@/components/shared/layout/DashboardHeader';
// import { useAuth } from '@/hooks/useAuth'; // TODO: Implement auth hook
// import { redirect } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // TODO: Implement proper authentication
  // const { user, isLoading } = useAuth();

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (!user || user.role !== 'admin') {
  //   redirect('/login');
  // }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          onMenuClick={() => setIsSidebarOpen(true)}
          userName="Admin"
          userRole="admin"
          notificationCount={5}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
