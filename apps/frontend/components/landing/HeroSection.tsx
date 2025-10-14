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
    <div className="w-full max-w-4xl py-8 sm:py-12 md:py-16">
      <div className="text-center mb-8">
        <p className="text-xl sm:text-2xl text-blue-100 mb-2">
          {mounted ? greeting : '\u00A0'},
        </p>
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
