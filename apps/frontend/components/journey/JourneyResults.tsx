'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { JourneyCard } from './JourneyCard';
import { TransportFilters } from './TransportFilters';
import { AlternativeRoutes } from './AlternativeRoutes';
import { Loader2 } from 'lucide-react';

interface JourneyResultsProps {
  startId: string;
  startLabel: string;
  startLat: number;
  startLon: number;
  stopId: string;
  stopLabel: string;
  stopLat: number;
  stopLon: number;
}

interface Journey {
  duration: number;
  legs: any[];
  startTime: string;
  endTime: string;
}

export function JourneyResults({
  startId,
  startLabel,
  startLat,
  startLon,
  stopId,
  stopLabel,
  stopLat,
  stopLon,
}: JourneyResultsProps) {
  const t = useTranslations('journey');
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModes, setSelectedModes] = useState<string[]>([
    'bus', 'metro', 'tram', 'train', 'ferry'
  ]);

  useEffect(() => {
    const fetchJourneys = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const enturApiUrl = process.env.NEXT_PUBLIC_ENTUR_API_URL || 'https://api.entur.io';

        // GraphQL query for Entur Journey Planner using coordinates
        const query = `
          {
            trip(
              from: {
                coordinates: {
                  latitude: ${startLat}
                  longitude: ${startLon}
                }
              }
              to: {
                coordinates: {
                  latitude: ${stopLat}
                  longitude: ${stopLon}
                }
              }
              numTripPatterns: 5
            ) {
              tripPatterns {
                startTime
                endTime
                duration
                legs {
                  mode
                  distance
                  duration
                  fromPlace {
                    name
                  }
                  toPlace {
                    name
                  }
                  fromEstimatedCall {
                    expectedDepartureTime
                  }
                  toEstimatedCall {
                    expectedArrivalTime
                  }
                  line {
                    publicCode
                    name
                  }
                }
              }
            }
          }
        `;

        const response = await fetch(`${enturApiUrl}/journey-planner/v3/graphql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ET-Client-Name': process.env.NEXT_PUBLIC_ENTUR_CLIENT_NAME || 'reiseklar-norway',
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch journeys');
        }

        const data = await response.json();

        if (data.errors) {
          throw new Error(data.errors[0]?.message || 'GraphQL error');
        }

        if (data.data?.trip?.tripPatterns) {
          setJourneys(data.data.trip.tripPatterns);
        } else {
          setJourneys([]);
        }
      } catch (err: any) {
        console.error('Error fetching journeys:', err);
        setError(err.message || 'Failed to load journey options');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJourneys();
  }, [startId, stopId, startLat, startLon, stopLat, stopLon]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-700 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Searching for best routes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {startLabel} → {stopLabel}
            </h1>
            <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1">
            <TransportFilters
              selectedModes={selectedModes}
              onModeChange={setSelectedModes}
            />
          </div>

          {/* Main Content - Journey Results */}
          <div className="lg:col-span-2 space-y-4">
            {journeys.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <p className="text-gray-600">No journeys found</p>
              </div>
            ) : (
              journeys.map((journey, index) => (
                <JourneyCard key={index} journey={journey} from={startLabel} />
              ))
            )}
          </div>

          {/* Right Sidebar - Alternative Routes */}
          <div className="lg:col-span-1">
            <AlternativeRoutes from={startLabel} to={stopLabel} />
          </div>
        </div>
      </div>
    </div>
  );
}
