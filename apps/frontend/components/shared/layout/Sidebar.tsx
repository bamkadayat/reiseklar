"use client";

import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { LucideIcon, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { LanguageSwitcher } from '@/components/shared/navigation/LanguageSwitcher';

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: string;
}

export interface SidebarSection {
  header?: string;
  items: SidebarItem[];
}

interface SidebarProps {
  sections: SidebarSection[];
  bottomItems?: SidebarItem[];
  isOpen: boolean;
  onClose: () => void;
  logo?: {
    text: string;
    subtitle?: string;
  };
  showLanguageSwitcher?: boolean;
  showNotifications?: boolean;
  notificationCount?: number;
}

export function Sidebar({ sections, bottomItems, isOpen, onClose, logo, showLanguageSwitcher = false, showNotifications = false, notificationCount = 0 }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') {
              onClose();
            }
          }}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-background border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border flex-shrink-0">
          <div>
            {logo && (
              <>
              <div className="flex items-center gap-2">
                <Image
                  src="/images/logo.png"
                  alt="Reiseklar Logo"
                  width={32}
                  height={40}
                  priority
                  className="object-contain"
                />
                <h2 className="text-xl font-bold text-primary">
                  {logo.text}
                </h2>
                </div>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-muted-foreground hover:text-foreground"
            aria-label="Close sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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

        {/* Language & Notifications Section */}
        {(showLanguageSwitcher || showNotifications) && (
          <div className="px-4 py-4 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between gap-2">
              {/* Language Switcher */}
              {showLanguageSwitcher && (
                <div className="flex-1">
                  <LanguageSwitcher />
                </div>
              )}

              {/* Notifications */}
              {showNotifications && (
                <button
                  className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount})` : ''}`}
                >
                  <Bell className="w-5 h-5" aria-hidden="true" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-semibold">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto min-h-0">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {/* Section Header */}
                {section.header && (
                  <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.header}
                  </h3>
                )}

                {/* Section Items */}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    // Remove locale prefix from pathname for comparison
                    const pathnameWithoutLocale = pathname.replace(/^\/(en|nb)/, '');
                    const isActive = pathnameWithoutLocale === item.href || pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => onClose()}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              "px-2 py-0.5 text-xs rounded-full font-semibold",
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
        </nav>

        {/* Bottom Items */}
        {bottomItems && bottomItems.length > 0 && (
          <div className="px-3 py-4 border-t border-border space-y-1 flex-shrink-0">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              // Remove locale prefix from pathname for comparison
              const pathnameWithoutLocale = pathname.replace(/^\/(en|nb)/, '');
              const isActive = pathnameWithoutLocale === item.href || pathname === item.href;

              const handleClick = () => {
                // If navigating to homepage, force remove dark class
                if (item.href === '/') {
                  document.documentElement.classList.remove('dark');
                }
                onClose();
              };

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "px-2 py-0.5 text-xs rounded-full font-semibold",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </aside>
    </>
  );
}
