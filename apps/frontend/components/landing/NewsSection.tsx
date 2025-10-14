'use client';

import { useEffect, useState } from 'react';
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
        console.error('Error fetching news:', err);
        setError('Unable to load news');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
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
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const truncateTitle = (title: string, maxLength: number = 60) => {
    if (title.length <= maxLength) {
      return title;
    }
    return title.substring(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <div className="w-full h-full">
        <div className="rounded-2xl p-8 shadow-sm border border-gray-100 h-full flex flex-col">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>

            {/* News items skeleton */}
            <div className="flex-1 space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="py-2.5 border-b border-gray-100">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Title skeleton */}
                      <div className="space-y-1.5">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      {/* Metadata skeleton */}
                      <div className="flex items-center gap-2">
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                        <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    {/* Icon skeleton */}
                    <div className="w-3.5 h-3.5 bg-gray-200 rounded flex-shrink-0 mt-0.5"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Attribution skeleton */}
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || news.length === 0) {
    return (
      <div className="w-full h-full">
        <div className="rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
          <p className="text-red-700 text-center">
            {error || 'No news available at the moment'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="rounded-2xl p-8 shadow-sm border border-gray-100 h-full flex flex-col">
        <div className="flex items-center space-x-2 mb-8">
          <RiNewsFill className="w-5 h-5 text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {news.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group hover:bg-gray-50 transition-colors duration-200 py-2.5 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {truncateTitle(item.title)}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {item.categories.length > 0 && (
                      <span className="text-gray-600">
                        {item.categories[0]}
                      </span>
                    )}
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.pubDate)}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 flex-shrink-0 mt-0.5" />
              </div>
            </a>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-8 text-center">
          {t('newsAttribution')}{' '}
          <a
            href="https://nrk.no"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            NRK
          </a>
          {' '}(Norwegian Broadcasting Corporation)
        </p>
      </div>
    </div>
  );
}
