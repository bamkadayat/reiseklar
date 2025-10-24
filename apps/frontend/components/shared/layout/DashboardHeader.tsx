'use client';

import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAppSelector } from "@/store/hooks";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  userName?: string;
  userRole?: string;
  notificationCount?: number;
}

export function DashboardHeader({
  onMenuClick,
  userName = 'User',
  userRole = 'user',
  notificationCount = 0,
}: DashboardHeaderProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
   const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      // Force a full page reload to clear dark mode and reset state
      window.location.href = '/signIn';
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Side - Menu Button + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          {/* User Profile */}
          <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-norwegian-blue rounded-full flex items-center justify-center text-white font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-white"> {user?.name}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className={`w-5 h-5 ${isLoggingOut ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
