'use client';

import { Home, Route, User, Settings, ArrowLeft } from 'lucide-react';
import { Sidebar, SidebarItem, SidebarSection } from '@/components/shared/layout/Sidebar';
import { useTranslations } from 'next-intl';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserSidebar({ isOpen, onClose }: UserSidebarProps) {
  const t = useTranslations('dashboard.user');

  const sections: SidebarSection[] = [
    {
      header: undefined, // No header for main section (like "Home" in the design)
      items: [
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
      ],
    },
  ];

  const bottomItems: SidebarItem[] = [
    {
      icon: ArrowLeft,
      label: 'Go to Homepage',
      href: '/',
    },
  ];

  return (
    <Sidebar
      sections={sections}
      bottomItems={bottomItems}
      isOpen={isOpen}
      onClose={onClose}
      logo={{
        text: 'Reiseklar',
        subtitle: t('userDashboard'),
      }}
      showLanguageSwitcher={true}
      showNotifications={false}
      notificationCount={0}
    />
  );
}
