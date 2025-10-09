'use client';

import { LayoutDashboard, Users, BarChart3, Settings } from 'lucide-react';
import { Sidebar, SidebarItem } from '@/components/shared/layout/Sidebar';
import { useTranslations } from 'next-intl';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const t = useTranslations('dashboard.admin');

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
      badge: '24',
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
