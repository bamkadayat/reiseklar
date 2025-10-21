'use client';

import { HeroSection } from '@/components/landing/HeroSection';
import { WeatherSection } from '@/components/landing/WeatherSection';
import { NewsSection } from '@/components/landing/NewsSection';

export default function Home() {
  return (
    <>
      <div className="w-full min-h-[50vh] flex items-center justify-center px-4 py-16 sm:py-20 overflow-visible" style={{ backgroundImage: 'url(/images/hero-bg.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <HeroSection />
      </div>
      <div className="w-full max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeatherSection />
          <NewsSection />
        </div>
      </div>
    </>
  );
}
