'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'reiseklar_cookie_consent';

interface CookiePreferences {
  essential: boolean; // Always true, can't be disabled
  functional: boolean;
  analytics: boolean;
  timestamp: number;
}

export function CookieConsent() {
  const t = useTranslations('cookies');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: false,
    analytics: false,
    timestamp: Date.now(),
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consentString = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consentString) {
      setIsVisible(true);
    } else {
      try {
        const consent = JSON.parse(consentString);
        setPreferences(consent);
      } catch (e) {
        // Invalid consent, show dialog again
        setIsVisible(true);
      }
    }
    setIsLoaded(true);
  }, []);

  const handleAcceptAll = () => {
    const newPreferences: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      timestamp: Date.now(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newPreferences));
    setIsVisible(false);
  };

  const handleAcceptEssentialOnly = () => {
    const newPreferences: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      timestamp: Date.now(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newPreferences));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
    setIsVisible(false);
  };

  // Don't render anything until we've checked localStorage
  if (!isLoaded || !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-4 sm:bottom-4 sm:right-4 sm:left-auto sm:w-[400px] z-50 max-h-[90vh] sm:max-h-[500px] animate-slide-up">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col max-h-[90vh] sm:max-h-[500px]">
        <div className="flex-1 px-4 py-4 sm:px-6 sm:py-5 flex flex-col overflow-y-auto">
          {/* Message */}
          <div className="mb-4">
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              {t('message')}
            </p>
            <Link
              href="/cookie-policy"
              className="text-blue-600 hover:text-blue-800 underline font-medium text-sm"
            >
              {t('readPolicy')}
            </Link>
          </div>

          {/* Cookie Details */}
          {showDetails && (
            <div className="mb-4 space-y-3">
              {/* Essential Cookies */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={preferences.essential}
                  disabled
                  className="mt-1 cursor-not-allowed"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {t('essential.title')}
                  </p>
                  <p className="text-xs text-gray-600">
                    {t('essential.description')}
                  </p>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(e) =>
                    setPreferences({ ...preferences, functional: e.target.checked })
                  }
                  className="mt-1 cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {t('functional.title')}
                  </p>
                  <p className="text-xs text-gray-600">
                    {t('functional.description')}
                  </p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({ ...preferences, analytics: e.target.checked })
                  }
                  className="mt-1 cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {t('analytics.title')}
                  </p>
                  <p className="text-xs text-gray-600">
                    {t('analytics.description')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-2 sm:gap-2 mt-auto">
            {showDetails ? (
              <>
                <button
                  onClick={handleSavePreferences}
                  className="w-full px-4 py-3 sm:px-6 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                >
                  {t('savePreferences')}
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="w-full px-4 py-2.5 sm:px-6 sm:py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200"
                >
                  {t('back')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleAcceptAll}
                  className="w-full px-4 py-3 sm:px-6 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                >
                  {t('acceptAll')}
                </button>
                <button
                  onClick={handleAcceptEssentialOnly}
                  className="w-full px-4 py-3 sm:px-6 sm:py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md transition-colors duration-200"
                >
                  {t('essentialOnly')}
                </button>
                <button
                  onClick={() => setShowDetails(true)}
                  className="w-full px-4 py-2.5 sm:px-6 sm:py-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                >
                  {t('customize')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
