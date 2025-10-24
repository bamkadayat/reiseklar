"use client";

import { useTranslations } from "next-intl";
import { Train, Bus, Cable, Ship, ChevronRight, Flag, Plane, Bookmark, Check } from "lucide-react";
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
      return <Bus className="w-5 h-5" />;
    case "tram":
      return <Cable className="w-5 h-5" />;
    case "rail":
    case "train":
      return <Train className="w-5 h-5" />;
    case "metro":
      return <Train className="w-5 h-5" />;
    case "water":
    case "ferry":
      return <Ship className="w-5 h-5" />;
    case "air":
    case "plane":
    case "flight":
      return <Plane className="w-5 h-5" />;
    case "foot":
      return <IoMdWalk className="w-5 h-5" />;
    default:
      return <Bus className="w-5 h-5" />;
  }
};

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);

  if (minutes >= 1440) { // 24 hours = 1440 minutes
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
    const kilometers = (meters / 1000).toFixed(2);
    return `${kilometers} km`;
  }
  return `${Math.round(meters)} m`;
};

export function JourneyCard({ journey, from, fromData, toData }: JourneyCardProps) {
  const t = useTranslations("journey");
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const mainLeg = journey.legs?.find((leg: any) => leg.mode !== "foot");
  const totalWalkingTime = journey.legs
    ?.filter((leg: any) => leg.mode === "foot")
    .reduce((sum: number, leg: any) => sum + (leg.duration || 0), 0);

  const firstWalkingLeg = journey.legs?.find(
    (leg: any) => leg.mode === "foot" && leg.fromPlace
  );
  const lastWalkingLeg = [...(journey.legs || [])]
    .reverse()
    .find((leg: any) => leg.mode === "foot" && leg.toPlace);

  // Get the destination from the main leg
  const destination = mainLeg?.toPlace?.name || mainLeg?.line?.name || "";

  const handleSaveTrip = async () => {
    // Check if user is logged in
    if (!isAuthenticated) {
      // Redirect to login page
      router.push('/signIn');
      return;
    }

    // Check if we have the required data
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
      // Reset the saved state after 3 seconds
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error: any) {
      console.error('Error saving trip:', error);
      alert(error.message || 'Failed to save trip. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow border border-gray-200">
      <CardContent className="p-0">
        {/* Header Section with Better Visual Hierarchy */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                {getModeIcon(mainLeg?.mode || "bus")}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Total journey time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDuration(journey.duration)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">From</p>
              <p className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">{from}</p>
            </div>
          </div>
        </div>

        {/* Main Journey Timeline Section */}
        <div className="p-4 sm:p-6">

          {/* Improved Timeline with Clear Visual Steps */}
          <div className="space-y-6">
            {/* Start Point */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-24 sm:w-32 text-right">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {formatTime(journey.startTime)}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Departure</p>
              </div>
              <div className="relative flex-shrink-0">
                <div className="w-5 h-5 rounded-full bg-green-500 ring-4 ring-green-100"></div>
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-300"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-base sm:text-lg truncate">{from}</p>
              </div>
            </div>

            {/* First Walking Segment */}
            {firstWalkingLeg && (
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-24 sm:w-32"></div>
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-gray-300">
                    <IoMdWalk className="w-6 h-6 text-gray-700" aria-hidden="true" />
                  </div>
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-300"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">Walk {Math.floor(firstWalkingLeg.duration / 60)} min</p>
                  <p className="text-sm text-gray-600">{formatDistance(firstWalkingLeg.distance)}</p>
                </div>
              </div>
            )}

            {/* Main Transport Segment */}
            {mainLeg && (
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-24 sm:w-32"></div>
                <div className="relative flex-shrink-0">
                  {mainLeg.mode.toLowerCase() === "metro" ? (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-bold text-xs">T</span>
                        </div>
                        <span className="text-white font-bold text-lg">{mainLeg.line?.publicCode}</span>
                      </div>
                    </div>
                  ) : mainLeg.mode.toLowerCase() === "bus" ? (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg">
                      <div className="flex items-center gap-1">
                        <Bus className="w-5 h-5 text-white" aria-hidden="true" />
                        <span className="text-white font-bold text-lg">{mainLeg.line?.publicCode}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                      {getModeIcon(mainLeg.mode)}
                    </div>
                  )}
                  <div className="absolute top-14 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-300"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-base sm:text-lg">
                    {mainLeg.line?.name || mainLeg.mode}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {mainLeg.mode.toUpperCase()} • {formatDuration(mainLeg.duration)}
                  </p>
                  {destination && (
                    <p className="text-sm text-gray-600">To: {destination}</p>
                  )}
                </div>
              </div>
            )}

            {/* Last Walking Segment */}
            {lastWalkingLeg && (
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-24 sm:w-32"></div>
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-gray-300">
                    <IoMdWalk className="w-6 h-6 text-gray-700" aria-hidden="true" />
                  </div>
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-300"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">Walk {Math.floor(lastWalkingLeg.duration / 60)} min</p>
                  <p className="text-sm text-gray-600">{formatDistance(lastWalkingLeg.distance)}</p>
                </div>
              </div>
            )}

            {/* End Point */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-24 sm:w-32 text-right">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {formatTime(journey.endTime)}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Arrival</p>
              </div>
              <div className="relative flex-shrink-0">
                <div className="w-5 h-5 rounded-full bg-red-500 ring-4 ring-red-100"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                  {mainLeg?.toPlace?.name || destination || "Destination"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons - Better Design */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border-2 border-blue-200 hover:border-blue-300"
              aria-expanded={showDetails}
              aria-label={showDetails ? "Hide journey details" : "Show journey details"}
            >
              <span>{showDetails ? "Hide Details" : "Show Details"}</span>
              <ChevronRight
                className={`w-4 h-4 transition-transform ${
                  showDetails ? "rotate-90" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            <Button
              onClick={handleSaveTrip}
              disabled={isSaving || isSaved}
              className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all shadow-md ${
                isSaved
                  ? "bg-green-600 hover:bg-green-600 text-white"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              }`}
              aria-label={isSaved ? "Route saved" : "Save this route"}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" aria-hidden="true"></div>
                  Saving...
                </>
              ) : isSaved ? (
                <>
                  <Check className="w-4 h-4 mr-2" aria-hidden="true" />
                  Saved!
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 mr-2" aria-hidden="true" />
                  Save Route
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Improved Details Section */}
        {showDetails && (
          <div className="mt-6 p-4 sm:p-6 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                {journey.legs?.length || 0}
              </span>
              Journey Steps
            </h3>
            <div className="space-y-6">
              {journey.legs?.map((leg: any, index: number) => (
                <div key={index} className="relative">
                  {leg.mode === "foot" ? (
                    /* Walking leg - Improved Design */
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-gray-300">
                            <IoMdWalk className="w-6 h-6 text-gray-700" aria-hidden="true" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-gray-900 text-base">Walk</p>
                            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                              {formatDuration(leg.duration)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            Distance: <span className="font-medium">{formatDistance(leg.distance)}</span>
                          </p>
                          {leg.fromPlace?.name && (
                            <p className="text-sm text-gray-600 mt-1">
                              From: {leg.fromPlace.name}
                            </p>
                          )}
                          {leg.toPlace?.name && (
                            <p className="text-sm text-gray-600">
                              To: {leg.toPlace.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Transit leg - Improved Design */
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      {/* Transit Header */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {leg.mode.toLowerCase() === "metro" ? (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                                <div className="flex items-center gap-1">
                                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                    <span className="text-orange-600 font-bold text-[10px]">T</span>
                                  </div>
                                  <span className="text-white font-bold text-base">{leg.line?.publicCode}</span>
                                </div>
                              </div>
                            ) : leg.mode.toLowerCase() === "bus" ? (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-md">
                                <div className="flex items-center gap-1">
                                  <Bus className="w-5 h-5 text-white" aria-hidden="true" />
                                  <span className="text-white font-bold text-base">{leg.line?.publicCode}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md">
                                {getModeIcon(leg.mode)}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900 text-base">
                                {leg.line?.name || leg.mode.toUpperCase()}
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatDuration(leg.duration)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Transit Timeline */}
                      <div className="p-4 space-y-4">
                        {/* Departure Stop */}
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div className="text-base font-bold text-gray-900 mb-2">
                              {formatTime(leg.fromEstimatedCall?.expectedDepartureTime || leg.startTime)}
                            </div>
                            <div className="w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-100"></div>
                            <div className="w-0.5 bg-gradient-to-b from-green-500 to-blue-500 flex-1 min-h-[40px] mt-2"></div>
                          </div>
                          <div className="flex-1 pt-2">
                            <p className="font-semibold text-gray-900 text-base mb-1">{leg.fromPlace?.name}</p>
                            {leg.fromPlace?.quay?.publicCode && (
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs font-medium text-gray-600">Platform</span>
                                <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg bg-blue-100 text-blue-900 text-sm font-bold border border-blue-200">
                                  {leg.fromPlace.quay.publicCode}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Intermediate Stops */}
                        {leg.intermediateEstimatedCalls && leg.intermediateEstimatedCalls.length > 0 && (
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-0.5 bg-gradient-to-b from-blue-500 to-blue-500 h-8"></div>
                            </div>
                            <div className="flex-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const element = e.currentTarget.nextElementSibling as HTMLElement;
                                  if (element) {
                                    element.classList.toggle("hidden");
                                    const isHidden = element.classList.contains("hidden");
                                    e.currentTarget.querySelector("span")!.textContent =
                                      isHidden
                                        ? `Show ${leg.intermediateEstimatedCalls.length} stops`
                                        : `Hide ${leg.intermediateEstimatedCalls.length} stops`;
                                    const icon = e.currentTarget.querySelector("svg");
                                    if (icon) {
                                      icon.style.transform = isHidden ? "rotate(0deg)" : "rotate(180deg)";
                                    }
                                  }
                                }}
                                className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 font-semibold bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-all"
                                aria-label={`Toggle ${leg.intermediateEstimatedCalls.length} intermediate stops`}
                              >
                                <span>Show {leg.intermediateEstimatedCalls.length} stops</span>
                                <ChevronRight className="w-4 h-4 transition-transform" aria-hidden="true" style={{transform: "rotate(0deg)"}} />
                              </button>
                              <div className="hidden space-y-2 mt-3 pl-4 border-l-2 border-gray-200">
                                {leg.intermediateEstimatedCalls.map((call: any, idx: number) => (
                                  <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                                    <span className="text-sm font-medium text-gray-900 w-14 flex-shrink-0">
                                      {formatTime(call.expectedArrivalTime || call.aimedArrivalTime)}
                                    </span>
                                    <div className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></div>
                                    <span className="text-sm text-gray-700 flex-1">{call.quay?.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Arrival Stop */}
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div className="w-0.5 bg-gradient-to-b from-blue-500 to-red-500 flex-1 min-h-[40px] mb-2"></div>
                            <div className="w-4 h-4 rounded-full bg-red-500 ring-4 ring-red-100"></div>
                            <div className="text-base font-bold text-gray-900 mt-2">
                              {formatTime(leg.toEstimatedCall?.expectedArrivalTime || leg.endTime)}
                            </div>
                          </div>
                          <div className="flex-1 pt-2">
                            <p className="font-semibold text-gray-900 text-base">{leg.toPlace?.name}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                )}
              </div>
            ))}
          </div>
        </div>
        )}
      </CardContent>
    </Card>
  );
}
