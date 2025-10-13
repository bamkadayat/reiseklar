'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footprints, Bike, Car, MapPin } from 'lucide-react';

interface AlternativeRoutesProps {
  from: string;
  to: string;
}

const alternatives = [
  {
    id: 'walk',
    icon: Footprints,
    duration: '2 h 3 min to walk',
    distance: '8,56 km',
  },
  {
    id: 'bike',
    icon: Bike,
    duration: '1 h 4 min with bike',
    distance: '9,14 km',
  },
  {
    id: 'car',
    icon: Car,
    duration: '16 min with a car/taxi',
    distance: '12 km',
  },
  {
    id: 'citybike',
    icon: Bike,
    duration: '1 h 21 min with city bike',
    distance: '10 km',
  },
];

export function AlternativeRoutes({ from, to }: AlternativeRoutesProps) {
  const t = useTranslations('journey.alternatives');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">Alternative routes</CardTitle>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          Show in map
        </button>
      </CardHeader>
      <CardContent className="space-y-3">
        {alternatives.map((alt) => {
          const Icon = alt.icon;
          return (
            <button
              key={alt.id}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              <div className={`p-2 rounded-lg ${
                alt.id === 'bike' || alt.id === 'citybike'
                  ? 'bg-green-100 text-green-700'
                  : alt.id === 'car'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{alt.duration}</p>
                <p className="text-xs text-gray-500">{alt.distance}</p>
              </div>
            </button>
          );
        })}

        <div className="pt-4 border-t">
          <button className="w-full text-left text-blue-600 hover:text-blue-700 font-medium text-sm underline">
            Something wrong?
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
