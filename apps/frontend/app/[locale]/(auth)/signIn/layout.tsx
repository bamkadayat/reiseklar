import { ReactNode } from 'react';
import { PublicPageWrapper } from '@/components/shared/layout/PublicPageWrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Access your Reiseklar account to manage your smart commute preferences and stay updated on urban mobility solutions in Norway.',
  keywords: ['sign in', 'login', 'reiseklar', 'smart commute', 'urban mobility', 'norway transit']
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <PublicPageWrapper>
      {children}
    </PublicPageWrapper>
  );
}
