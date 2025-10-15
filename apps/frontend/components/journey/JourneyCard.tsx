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
    <Card className="shadow-none">
      <CardContent className="p-4 sm:p-6">
        {/* Header with "From" and Duration */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate mr-2">Fra {from}</p>
          <p className="text-xs sm:text-sm text-gray-600 flex-shrink-0">
            {formatDuration(journey.duration)}
          </p>
        </div>

        {/* Main Journey Timeline */}
        <div className="flex items-start gap-0 overflow-x-auto pb-2">
          {/* First Walking */}
          {firstWalkingLeg && (
            <>
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="flex items-center justify-center bg-gray-200 rounded-lg px-2 sm:px-3 py-2 sm:py-2.5 mb-1">
                  <IoMdWalk className="w-4 sm:w-5 h-4 sm:h-5 text-gray-700" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">
                    {Math.floor(firstWalkingLeg.duration / 60)}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  {formatTime(journey.startTime)}
                </span>
              </div>
              {/* Dotted line connector */}
              <div className="flex items-center px-2 sm:px-3 pt-3 flex-shrink-0">
                <div className="border-t-2 border-dotted border-gray-300 w-4 sm:w-8"></div>
              </div>
            </>
          )}

          {/* Main Transport */}
          {mainLeg ? (
            <>
              <div className="flex flex-col items-center flex-1 min-w-0">
                {mainLeg.mode.toLowerCase() === "metro" ? (
                  /* Metro style - Orange background with T and number in white circle */
                  <>
                    <div className="flex items-center gap-1 sm:gap-1.5 bg-orange-600 text-white px-2 sm:px-2.5 py-1.5 rounded-lg mb-1">
                      <div className="flex items-center justify-center w-5 sm:w-6 h-5 sm:h-6 bg-white rounded-full flex-shrink-0">
                        <span className="text-orange-600 font-bold text-[10px] sm:text-xs">
                          T
                        </span>
                      </div>
                      <span className="font-semibold text-base sm:text-lg">
                        {mainLeg.line?.publicCode || ""}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-900">
                      {formatTime(
                        mainLeg.fromEstimatedCall?.expectedDepartureTime ||
                          journey.startTime
                      )}
                    </span>
                  </>
                ) : mainLeg.mode.toLowerCase() === "bus" ? (
                  /* Bus style - Red background with bus icon and number */
                  <>
                    <div className="flex items-center gap-1 sm:gap-1.5 bg-red-700 text-white px-2 sm:px-2.5 py-1.5 rounded-lg mb-1">
                      <Bus className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
                      <span className="font-semibold text-base sm:text-lg">
                        {mainLeg.line?.publicCode || ""}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-900">
                      {formatTime(
                        mainLeg.fromEstimatedCall?.expectedDepartureTime ||
                          journey.startTime
                      )}
                    </span>
                  </>
                ) : (
                  /* Other transport modes */
                  <>
                    <div className="flex items-center gap-1 sm:gap-1.5 bg-red-900 text-white px-2 sm:px-2.5 py-1.5 rounded-lg mb-1 w-full justify-center">
                      {/* Mode Icon - Plane icon for air, T logo for rail/tram */}
                      {["air", "plane", "flight"].includes(mainLeg.mode.toLowerCase()) ? (
                        <Plane className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
                      ) : (
                        <div className="flex items-center justify-center w-4 sm:w-5 h-4 sm:h-5 bg-white rounded-full flex-shrink-0">
                          <span className="text-orange-700 font-bold text-[10px] sm:text-xs">
                            T
                          </span>
                        </div>
                      )}
                      <span className="font-semibold text-xs sm:text-sm truncate">
                        {mainLeg.line?.publicCode || ""} {destination}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-900">
                      {formatTime(
                        mainLeg.fromEstimatedCall?.expectedDepartureTime ||
                          journey.startTime
                      )}
                    </span>
                  </>
                )}
              </div>
              {/* Dotted line connector */}
              <div className="flex items-center px-2 sm:px-3 pt-3 flex-shrink-0">
                <div className="border-t-2 border-dotted border-gray-300 w-4 sm:w-8"></div>
              </div>
            </>
          ) : (
            /* Spacer for walking-only journeys */
            <>
              <div className="flex-1 flex items-center pt-3 min-w-0">
                <div className="border-t-2 border-dotted border-gray-300 w-full"></div>
              </div>
            </>
          )}

          {/* Last Walking */}
          {lastWalkingLeg && (
            <>
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="flex items-center justify-center bg-gray-200 rounded-lg px-2 sm:px-3 py-2 sm:py-2.5 mb-1">
                  <IoMdWalk className="w-4 sm:w-5 h-4 sm:h-5 text-gray-700" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">
                    {Math.floor(lastWalkingLeg.duration / 60)}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  {formatTime(journey.endTime)}
                </span>
              </div>
              {/* Dotted line connector */}
              <div className="flex items-center px-2 sm:px-3 pt-3 flex-shrink-0">
                <div className="border-t-2 border-dotted border-gray-300 w-4 sm:w-8"></div>
              </div>
            </>
          )}

          {/* Final Destination Flag */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="flex items-center justify-center bg-gray-200 rounded-lg px-2 sm:px-3 py-2 sm:py-2.5 mb-1">
              <Flag className="w-4 sm:w-5 h-4 sm:h-5 text-gray-700" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-900">
              {formatTime(journey.endTime)}
            </span>
          </div>

          {/* Show Details Button - Desktop only */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="hidden sm:flex p-2 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0 mt-1 ml-2"
          >
            <ChevronRight
              className={`w-5 h-5 text-gray-600 transition-transform ${
                showDetails ? "rotate-90" : ""
              }`}
            />
          </button>
        </div>

        {/* Show Details Button - Mobile only (full width) */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="sm:hidden mt-3 w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <span>{showDetails ? "Skjul detaljer" : "Vis detaljer"}</span>
          <ChevronRight
            className={`w-4 h-4 text-gray-600 transition-transform ${
              showDetails ? "rotate-90" : ""
            }`}
          />
        </button>

        {/* Details section */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            {journey.legs?.map((leg: any, index: number) => (
              <div key={index}>
                {leg.mode === "foot" ? (
                  /* Walking leg */
                  <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      <IoMdWalk className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Gå i {formatDuration(leg.duration)}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        ({formatDistance(leg.distance)})
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Transit leg */
                  <div className="space-y-2">
                    {/* Departure stop */}
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {formatTime(leg.fromEstimatedCall?.expectedDepartureTime || leg.startTime)}
                        </div>
                        <div className="w-3 h-3 rounded-full border-4 border-orange-500 bg-white"></div>
                        <div className="w-0.5 bg-orange-500 flex-1 min-h-[20px]"></div>
                      </div>
                      <div className="flex-1 pb-2">
                        <p className="font-medium text-gray-900">{leg.fromPlace?.name}</p>
                        {leg.fromPlace?.quay?.publicCode && (
                          <p className="text-sm text-gray-600">
                            Spor <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-xs font-semibold">{leg.fromPlace.quay.publicCode}</span> {leg.line?.name || ""}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Line info */}
                    <div className="flex items-center gap-2 ml-6 pl-3">
                      {leg.mode.toLowerCase() === "metro" ? (
                        /* Metro badge - Orange with T and number */
                        <div className="flex items-center gap-1.5 bg-orange-600 text-white px-3 py-1.5 rounded-lg">
                          <div className="flex items-center justify-center w-5 h-5 bg-white rounded-full flex-shrink-0">
                            <span className="text-orange-600 font-bold text-[10px]">
                              T
                            </span>
                          </div>
                          <span className="font-semibold text-sm">
                            {leg.line?.publicCode || leg.line?.name || leg.mode}
                          </span>
                        </div>
                      ) : leg.mode.toLowerCase() === "bus" ? (
                        /* Bus badge - Red with bus icon and number */
                        <div className="flex items-center gap-1.5 bg-red-700 text-white px-3 py-1.5 rounded-lg">
                          <Bus className="w-5 h-5 flex-shrink-0" />
                          <span className="font-semibold text-sm">
                            {leg.line?.publicCode || leg.line?.name || leg.mode}
                          </span>
                        </div>
                      ) : (
                        /* Other transport modes */
                        <div className="flex items-center gap-2 bg-red-900 text-white px-3 py-1.5 rounded-lg">
                          {getModeIcon(leg.mode)}
                          <span className="font-semibold text-sm">
                            {leg.line?.publicCode || leg.line?.name || leg.mode}
                          </span>
                        </div>
                      )}
                      <span className="text-sm text-gray-600">
                        {leg.toPlace?.name || ""}
                      </span>
                    </div>

                    {/* Intermediate stops */}
                    {leg.intermediateEstimatedCalls && leg.intermediateEstimatedCalls.length > 0 && (
                      <div className="ml-6 pl-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const element = e.currentTarget.nextElementSibling as HTMLElement;
                            if (element) {
                              element.classList.toggle("hidden");
                              e.currentTarget.querySelector("span")!.textContent =
                                element.classList.contains("hidden")
                                  ? `${leg.intermediateEstimatedCalls.length} stopp ▲`
                                  : `${leg.intermediateEstimatedCalls.length} stopp ▼`;
                            }
                          }}
                          className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                        >
                          <span>{leg.intermediateEstimatedCalls.length} stopp ▲</span>
                        </button>
                        <div className="hidden space-y-1 mt-2">
                          {leg.intermediateEstimatedCalls.map((call: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-3 text-sm">
                              <span className="text-gray-600 w-12">
                                {formatTime(call.expectedArrivalTime || call.aimedArrivalTime)}
                              </span>
                              <span className="text-gray-700">{call.quay?.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Arrival stop */}
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 bg-orange-500 flex-1 min-h-[20px]"></div>
                        <div className="w-3 h-3 rounded-full border-4 border-orange-500 bg-white"></div>
                        <div className="text-sm font-medium text-gray-900 mt-1">
                          {formatTime(leg.toEstimatedCall?.expectedArrivalTime || leg.endTime)}
                        </div>
                      </div>
                      <div className="flex-1 pt-2">
                        <p className="font-medium text-gray-900">{leg.toPlace?.name}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Save Route Button */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button
            onClick={handleSaveTrip}
            disabled={isSaving || isSaved}
            className={`w-full ${
              isSaved
                ? "bg-green-600 hover:bg-green-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : isSaved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 mr-2" />
                Save Route
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
