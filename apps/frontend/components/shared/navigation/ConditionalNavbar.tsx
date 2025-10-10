'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

/**
 * Conditionally renders the global navbar
 * Hides navbar on dashboard pages (user and admin)
 */
export function ConditionalNavbar() {
  const pathname = usePathname();

  // Hide navbar on dashboard pages
  const isDashboardPage =
    pathname?.includes('/user') ||
    pathname?.includes('/admin');

  // Hide navbar on auth pages (optional)
  const isAuthPage =
    pathname?.includes('/signIn') ||
    pathname?.includes('/signUp');

  // Show navbar on all pages except dashboards
  if (isDashboardPage) {
    return null;
  }

  return <Navbar />;
}
