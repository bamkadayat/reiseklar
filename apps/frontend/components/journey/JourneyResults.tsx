'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { JourneyCard } from './JourneyCard';
import { JourneyCardSkeleton } from './JourneyCardSkeleton';
import { AlternativeRoutes } from './AlternativeRoutes';
import { JourneySearchModifier } from './JourneySearchModifier';
import { JourneyMap } from './JourneyMap';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface JourneyResultsProps {
  startId: string;
  startLabel: string;
  startLat: number;
  startLon: number;
  stopId: string;
  stopLabel: string;
  stopLat: number;
  stopLon: number;
  dateTime: Date;
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
  dateTime,
}: JourneyResultsProps) {
  const t = useTranslations('journey');
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedJourneyIndex, setSelectedJourneyIndex] = useState<number>(0);

  // Current search parameters
  const [searchParams, setSearchParams] = useState({
    startId,
    startLabel,
    startLat,
    startLon,
    stopId,
    stopLabel,
    stopLat,
    stopLon,
    dateTime,
  });

  useEffect(() => {
    const fetchJourneys = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const enturApiUrl = process.env.NEXT_PUBLIC_ENTUR_API_URL || 'https://api.entur.io';

        // GraphQL query for Entur Journey Planner using coordinates
        const dateTimeISO = searchParams.dateTime.toISOString();
        const query = `
          {
            trip(
              from: {
                coordinates: {
                  latitude: ${searchParams.startLat}
                  longitude: ${searchParams.startLon}
                }
              }
              to: {
                coordinates: {
                  latitude: ${searchParams.stopLat}
                  longitude: ${searchParams.stopLon}
                }
              }
              dateTime: "${dateTimeISO}"
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
                  aimedStartTime
                  aimedEndTime
                  expectedStartTime
                  expectedEndTime
                  pointsOnLink {
                    points
                  }
                  fromPlace {
                    name
                    latitude
                    longitude
                    quay {
                      name
                      publicCode
                      latitude
                      longitude
                    }
                  }
                  toPlace {
                    name
                    latitude
                    longitude
                    quay {
                      name
                      publicCode
                      latitude
                      longitude
                    }
                  }
                  fromEstimatedCall {
                    expectedDepartureTime
                    aimedDepartureTime
                    quay {
                      name
                      publicCode
                      latitude
                      longitude
                    }
                  }
                  toEstimatedCall {
                    expectedArrivalTime
                    aimedArrivalTime
                    quay {
                      name
                      publicCode
                      latitude
                      longitude
                    }
                  }
                  intermediateEstimatedCalls {
                    expectedArrivalTime
                    aimedArrivalTime
                    expectedDepartureTime
                    aimedDepartureTime
                    quay {
                      name
                      publicCode
                      latitude
                      longitude
                    }
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
  }, [searchParams]);

  return (
    <div className="min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Mobile: Compact Search Header (shown on mobile only) */}
          <div className="lg:hidden lg:col-span-12">
            <button
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-gray-900">{searchParams.startLabel}</span>
                    <span className="text-gray-400">→</span>
                    <span className="font-semibold text-gray-900">{searchParams.stopLabel}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {searchParams.dateTime instanceof Date && !isNaN(searchParams.dateTime.getTime()) ? (
                      <>
                        {searchParams.dateTime.toLocaleDateString('no-NO', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })} • {searchParams.dateTime.toLocaleTimeString('no-NO', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </>
                    ) : 'Now'}
                  </div>
                </div>
                {isSearchExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                )}
              </div>
            </button>

            {/* Expanded Search Section */}
            {isSearchExpanded && (
              <div className="mt-4">
                <JourneySearchModifier
                  initialFrom={searchParams.startLabel}
                  initialTo={searchParams.stopLabel}
                  initialFromId={searchParams.startId}
                  initialToId={searchParams.stopId}
                  initialFromLat={searchParams.startLat}
                  initialFromLon={searchParams.startLon}
                  initialToLat={searchParams.stopLat}
                  initialToLon={searchParams.stopLon}
                  initialDateTime={searchParams.dateTime}
                  onSearch={(params) => {
                    setSearchParams({
                      startId: params.startId,
                      startLabel: params.startLabel,
                      startLat: params.startLat,
                      startLon: params.startLon,
                      stopId: params.stopId,
                      stopLabel: params.stopLabel,
                      stopLat: params.stopLat,
                      stopLon: params.stopLon,
                      dateTime: params.dateTime,
                    });
                    setIsSearchExpanded(false); // Collapse after search
                  }}
                />
              </div>
            )}
          </div>

          {/* Desktop: Left Sidebar - Search Modifier (hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-0 pt-4">
              <JourneySearchModifier
              initialFrom={searchParams.startLabel}
              initialTo={searchParams.stopLabel}
              initialFromId={searchParams.startId}
              initialToId={searchParams.stopId}
              initialFromLat={searchParams.startLat}
              initialFromLon={searchParams.startLon}
              initialToLat={searchParams.stopLat}
              initialToLon={searchParams.stopLon}
              initialDateTime={searchParams.dateTime}
              onSearch={(params) => {
                setSearchParams({
                  startId: params.startId,
                  startLabel: params.startLabel,
                  startLat: params.startLat,
                  startLon: params.startLon,
                  stopId: params.stopId,
                  stopLabel: params.stopLabel,
                  stopLat: params.stopLat,
                  stopLon: params.stopLon,
                  dateTime: params.dateTime,
                });
              }}
              />
            </div>
          </div>

          {/* Main Content - Map and Journey Results */}
          <div className="lg:col-span-9 space-y-4">
            {/* Map - shown above journey cards on all screens */}
            {!isLoading && journeys.length > 0 && (
              <JourneyMap
                journey={journeys[selectedJourneyIndex]}
                startLat={searchParams.startLat}
                startLon={searchParams.startLon}
                startLabel={searchParams.startLabel}
                stopLat={searchParams.stopLat}
                stopLon={searchParams.stopLon}
                stopLabel={searchParams.stopLabel}
              />
            )}

            {/* Journey Results */}
            <div className="space-y-4">
              {isLoading ? (
                <>
                  <JourneyCardSkeleton />
                  <JourneyCardSkeleton />
                  <JourneyCardSkeleton />
                </>
              ) : error ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                  <p className="text-gray-600">{error}</p>
                </div>
              ) : journeys.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  <p className="text-gray-600">No journeys found</p>
                </div>
              ) : (
                journeys.map((journey, index) => (
                  <div
                    key={index}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedJourneyIndex(index)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedJourneyIndex(index);
                      }
                    }}
                    className={`cursor-pointer transition-all ${
                      selectedJourneyIndex === index
                        ? 'ring-2 ring-blue-500 rounded-xl'
                        : ''
                    }`}
                    aria-label={`Select journey option ${index + 1}`}
                  >
                    <JourneyCard
                      journey={journey}
                      from={searchParams.startLabel}
                      fromData={{
                        label: searchParams.startLabel,
                        lat: searchParams.startLat,
                        lon: searchParams.startLon,
                      }}
                      toData={{
                        label: searchParams.stopLabel,
                        lat: searchParams.stopLat,
                        lon: searchParams.stopLon,
                      }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
