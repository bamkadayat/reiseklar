'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { ExternalLink, Calendar } from 'lucide-react';
import { RiNewsFill } from 'react-icons/ri';
import { useTranslations } from 'next-intl';

interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  imageUrl?: string;
  categories: string[];
}

export function NewsSection() {
  const t = useTranslations('home.news');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        setNews(data.news || []);
        setLoading(false);
      } catch (err) {
        setError('Unable to load news');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
      } else if (diffInHours < 48) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString('no-NO', {
          day: 'numeric',
          month: 'short',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
      }
    } catch {
      return dateString;
    }
  }, []);

  const truncateTitle = useCallback((title: string, maxLength: number = 60) => {
    if (title.length <= maxLength) {
      return title;
    }
    return title.substring(0, maxLength).trim() + '...';
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full min-h-[450px]">
        <div className="rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 h-full flex flex-col">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </div>

            {/* News items skeleton */}
            <div className="flex-1 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || news.length === 0) {
    return (
      <div className="w-full h-full min-h-[450px]">
        <div className="rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 h-full">
          <p className="text-red-700 text-center">
            {error || 'No news available at the moment'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[450px]">
      <div className="rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 h-full flex flex-col gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <RiNewsFill className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('title')}</h2>
        </div>

        {/* News Items */}
        <div className="flex-1 overflow-y-auto space-y-3" role="region" aria-label="Latest news articles">
          {news.slice(0, 3).map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {truncateTitle(item.title)}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {item.categories.length > 0 && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {item.categories[0]}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.pubDate)}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-600 flex-shrink-0 transition-colors" aria-hidden="true" />
              </div>
            </a>
          ))}
        </div>

        {/* Attribution */}
        <div className="pt-4 border-t border-blue-200">
          <p className="text-xs text-gray-600 text-center">
            {t('newsAttribution')}{' '}
            <a
              href="https://nrk.no"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              NRK
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
