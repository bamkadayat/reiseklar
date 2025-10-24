"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LocationAutocomplete,
  LocationData,
} from "@/components/landing/LocationAutocomplete";
import { DateTimePicker } from "@/components/landing/DateTimePicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownUp, Bus, Bike, Footprints } from "lucide-react";

interface JourneySearchModifierProps {
  initialFrom: string;
  initialTo: string;
  initialFromId?: string;
  initialToId?: string;
  initialFromLat?: number;
  initialFromLon?: number;
  initialToLat?: number;
  initialToLon?: number;
  initialDateTime?: Date;
  onSearch?: (params: {
    startId: string;
    startLabel: string;
    startLat: number;
    startLon: number;
    stopId: string;
    stopLabel: string;
    stopLat: number;
    stopLon: number;
    dateTime: Date;
  }) => void;
}

// Helper function to format minutes to days, hours and minutes
const formatMinutesToTime = (minutes: number) => {
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

export function JourneySearchModifier({
  initialFrom,
  initialTo,
  initialFromId,
  initialToId,
  initialFromLat,
  initialFromLon,
  initialToLat,
  initialToLon,
  initialDateTime,
  onSearch,
}: JourneySearchModifierProps) {
  const router = useRouter();
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [fromData, setFromData] = useState<LocationData | undefined>(
    initialFromId && initialFromLat && initialFromLon
      ? {
          id: initialFromId,
          name: initialFrom,
          label: initialFrom,
          latitude: initialFromLat,
          longitude: initialFromLon,
        }
      : undefined
  );
  const [toData, setToData] = useState<LocationData | undefined>(
    initialToId && initialToLat && initialToLon
      ? {
          id: initialToId,
          name: initialTo,
          label: initialTo,
          latitude: initialToLat,
          longitude: initialToLon,
        }
      : undefined
  );
  const [selectedDateTime, setSelectedDateTime] = useState(initialDateTime || new Date());
  const [transitTime, setTransitTime] = useState<number | null>(null);
  const [bikeTime, setBikeTime] = useState<number | null>(null);
  const [walkTime, setWalkTime] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Calculate distance and times when locations are available
  useEffect(() => {
    if (initialFromLat && initialFromLon && initialToLat && initialToLon) {
      // Haversine formula to calculate distance
      const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
      };

      const distance = calculateDistance(initialFromLat, initialFromLon, initialToLat, initialToLon);

      // Average speeds (km/h): walking = 5, biking = 15, transit = 30
      setWalkTime(Math.round((distance / 5) * 60)); // minutes
      setBikeTime(Math.round((distance / 15) * 60)); // minutes
      setTransitTime(Math.round((distance / 30) * 60)); // minutes
    }
  }, [initialFromLat, initialFromLon, initialToLat, initialToLon]);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setFromData(toData);
    setToData(fromData);
  };

  const handleSearch = () => {
    if (!fromData || !toData) {
      setErrorMessage("Please select both origin and destination");
      return;
    }
    setErrorMessage('');

    // If onSearch callback is provided, use it (no page reload)
    if (onSearch) {
      onSearch({
        startId: fromData.id,
        startLabel: fromData.label,
        startLat: fromData.latitude,
        startLon: fromData.longitude,
        stopId: toData.id,
        stopLabel: toData.label,
        stopLat: toData.latitude,
        stopLon: toData.longitude,
        dateTime: selectedDateTime,
      });
    } else {
      // Otherwise, navigate to new page (for initial search from landing page)
      const params = new URLSearchParams({
        startId: fromData.id,
        startLabel: fromData.label,
        startLat: fromData.latitude.toString(),
        startLon: fromData.longitude.toString(),
        stopId: toData.id,
        stopLabel: toData.label,
        stopLat: toData.latitude.toString(),
        stopLon: toData.longitude.toString(),
        date: selectedDateTime.getTime().toString(),
      });

      router.push(`/journey?${params.toString()}`);
    }
  };

  return (
    <Card className="mb-4 overflow-visible shadow-none">
      <CardContent className="p-4 overflow-visible">
        {/* Error message banner */}
        {errorMessage && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <svg
              className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs text-red-800 font-medium flex-1">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage('')}
              className="text-red-600 hover:text-red-800"
              aria-label="Dismiss error message"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
        <div className="space-y-3 overflow-visible">
          {/* From Location */}
          <div className="relative">
            <LocationAutocomplete
              value={from}
              onChange={(value, data) => {
                setFrom(value);
                if (data) setFromData(data);
              }}
              placeholder={initialFrom}
              icon="circle"
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowDownUp className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* To Location */}
          <div className="relative">
            <LocationAutocomplete
              value={to}
              onChange={(value, data) => {
                setTo(value);
                if (data) setToData(data);
              }}
              placeholder={initialTo}
              icon="pin"
            />
          </div>

          {/* Date and Time Pickers */}
          <div className="space-y-2">
            {/* Nå button - full width */}
            <button
              type="button"
              onClick={() => setSelectedDateTime(new Date())}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl py-2.5 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-sm">Nå</span>
            </button>

            {/* Date and Time stacked vertically */}
            <div className="w-full">
              <DateTimePicker
                date={selectedDateTime}
                onDateChange={setSelectedDateTime}
                label="Reisedato"
                showOnlyDate
              />
            </div>
            <div className="w-full">
              <DateTimePicker
                date={selectedDateTime}
                onDateChange={setSelectedDateTime}
                label="Tidspunkt"
                showOnlyTime
              />
            </div>
          </div>

          {/* Transport Mode Options */}
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl py-2.5 font-medium transition-colors flex flex-col items-center justify-center gap-1"
            >
              <Bus className="w-4 h-4 flex-shrink-0" />
              <span className="text-[10px] leading-tight text-center whitespace-nowrap">{transitTime ? formatMinutesToTime(transitTime) : '...'}</span>
            </button>
            <button
              type="button"
              className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl py-2.5 font-medium transition-colors flex flex-col items-center justify-center gap-1"
            >
              <Bike className="w-4 h-4 flex-shrink-0" />
              <span className="text-[10px] leading-tight text-center whitespace-nowrap">{bikeTime ? formatMinutesToTime(bikeTime) : '...'}</span>
            </button>
            <button
              type="button"
              className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl py-2.5 font-medium transition-colors flex flex-col items-center justify-center gap-1"
            >
              <Footprints className="w-4 h-4 flex-shrink-0" />
              <span className="text-[10px] leading-tight text-center whitespace-nowrap">{walkTime ? formatMinutesToTime(walkTime) : '...'}</span>
            </button>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-base font-semibold"
          >
            Søk
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
