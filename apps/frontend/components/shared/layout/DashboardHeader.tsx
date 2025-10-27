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
    <header className="h-16 bg-background border-b border-border sticky top-0 z-30">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Side - Menu Button + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          {/* User Profile */}
          <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground"> {user?.name}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
