'use client';

import { Home, Route, User, Settings, LogOut } from 'lucide-react';
import { Sidebar, SidebarItem } from '@/components/shared/layout/Sidebar';
import { useTranslations } from 'next-intl';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserSidebar({ isOpen, onClose }: UserSidebarProps) {
  const t = useTranslations('dashboard.user');

  const menuItems: SidebarItem[] = [
    {
      icon: Home,
      label: t('dashboard'),
      href: '/user',
    },
    {
      icon: Route,
      label: t('myRoutes'),
      href: '/user/routes',
    },
    {
      icon: User,
      label: t('profile'),
      href: '/user/profile',
    },
    {
      icon: Settings,
      label: t('settings'),
      href: '/user/settings',
    },
  ];

  return (
    <Sidebar
      items={menuItems}
      isOpen={isOpen}
      onClose={onClose}
      logo={{
        text: 'Reiseklar',
        subtitle: t('userDashboard'),
      }}
    />
  );
}
