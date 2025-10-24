'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

/**
 * Conditionally renders the global footer
 * Hides footer on dashboard pages (user and admin)
 */
export function ConditionalFooter() {
  const pathname = usePathname();

  // Hide footer on dashboard pages
  const isDashboardPage =
    pathname?.includes('/user') ||
    pathname?.includes('/admin');

  // Show footer on all pages except dashboards
  if (isDashboardPage) {
    return null;
  }

  return <Footer />;
}
