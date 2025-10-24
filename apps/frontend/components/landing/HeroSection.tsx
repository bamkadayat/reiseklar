'use client';

import { useTranslations } from 'next-intl';
import { SearchForm } from './SearchForm';

export function HeroSection() {
  const t = useTranslations('home');

  return (
    <div className="w-full max-w-4xl py-8 sm:py-12 md:py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          {t('heroQuestion')}
        </h1>
      </div>

      {/* Search Form */}
      <div className="mb-8">
        <SearchForm />
      </div>
    </div>
  );
}
