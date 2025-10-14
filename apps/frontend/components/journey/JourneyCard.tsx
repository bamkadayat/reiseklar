"use client";

import { useTranslations } from "next-intl";
import { Train, Bus, Cable, Ship, ChevronRight, Flag } from "lucide-react";
import { IoMdWalk } from "react-icons/io";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface JourneyCardProps {
  journey: any;
  from: string;
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

export function JourneyCard({ journey, from }: JourneyCardProps) {
  const t = useTranslations("journey");
  const [showDetails, setShowDetails] = useState(false);

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
                <div className="flex items-center gap-1 sm:gap-1.5 bg-red-900 text-white px-2 sm:px-2.5 py-1.5 rounded-lg mb-1 w-full justify-center">
                  {/* Mode Icon - Bus icon for bus, T logo for rail/metro/tram */}
                  {mainLeg.mode.toLowerCase() === "bus" ? (
                    <Bus className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
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
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
            {journey.legs?.map((leg: any, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getModeIcon(leg.mode)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {leg.mode === "foot" ? "Walk" : leg.line?.name || leg.mode}
                  </p>
                  <p className="text-sm text-gray-600">
                    {leg.fromPlace?.name} → {leg.toPlace?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDuration(leg.duration)} • {formatDistance(leg.distance)}
                  </p>
                </div>
                <div className="text-sm text-gray-600">
                  {leg.fromEstimatedCall?.expectedDepartureTime &&
                    formatTime(leg.fromEstimatedCall.expectedDepartureTime)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
