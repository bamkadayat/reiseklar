'use client';

import { LayoutDashboard, Users, BarChart3, Settings, ArrowLeft } from 'lucide-react';
import { Sidebar, SidebarItem, SidebarSection } from '@/components/shared/layout/Sidebar';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { adminService } from '@/lib/api/admin.service';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const t = useTranslations('dashboard.admin');
  const [userCount, setUserCount] = useState<number>(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const users = await adminService.getUsers();
        setUserCount(users.length);
      } catch (error) {
        console.error('Failed to fetch user count:', error);
      }
    };

    fetchUserCount();
  }, []);

  const sections: SidebarSection[] = [
    {
      header: 'ADMIN',
      items: [
        {
          icon: LayoutDashboard,
          label: t('overview'),
          href: '/admin',
        },
        {
          icon: Users,
          label: t('users'),
          href: '/admin/users',
          badge: userCount > 0 ? userCount.toString() : undefined,
        },
        {
          icon: BarChart3,
          label: t('analytics'),
          href: '/admin/analytics',
        },
      ],
    },
    {
      header: 'SYSTEM',
      items: [
        {
          icon: Settings,
          label: t('settings'),
          href: '/admin/settings',
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
        subtitle: t('adminPanel'),
      }}
      showLanguageSwitcher={true}
      showNotifications={false}
      notificationCount={0}
    />
  );
}
