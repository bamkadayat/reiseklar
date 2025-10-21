'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2, Navigation, X, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { EnturLocation } from '@reiseklar/shared';

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
  const [hasSelected, setHasSelected] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const searchLocations = async () => {
      if (!value || value.length < 2) {
        setLocations([]);
        // Don't close dropdown if user is focused - they should still see "Your position" option
        if (!isFocused) {
          setIsOpen(false);
        }
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
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

        const response = await fetch(
          `${backendUrl}/api/entur/autocomplete?text=${encodeURIComponent(
            value
          )}&lang=en&size=10`,
          {
            signal: abortControllerRef.current.signal,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }

        const result = await response.json();

        if (result.success && result.data && Array.isArray(result.data)) {
          setLocations(result.data);
          // Keep dropdown open if focused, even if no results
          if (isFocused) {
            setIsOpen(true);
          } else {
            setIsOpen(result.data.length > 0);
          }
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching locations:', error);
          setLocations([]);
          // Don't close dropdown if user is focused
          if (!isFocused) {
            setIsOpen(false);
          }
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
  }, [value, isFocused]);

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
    setIsFocused(false);
    setHasSelected(true);
    setLocations([]);
  };

  // Reset hasSelected when value changes (user is editing)
  useEffect(() => {
    if (hasSelected && value.length < 2) {
      // User is deleting the selected value
      setHasSelected(false);
    }
  }, [value, hasSelected]);

  const handleUseMyPosition = () => {
    setIsGettingLocation(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Reverse geocode to get location name
          try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

            const response = await fetch(
              `${backendUrl}/api/entur/reverse?lat=${latitude}&lon=${longitude}&size=1`
            );

            if (response.ok) {
              const result = await response.json();
              if (result.success && result.data && result.data.length > 0) {
                const location = result.data[0];
                onChange(location.label, {
                  id: location.id,
                  name: location.name,
                  label: location.label,
                  latitude: location.latitude,
                  longitude: location.longitude,
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
          setIsFocused(false);
          setHasSelected(true);
          setLocations([]);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          let errorMessage = 'Unable to get your location. ';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Please allow location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out.';
              break;
            default:
              errorMessage += 'An unknown error occurred.';
          }

          alert(errorMessage);
          setIsGettingLocation(false);
          setIsOpen(false);
          setIsFocused(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
    }
  };

  return (
    <div ref={wrapperRef} className="flex-1 relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1">
        {icon === 'circle' ? (
          <div className={`w-3 h-3 rounded-full border-2 transition-colors ${
            hasSelected ? 'border-blue-900 bg-blue-900' : 'border-red-800'
          }`}></div>
        ) : (
          <MapPin className={`w-5 h-5 transition-colors ${
            hasSelected ? 'text-blue-900' : 'text-red-800'
          }`} />
        )}
        {hasSelected && (
          <CheckCircle2 className="w-4 h-4 text-blue-900 animate-in zoom-in duration-200" />
        )}
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          onChange(newValue);
          // Reset hasSelected flag when user starts typing again
          if (hasSelected) {
            setHasSelected(false);
          }
          // Ensure dropdown opens when user is typing
          if (newValue.length >= 2 || newValue.length === 0) {
            setIsOpen(true);
          }
        }}
        onFocus={(e) => {
          setIsFocused(true);
          // Always open dropdown on focus to show "Your position" option
          setIsOpen(true);
          // Select all text when clicking on a selected value for easy replacement
          if (hasSelected && value) {
            e.target.select();
          }
        }}
        onBlur={() => {
          // Delay to allow click events on dropdown items to fire first
          setTimeout(() => {
            setIsFocused(false);
            setIsOpen(false);
          }, 200);
        }}
        className={`w-full pr-10 py-6 bg-white border rounded-xl text-gray-900 text-base transition-all ${
          hasSelected
            ? 'pl-14 border-blue-800 focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:border-blue-900'
            : 'pl-10 border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500'
        }`}
        autoComplete="off"
      />

      {/* Clear button (when value exists and not loading) */}
      {value && !isLoading && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            setHasSelected(false);
            setLocations([]);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hover:bg-red-100 rounded-full p-1.5 transition-all hover:scale-110"
          title="Clear"
        >
          <X className="w-4 h-4 text-gray-500 hover:text-red-600" />
        </button>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        </div>
      )}

      {/* Dropdown */}
      {isOpen && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Your Position Option */}
          <button
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent input blur
              handleUseMyPosition();
            }}
            disabled={isGettingLocation}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100 disabled:opacity-70"
          >
            {isGettingLocation ? (
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
            ) : (
              <Navigation className="w-5 h-5 text-blue-600 flex-shrink-0" />
            )}
            <span className="text-gray-900 font-medium">
              {isGettingLocation ? 'Getting your location...' : t('yourPosition') || 'Your position'}
            </span>
          </button>

          {/* Loading State */}
          {isLoading && value.length >= 2 && (
            <div className="w-full px-4 py-8 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm text-gray-500">Searching for &quot;{value}&quot;...</p>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && locations.length > 0 && locations.map((location) => (
            <button
              key={location.id}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent input blur
                handleSelect(location);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors flex items-center gap-3 last:rounded-b-xl"
            >
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-gray-900 font-medium truncate">{location.name}</span>
                {location.label !== location.name && (
                  <span className="text-sm text-gray-500 truncate">{location.label}</span>
                )}
              </div>
            </button>
          ))}

          {/* No Results State */}
          {!isLoading && value.length >= 2 && locations.length === 0 && (
            <div className="w-full px-4 py-8 text-center">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium mb-1">No locations found</p>
              <p className="text-sm text-gray-500">Try searching for a different place</p>
            </div>
          )}

          {/* Help Text when empty */}
          {!isLoading && value.length < 2 && (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-500">Type at least 2 characters to search</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
