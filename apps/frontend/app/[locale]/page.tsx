'use client';

import { HeroSection } from '@/components/landing/HeroSection';
import { WeatherSection } from '@/components/landing/WeatherSection';
import { NewsSection } from '@/components/landing/NewsSection';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-blue-900 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>

      <main id="main-content">
        <section
          className="relative w-screen min-h-[50vh] flex items-center justify-center px-4 py-16 sm:py-20 overflow-visible bg-[#012B6A]"
          aria-label="Search for travel routes"
        >
          {/* Background image with proper optimization */}
          <div className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
            <Image
              src="/images/hero-bg.png"
              alt=""
              fill
              priority
              quality={90}
              className="object-contain object-center"
              sizes="100vw"
            />
          </div>
          <div className="relative z-10">
            <HeroSection />
          </div>
        </section>

        <section className="w-full max-w-5xl mx-auto px-4 py-12" aria-label="Weather and news information">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeatherSection />
            <NewsSection />
          </div>
        </section>
      </main>
    </>
  );
}
