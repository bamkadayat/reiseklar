'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationAutocomplete, type LocationData } from './LocationAutocomplete';
import { DateTimePicker } from './DateTimePicker';

export function SearchForm() {
  const t = useTranslations('home.search');
  const router = useRouter();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromData, setFromData] = useState<LocationData | null>(null);
  const [toData, setToData] = useState<LocationData | null>(null);
  const [departureDate, setDepartureDate] = useState<Date>(new Date());
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSearch = () => {
    if (!from || !to || !fromData || !toData) {
      setErrorMessage('Please select both origin and destination');
      return;
    }
    setErrorMessage('');

    // Navigate to journey results page with query parameters matching Entur's structure
    const params = new URLSearchParams({
      startId: fromData.id,
      startLabel: fromData.label,
      startLat: fromData.latitude.toString(),
      startLon: fromData.longitude.toString(),
      stopId: toData.id,
      stopLabel: toData.label,
      stopLat: toData.latitude.toString(),
      stopLon: toData.longitude.toString(),
      transportModes: 'rail,tram,bus,coach,water,car_ferry,metro',
      date: departureDate.getTime().toString(),
      tripMode: 'oneway',
      walkSpeed: '1.3',
      minimumTransferTime: '120',
      timepickerMode: 'departAfter',
    });
    router.push(`/journey?${params.toString()}`);
  };

  const showDateTime = fromData !== null && toData !== null;

  const handleSwap = () => {
    const tempLabel = from;
    const tempData = fromData;
    setFrom(to);
    setFromData(toData);
    setTo(tempLabel);
    setToData(tempData);
  };

  const handleFromChange = (value: string, locationData?: LocationData) => {
    setFrom(value);
    if (locationData) {
      setFromData(locationData);
    } else {
      // Clear location data when user is manually editing
      setFromData(null);
    }
  };

  const handleToChange = (value: string, locationData?: LocationData) => {
    setTo(value);
    if (locationData) {
      setToData(locationData);
    } else {
      // Clear location data when user is manually editing
      setToData(null);
    }
  };

  return (
    <div className="bg-blue-50 rounded-2xl shadow-xl p-4 sm:p-6">
      {/* Error message banner */}
      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <svg
            className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
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
          <p className="text-sm text-red-800 font-medium">{errorMessage}</p>
          <button
            onClick={() => setErrorMessage('')}
            className="ml-auto text-red-600 hover:text-red-800"
            aria-label="Dismiss error message"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {/* Location inputs row */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
          {/* From Input */}
          <LocationAutocomplete
            value={from}
            onChange={handleFromChange}
            placeholder={t('from')}
            icon="circle"
          />

          {/* Swap Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwap}
            className="md:flex-shrink-0 p-3 bg-gray-100 rounded-xl hover:bg-gray-200 self-center h-12 w-12"
            aria-label="Swap origin and destination"
            title="Swap origin and destination"
          >
            <ArrowLeftRight className="w-5 h-5 text-gray-600" aria-hidden="true" />
          </Button>

          {/* To Input */}
          <LocationAutocomplete
            value={to}
            onChange={handleToChange}
            placeholder={t('to')}
            icon="pin"
          />
        </div>

        {/* Date/Time row - shows when both locations are filled */}
        {showDateTime && (
          <>
            {/* Desktop Layout */}
            <div className="hidden md:flex gap-3 items-stretch animate-in fade-in slide-in-from-top-2 duration-300 mt-5">
              <DateTimePicker
                date={departureDate}
                onDateChange={setDepartureDate}
                label="Reisedato"
              />

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                className="flex-shrink-0 px-[50px] h-auto bg-blue-700 text-white hover:bg-blue-800 transition-colors font-medium text-base rounded-xl"
                aria-label={`${t('button')} - Search for travel routes`}
              >
                {t('button')}
              </Button>
            </div>

            {/* Mobile Layout */}
            <div className="flex md:hidden flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* First row: Nå and Reisedato */}
              <div className="grid grid-cols-2 gap-3 h-14">
                <DateTimePicker
                  date={departureDate}
                  onDateChange={setDepartureDate}
                  label="Reisedato"
                  showOnlyDateAndNow={true}
                />
              </div>

              {/* Second row: Tidspunkt and Søk button */}
              <div className="grid grid-cols-2 gap-3 h-14">
                <DateTimePicker
                  date={departureDate}
                  onDateChange={setDepartureDate}
                  label="Reisedato"
                  showOnlyTime={true}
                />

                <Button
                  onClick={handleSearch}
                  className="h-full bg-blue-700 text-white hover:bg-blue-800 transition-colors font-medium text-base rounded-xl"
                  aria-label={`${t('button')} - Search for travel routes`}
                >
                  {t('button')}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
