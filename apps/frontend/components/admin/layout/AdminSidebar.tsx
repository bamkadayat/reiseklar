'use client';

import { LayoutDashboard, Users, BarChart3, Settings } from 'lucide-react';
import { Sidebar, SidebarItem } from '@/components/shared/layout/Sidebar';
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

  const menuItems: SidebarItem[] = [
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
    {
      icon: Settings,
      label: t('settings'),
      href: '/admin/settings',
    },
  ];

  return (
    <Sidebar
      items={menuItems}
      isOpen={isOpen}
      onClose={onClose}
      logo={{
        text: 'Reiseklar',
        subtitle: t('adminPanel'),
      }}
    />
  );
}
