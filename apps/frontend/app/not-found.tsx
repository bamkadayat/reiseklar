'use client';

import Link from 'next/link';
import { FiHome, FiArrowLeft, FiMapPin } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-sky-blue-light flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-9xl font-bold text-norwegian-blue opacity-20">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <FiMapPin className="w-24 h-24 text-norwegian-blue animate-bounce" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-4xl font-bold text-norwegian-blue mb-4">
          Oops! Lost Your Way?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          It looks like you&apos;ve ventured off the map. The page you&apos;re looking for doesn&apos;t exist.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="flex items-center gap-2 bg-norwegian-blue text-white px-6 py-3 rounded-lg hover:bg-norwegian-blue-600 font-medium transition-all transform hover:scale-105 shadow-lg"
          >
            <FiHome className="w-5 h-5" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 border-2 border-norwegian-blue text-norwegian-blue px-6 py-3 rounded-lg hover:bg-neutral-light font-medium transition-all transform hover:scale-105"
          >
            <FiArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200">
          <p className="text-gray-700">
            <strong className="text-norwegian-blue">Need help?</strong> Try starting from the{' '}
            <Link href="/" className="text-norwegian-blue hover:text-norwegian-blue-600 underline font-medium">
              homepage
            </Link>
            {' '}or check out our{' '}
            <Link href="/about" className="text-norwegian-blue hover:text-norwegian-blue-600 underline font-medium">
              about page
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
