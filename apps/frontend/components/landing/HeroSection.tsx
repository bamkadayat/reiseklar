'use client';

import { useTranslations } from 'next-intl';
import { SearchForm } from './SearchForm';
import { useState, useEffect } from 'react';

export function HeroSection() {
  const t = useTranslations('home');
  const [greeting, setGreeting] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Get dynamic greeting based on Norway time
    const norwayTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Oslo' });
    const hour = new Date(norwayTime).getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting(t('greetings.morning'));
    } else if (hour >= 12 && hour < 18) {
      setGreeting(t('greetings.afternoon'));
    } else {
      setGreeting(t('greetings.evening'));
    }
  }, [t]);

  return (
    <div className="w-full max-w-4xl">
      <div className="text-center mb-8">
        <p className="text-xl sm:text-2xl text-gray-600 mb-2">
          {mounted ? greeting : '\u00A0'},
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
          {t('heroQuestion')}
        </h1>
      </div>

      {/* Search Form */}
      <div className="mb-8">
        <SearchForm />
      </div>

      {/* Additional Info */}
      <div className="text-center">
        <p className="text-lg text-gray-600">
          {t('subtitle')}
        </p>
      </div>
    </div>
  );
}
