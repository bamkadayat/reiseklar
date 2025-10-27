"use client";

import { useTranslations } from "next-intl";
import { Train, Bus, Cable, Ship, ChevronDown, ChevronUp, Plane, Bookmark, Check } from "lucide-react";
import { IoMdWalk } from "react-icons/io";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { tripsService } from "@/lib/api/trips.service";
import { useRouter } from "next/navigation";

interface JourneyCardProps {
  journey: any;
  from: string;
  fromData?: {
    label: string;
    lat: number;
    lon: number;
  };
  toData?: {
    label: string;
    lat: number;
    lon: number;
  };
}

const getModeIcon = (mode: string) => {
  switch (mode.toLowerCase()) {
    case "bus":
      return <Bus className="w-4 h-4" />;
    case "tram":
      return <Cable className="w-4 h-4" />;
    case "rail":
    case "train":
      return <Train className="w-4 h-4" />;
    case "metro":
      return <Train className="w-4 h-4" />;
    case "water":
    case "ferry":
      return <Ship className="w-4 h-4" />;
    case "air":
    case "plane":
    case "flight":
      return <Plane className="w-4 h-4" />;
    case "foot":
      return <IoMdWalk className="w-4 h-4" />;
    default:
      return <Bus className="w-4 h-4" />;
  }
};

