'use client';

import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  isOpen: boolean;
  onClose: () => void;
  logo?: {
    text: string;
    subtitle?: string;
  };
}

export function Sidebar({ items, isOpen, onClose, logo }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <div>
            {logo && (
              <>
                <h2 className="text-xl font-bold text-norwegian-blue">
                  {logo.text}
                </h2>
                {logo.subtitle && (
                  <p className="text-xs text-gray-500">{logo.subtitle}</p>
                )}
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-norwegian-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className={cn(
                      'px-2 py-1 text-xs rounded-full',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-norwegian-blue/10 text-norwegian-blue'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
