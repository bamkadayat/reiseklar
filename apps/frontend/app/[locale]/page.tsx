'use client';

import { HeroSection } from '@/components/landing/HeroSection';
import { PublicPageWrapper } from '@/components/shared/layout/PublicPageWrapper';
import dynamic from 'next/dynamic';

// Lazy load non-critical sections for better performance
const WeatherSection = dynamic(() => import('@/components/landing/WeatherSection').then(mod => ({ default: mod.WeatherSection })), {
  loading: () => <div className="min-h-[450px] bg-gray-100 animate-pulse rounded-2xl" />,
  ssr: false,
});

const NewsSection = dynamic(() => import('@/components/landing/NewsSection').then(mod => ({ default: mod.NewsSection })), {
  loading: () => <div className="min-h-[450px] bg-gray-100 animate-pulse rounded-2xl" />,
  ssr: false,
});

export default function Home() {
  return (
    <PublicPageWrapper>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-blue-900 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>

      <main id="main-content">
        <section
          className="relative w-full min-h-[50vh] flex items-center justify-center px-4 py-16 sm:py-20 bg-gradient-to-br from-[#012B6A] via-[#01286d] to-[#01409d]"
          aria-label="Search for travel routes"
        >
          <HeroSection />
        </section>

        <section className="w-full max-w-5xl mx-auto px-4 py-12" aria-label="Weather and news information">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeatherSection />
            <NewsSection />
          </div>
        </section>
      </main>
    </PublicPageWrapper>
  );
}
