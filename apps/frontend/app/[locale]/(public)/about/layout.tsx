import { ReactNode } from 'react';
import { PublicPageWrapper } from '@/components/shared/layout/PublicPageWrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Reiseklar - our mission to revolutionize urban mobility with smart commute planning, real-time transit data, and sustainable travel solutions for Norway.',
  keywords: ['about reiseklar', 'mission', 'smart commute', 'sustainable travel', 'urban mobility', 'public transport', 'norway transit'],
  openGraph: {
    title: 'About Reiseklar - Smart Commute Solutions',
    description: 'Discover how Reiseklar is transforming daily commutes with innovative technology, real-time data, and eco-friendly travel options.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Reiseklar - Smart Commute Solutions',
    description: 'Discover how Reiseklar is transforming daily commutes with innovative technology, real-time data, and eco-friendly travel options.',
  },
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <PublicPageWrapper>
      {children}
    </PublicPageWrapper>
  );
}
