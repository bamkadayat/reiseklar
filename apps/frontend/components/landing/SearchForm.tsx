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

  const handleSearch = () => {
    if (!from || !to || !fromData || !toData) {
      alert('Please select both origin and destination');
      return;
    }

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
    }
  };

  const handleToChange = (value: string, locationData?: LocationData) => {
    setTo(value);
    if (locationData) {
      setToData(locationData);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
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
          >
            <ArrowLeftRight className="w-5 h-5 text-gray-600" />
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
            <div className="hidden md:flex gap-3 items-end animate-in fade-in slide-in-from-top-2 duration-300 mt-5">
              <DateTimePicker
                date={departureDate}
                onDateChange={setDepartureDate}
                label="Reisedato"
              />

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                className="flex-shrink-0 px-[50px] py-8 bg-blue-700 text-white hover:bg-blue-800 transition-colors font-medium text-base rounded-xl"
              >
                {t('button')}
              </Button>
            </div>

            {/* Mobile Layout */}
            <div className="flex md:hidden flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* First row: Nå and Reisedato */}
              <div className="grid grid-cols-2 gap-3">
                <DateTimePicker
                  date={departureDate}
                  onDateChange={setDepartureDate}
                  label="Reisedato"
                  showOnlyDateAndNow={true}
                />
              </div>

              {/* Second row: Tidspunkt and Søk button */}
              <div className="grid grid-cols-2 gap-3">
                <DateTimePicker
                  date={departureDate}
                  onDateChange={setDepartureDate}
                  label="Reisedato"
                  showOnlyTime={true}
                />

                <Button
                  onClick={handleSearch}
                  className="py-8 bg-blue-700 text-white hover:bg-blue-800 transition-colors font-medium text-base rounded-xl"
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
