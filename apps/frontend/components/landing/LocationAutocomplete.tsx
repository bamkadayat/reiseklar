'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface LocationData {
  id: string;
  name: string;
  label: string;
  latitude: number;
  longitude: number;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string, locationData?: LocationData) => void;
  placeholder: string;
  icon?: 'circle' | 'pin';
}

interface EnturLocation {
  id: string;
  name: string;
  label: string;
  latitude: number;
  longitude: number;
}

export function LocationAutocomplete({
  value,
  onChange,
  placeholder,
  icon = 'circle',
}: LocationAutocompleteProps) {
  const t = useTranslations('home.search');
  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState<EnturLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const searchLocations = async () => {
      if (!value || value.length < 2) {
        setLocations([]);
        return;
      }

      // Abort previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      setIsLoading(true);

      try {
        const enturApiUrl = process.env.NEXT_PUBLIC_ENTUR_API_URL || 'https://api.entur.io';
        const clientName = process.env.NEXT_PUBLIC_ENTUR_CLIENT_NAME || 'reiseklar-norway';

        const response = await fetch(
          `${enturApiUrl}/geocoder/v1/autocomplete?text=${encodeURIComponent(
            value
          )}&lang=en&size=10`,
          {
            headers: {
              'ET-Client-Name': clientName,
            },
            signal: abortControllerRef.current.signal,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }

        const data = await response.json();

        if (data.features && Array.isArray(data.features)) {
          const parsedLocations: EnturLocation[] = data.features.map((feature: any) => ({
            id: feature.properties.id || '',
            name: feature.properties.name || '',
            label: feature.properties.label || '',
            latitude: feature.geometry.coordinates[1],
            longitude: feature.geometry.coordinates[0],
          }));

          setLocations(parsedLocations);
          setIsOpen(parsedLocations.length > 0);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching locations:', error);
          setLocations([]);
          setIsOpen(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchLocations, 300); // Debounce

    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (location: EnturLocation) => {
    onChange(location.label, {
      id: location.id,
      name: location.name,
      label: location.label,
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setIsOpen(false);
  };

  const handleUseMyPosition = () => {
    setIsGettingLocation(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Reverse geocode to get location name
          try {
            const enturApiUrl = process.env.NEXT_PUBLIC_ENTUR_API_URL || 'https://api.entur.io';
            const clientName = process.env.NEXT_PUBLIC_ENTUR_CLIENT_NAME || 'reiseklar-norway';

            const response = await fetch(
              `${enturApiUrl}/geocoder/v1/reverse?point.lat=${latitude}&point.lon=${longitude}&size=1`,
              {
                headers: {
                  'ET-Client-Name': clientName,
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              if (data.features && data.features.length > 0) {
                const feature = data.features[0];
                const locationLabel = feature.properties.label || 'Your position';
                onChange(locationLabel, {
                  id: `${latitude},${longitude}`,
                  name: feature.properties.name || 'Your position',
                  label: locationLabel,
                  latitude,
                  longitude,
                });
              } else {
                // Fallback if no address found
                onChange('Your position', {
                  id: `${latitude},${longitude}`,
                  name: 'Your position',
                  label: 'Your position',
                  latitude,
                  longitude,
                });
              }
            }
          } catch (error) {
            console.error('Error reverse geocoding:', error);
            // Use coordinates as fallback
            onChange('Your position', {
              id: `${latitude},${longitude}`,
              name: 'Your position',
              label: 'Your position',
              latitude,
              longitude,
            });
          }

          setIsOpen(false);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please check your browser permissions.');
          setIsGettingLocation(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
    }
  };

  return (
    <div ref={wrapperRef} className="flex-1 relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        {icon === 'circle' ? (
          <div className="w-3 h-3 rounded-full border-2 border-red-500"></div>
        ) : (
          <MapPin className="w-5 h-5 text-red-500" />
        )}
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        className="w-full pl-10 pr-10 py-6 bg-gray-100 rounded-xl border-0 focus-visible:ring-2 focus-visible:ring-blue-500 text-gray-900 text-base"
        autoComplete="off"
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-50">
          {/* Your Position Option */}
          <button
            onClick={handleUseMyPosition}
            disabled={isGettingLocation}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100"
          >
            {isGettingLocation ? (
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
            ) : (
              <Navigation className="w-4 h-4 text-blue-600 flex-shrink-0" />
            )}
            <span className="text-gray-900 font-medium">
              {isGettingLocation ? 'Getting your location...' : t('yourPosition') || 'Your position'}
            </span>
          </button>

          {/* Search Results */}
          {locations.length > 0 && locations.map((location) => (
            <button
              key={location.id}
              onClick={() => handleSelect(location)}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors flex items-center gap-3 last:rounded-b-xl"
            >
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-gray-900 font-medium">{location.name}</span>
                {location.label !== location.name && (
                  <span className="text-sm text-gray-500">{location.label}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
