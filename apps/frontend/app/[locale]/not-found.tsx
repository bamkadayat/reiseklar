'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FiHome, FiArrowLeft, FiMapPin } from 'react-icons/fi';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-sky-blue-light flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-9xl font-bold text-norwegian-blue opacity-20">{t('title')}</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <FiMapPin className="w-24 h-24 text-norwegian-blue animate-bounce" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-4xl font-bold text-norwegian-blue mb-4">
          {t('heading')}
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          {t('description')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="flex items-center gap-2 bg-norwegian-blue text-white px-6 py-3 rounded-lg hover:bg-norwegian-blue-600 font-medium transition-all transform hover:scale-105 shadow-lg"
          >
            <FiHome className="w-5 h-5" />
            {t('goHome')}
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 border-2 border-norwegian-blue text-norwegian-blue px-6 py-3 rounded-lg hover:bg-neutral-light font-medium transition-all transform hover:scale-105"
          >
            <FiArrowLeft className="w-5 h-5" />
            {t('goBack')}
          </button>
        </div>
      </div>
    </div>
  );
}
