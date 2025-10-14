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
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [transitTime, setTransitTime] = useState<number | null>(null);
  const [bikeTime, setBikeTime] = useState<number | null>(null);
  const [walkTime, setWalkTime] = useState<number | null>(null);

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
      alert("Please select both origin and destination");
      return;
    }

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
    <Card className="mb-6 overflow-visible shadow-none">
      <CardContent className="p-6 overflow-visible">
        <div className="space-y-4 overflow-visible">
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
          <div className="space-y-3">
            {/* Nå button - full width */}
            <button
              type="button"
              onClick={() => setSelectedDateTime(new Date())}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl py-3 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-base">Nå</span>
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
              className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl py-3 font-medium transition-colors flex flex-col items-center justify-center gap-1.5"
            >
              <Bus className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs leading-tight text-center whitespace-nowrap">{transitTime ? formatMinutesToTime(transitTime) : '...'}</span>
            </button>
            <button
              type="button"
              className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl py-3 font-medium transition-colors flex flex-col items-center justify-center gap-1.5"
            >
              <Bike className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs leading-tight text-center whitespace-nowrap">{bikeTime ? formatMinutesToTime(bikeTime) : '...'}</span>
            </button>
            <button
              type="button"
              className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl py-3 font-medium transition-colors flex flex-col items-center justify-center gap-1.5"
            >
              <Footprints className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs leading-tight text-center whitespace-nowrap">{walkTime ? formatMinutesToTime(walkTime) : '...'}</span>
            </button>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="w-full py-6 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-lg font-semibold"
          >
            Søk
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
