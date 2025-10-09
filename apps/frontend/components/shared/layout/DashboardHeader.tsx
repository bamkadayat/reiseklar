'use client';

import { Menu, Bell, LogOut } from 'lucide-react';
import { LanguageSwitcher } from '@/components/shared/navigation/LanguageSwitcher';

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
  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Side - Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Center - Logo for mobile */}
        <div className="lg:hidden absolute left-1/2 -translate-x-1/2">
          <h1 className="text-lg font-bold text-norwegian-blue">Reiseklar</h1>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          {/* Language Switcher */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-norwegian-blue rounded-full flex items-center justify-center text-white font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