const formatTime = (isoString: string) => {
  if (!isoString) return "Invalid Date";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);

  if (minutes >= 1440) {
    const days = Math.floor(minutes / 1440);
    const remainingMinutes = minutes % 1440;
    const hours = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;

    if (hours > 0 && mins > 0) {
      return `${days} d ${hours} h ${mins} min`;
    } else if (hours > 0) {
      return `${days} d ${hours} h`;
    } else if (mins > 0) {
      return `${days} d ${mins} min`;
    }
    return `${days} d`;
  } else if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours} h ${remainingMinutes} min` : `${hours} h`;
  }
  return `${minutes} min`;
};

const formatDistance = (meters: number) => {
  if (meters >= 1000) {
    const kilometers = (meters / 1000).toFixed(1);
    return `${kilometers} km`;
  }
  return `${Math.round(meters)} meter`;
};

export function JourneyCard({ journey, from, fromData, toData }: JourneyCardProps) {
  const t = useTranslations("journey");
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [expandedLegs, setExpandedLegs] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const toggleLegExpansion = (index: number) => {
    const newExpanded = new Set(expandedLegs);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedLegs(newExpanded);
  };

  const handleSaveTrip = async () => {
    if (!isAuthenticated) {
      router.push('/signIn');
      return;
    }

    if (!fromData || !toData) {
      alert('Missing location data. Please try searching again.');
      return;
    }

    setIsSaving(true);
    try {
      await tripsService.createTrip({
        origin: {
          label: fromData.label,
          lat: fromData.lat,
          lon: fromData.lon,
          address: fromData.label,
        },
        destination: {
          label: toData.label,
          lat: toData.lat,
          lon: toData.lon,
          address: toData.label,
        },
        accessibility: 'none',
      });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error: any) {
      console.error('Error saving trip:', error);
      alert(error.message || 'Failed to save trip. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow border border-gray-200 bg-white">
      <CardContent className="p-3 sm:p-4 md:p-6">
        {/* Header - Time Range and Duration */}
        <div className="mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-100">
          {/* Time - Full width on mobile */}
          <div className="flex items-center justify-between mb-2 md:mb-0">
            <span className="text-base sm:text-lg font-semibold text-gray-900">
              {formatTime(journey.startTime)} - {formatTime(journey.endTime)}
            </span>
            {/* Duration - Show on mobile next to time */}
            <span className="text-base sm:text-lg font-bold text-gray-900 md:hidden">
              {formatDuration(journey.duration)}
            </span>
          </div>

          {/* Transport Modes and Duration - Wrap on mobile */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2 md:mt-3">
            {/* Walking icon with duration */}
            {journey.legs?.some((leg: any) => leg.mode === "foot") && (
              <div className="flex items-center gap-1 bg-gray-100 px-1.5 sm:px-2 py-1 rounded-lg">
                <IoMdWalk className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  {Math.floor(
                    journey.legs
                      ?.filter((leg: any) => leg.mode === "foot")
                      .reduce((sum: number, leg: any) => sum + (leg.duration || 0), 0) / 60
                  )}
                </span>
              </div>
            )}

            {/* Transit icons */}
            {journey.legs
              ?.filter((leg: any) => leg.mode !== "foot")
              .map((leg: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 bg-transit-red text-white px-1.5 sm:px-2 py-1 rounded-lg font-medium text-xs sm:text-sm"
                >
                  {getModeIcon(leg.mode)}
                  <span>{leg.line?.publicCode || leg.mode.charAt(0).toUpperCase()}</span>
                </div>
              ))}

            {/* Total duration - Hidden on mobile, shown on desktop */}
            <div className="hidden md:flex items-center gap-1 ml-2">
              <span className="text-lg font-bold text-gray-900">
                {formatDuration(journey.duration)}
              </span>
              <ChevronUp className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-0">
          {journey.legs?.map((leg: any, index: number) => (
            <div key={index} className="relative">
              {/* Walking Leg */}
              {leg.mode === "foot" ? (
                <div className="flex items-start gap-2 sm:gap-3">
                  {/* Time Column */}
                  <div className="w-10 sm:w-12 flex-shrink-0">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">
                      {formatTime(leg.expectedStartTime || leg.aimedStartTime)}
                    </div>
                  </div>

                  {/* Timeline Column */}
                  <div className="flex flex-col items-center flex-shrink-0 w-8 sm:w-12">
                    {index === 0 && (
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-900 mb-2"></div>
                    )}
                    <div className="w-[2px] bg-gray-300 flex-1 min-h-[50px] sm:min-h-[60px]"></div>
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 pb-3 sm:pb-4">
                    <div className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">
                      {leg.fromPlace?.name || (index === 0 ? from : "")}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      <span className="font-medium">Gå {Math.floor(leg.duration / 60)} min</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      ({formatDistance(leg.distance)})
                    </div>
                  </div>
                </div>
              ) : (
                /* Transit Leg */
                <div className="flex items-start gap-2 sm:gap-3">
                  {/* Time Column */}
                  <div className="w-10 sm:w-12 flex-shrink-0">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">
                      {formatTime(leg.fromEstimatedCall?.expectedDepartureTime || leg.fromEstimatedCall?.aimedDepartureTime)}
                    </div>
                  </div>

                  {/* Timeline Column */}
                  <div className="flex flex-col items-center flex-shrink-0 w-8 sm:w-12">
                    {index === 0 && (
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-900 mb-2"></div>
                    )}
                    <div className="w-[3px] bg-transit-red flex-1 min-h-[80px] sm:min-h-[100px]"></div>
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 pb-3 sm:pb-4">
                    {/* Departure Stop */}
                    <div className="mb-2 sm:mb-3">
                      <div className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">
                        {leg.fromPlace?.name}
                      </div>
                      {leg.fromPlace?.quay?.publicCode && (
                        <div className="text-xs text-gray-500">
                          Spor: <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded bg-yellow-400 text-gray-900 font-bold text-[10px] sm:text-xs">{leg.fromPlace.quay.publicCode}</span> Retning sentrum
                        </div>
                      )}
                    </div>

                    {/* Transit Info */}
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
                      <div className="flex items-center gap-1 bg-transit-red text-white px-1.5 sm:px-2 py-1 rounded font-medium text-xs sm:text-sm">
                        {getModeIcon(leg.mode)}
                        <span>{leg.line?.publicCode}</span>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        {leg.line?.name || "Stortinget"}
                      </span>
                    </div>

                    {/* Intermediate Stops */}
                    {leg.intermediateEstimatedCalls && leg.intermediateEstimatedCalls.length > 0 && (
                      <div className="mb-2 sm:mb-3">
                        <button
                          onClick={() => toggleLegExpansion(index)}
                          className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 hover:text-gray-900 font-medium"
                        >
                          <span>{leg.intermediateEstimatedCalls.length} stopp</span>
                          {expandedLegs.has(index) ? (
                            <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          )}
                        </button>

                        {expandedLegs.has(index) && (
                          <div className="mt-1.5 sm:mt-2 space-y-0.5 sm:space-y-1 pl-3 sm:pl-4 border-l-2 border-gray-200">
                            {leg.intermediateEstimatedCalls.map((call: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-2 py-0.5 sm:py-1">
                                <span className="text-[10px] sm:text-xs text-gray-500 w-8 sm:w-10">
                                  {formatTime(call.expectedArrivalTime || call.aimedArrivalTime)}
                                </span>
                                <span className="text-xs sm:text-sm text-gray-700">{call.quay?.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Arrival Time */}
                    <div className="flex items-start gap-2 sm:gap-3 mt-1.5 sm:mt-2">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 w-10 sm:w-12">
                        {formatTime(leg.toEstimatedCall?.expectedArrivalTime || leg.toEstimatedCall?.aimedArrivalTime)}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-900">
                        {leg.toPlace?.name}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Final Destination */}
              {index === journey.legs.length - 1 && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-10 sm:w-12 flex-shrink-0">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">
                      {formatTime(journey.endTime)}
                    </div>
                  </div>
                  <div className="flex flex-col items-center flex-shrink-0 w-8 sm:w-12">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-900"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-gray-900">
                      {leg.toPlace?.name || "Destination"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
          <Button
            onClick={handleSaveTrip}
            disabled={isSaving || isSaved}
            className={`w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
              isSaved
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-norwegian-blue hover:bg-norwegian-blue-700 text-white"
            }`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                <span>Lagrer...</span>
              </>
            ) : isSaved ? (
              <>
                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Lagret!</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Lagre rute</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
