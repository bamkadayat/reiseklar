'use client';

import { useEffect } from 'react';
import { CookieConsent } from '@/components/shared/CookieConsent';

/**
 * PublicPageWrapper ensures that public pages always use light mode
 * This component should wrap all public pages (landing, journey, auth pages)
 */
export function PublicPageWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Force light mode on mount
    const root = document.documentElement;
    root.classList.remove('dark');

    // Create observer to watch for dark class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const root = document.documentElement;
          if (root.classList.contains('dark')) {
            // Remove dark class if it gets added
            root.classList.remove('dark');
          }
        }
      });
    });

    // Start observing the document element for attribute changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {children}
      <CookieConsent />
    </>
  );
}
