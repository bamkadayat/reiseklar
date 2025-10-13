'use client';

import { useTranslations } from 'next-intl';
import { Train, Bus, Cable, Ship, Footprints, ChevronRight, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface JourneyCardProps {
  journey: any;
  from: string;
}

const getModeIcon = (mode: string) => {
  switch (mode.toLowerCase()) {
    case 'bus':
      return <Bus className="w-5 h-5" />;
    case 'tram':
      return <Cable className="w-5 h-5" />;
    case 'rail':
    case 'train':
      return <Train className="w-5 h-5" />;
    case 'metro':
      return <Train className="w-5 h-5" />;
    case 'water':
    case 'ferry':
      return <Ship className="w-5 h-5" />;
    case 'foot':
      return <Footprints className="w-5 h-5" />;
    default:
      return <Bus className="w-5 h-5" />;
  }
};

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
};

export function JourneyCard({ journey, from }: JourneyCardProps) {
  const t = useTranslations('journey');
  const [showDetails, setShowDetails] = useState(false);

  const mainLeg = journey.legs?.find((leg: any) => leg.mode !== 'foot');
  const totalWalkingTime = journey.legs
    ?.filter((leg: any) => leg.mode === 'foot')
    .reduce((sum: number, leg: any) => sum + (leg.duration || 0), 0);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">From {from}</p>
            <div className="flex items-center gap-4 mb-2">
              {/* Walking indicator */}
              {totalWalkingTime > 0 && (
                <div className="flex items-center gap-1 text-gray-700">
                  <Footprints className="w-4 h-4" />
                  <span className="text-sm">{Math.floor(totalWalkingTime / 60)}</span>
                </div>
              )}

              {/* Main transport mode */}
              {mainLeg && (
                <div className="flex items-center gap-2 bg-orange-600 text-white px-3 py-1 rounded-full">
                  {getModeIcon(mainLeg.mode)}
                  <span className="font-medium">{mainLeg.line?.publicCode || mainLeg.line?.name}</span>
                  {mainLeg.line?.name && mainLeg.line?.publicCode && (
                    <span className="text-sm opacity-90">{mainLeg.line.name}</span>
                  )}
                  <AlertCircle className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Times */}
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold">{formatTime(journey.startTime)}</span>
              <span className="text-gray-400">—</span>
              <span className="text-2xl font-bold">{formatTime(journey.endTime)}</span>
            </div>
          </div>

          {/* Duration and Details */}
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900 mb-2">
              {formatDuration(journey.duration)}
            </p>
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 p-0 h-auto"
            >
              {showDetails ? 'Hide details' : 'Show details'}
              <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Arrival time */}
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-600">
            Arrival: {formatTime(journey.endTime)}
          </p>
        </div>

        {/* Details section */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
            {journey.legs?.map((leg: any, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getModeIcon(leg.mode)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {leg.mode === 'foot' ? 'Walk' : leg.line?.name || leg.mode}
                  </p>
                  <p className="text-sm text-gray-600">
                    {leg.fromPlace?.name} → {leg.toPlace?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDuration(leg.duration)} • {Math.round(leg.distance)} m
                  </p>
                </div>
                <div className="text-sm text-gray-600">
                  {leg.fromEstimatedCall?.expectedDepartureTime && formatTime(leg.fromEstimatedCall.expectedDepartureTime)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
