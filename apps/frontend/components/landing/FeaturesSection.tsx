'use client';

import { useTranslations } from 'next-intl';
import { Map, Train, FileText } from 'lucide-react';

export function FeaturesSection() {
  const t = useTranslations('home.features');

  const features = [
    {
      icon: Map,
      title: t('mapAndDepartures.title'),
      description: t('mapAndDepartures.description'),
      bgColor: 'bg-gradient-to-br from-green-50 to-blue-50',
    },
    {
      icon: Train,
      title: t('trainsInEurope.title'),
      description: t('trainsInEurope.description'),
      bgColor: 'bg-gradient-to-br from-blue-50 to-purple-50',
    },
    {
      icon: FileText,
      title: t('aboutEntur.title'),
      description: t('aboutEntur.description'),
      bgColor: 'bg-gradient-to-br from-gray-50 to-slate-50',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className={`${feature.bgColor} rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Icon className="w-8 h-8 text-gray-800" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
