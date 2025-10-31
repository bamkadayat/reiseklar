'use client';

import { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { WeatherData } from '@reiseklar/shared/types/weather';

export function WeatherSection() {
  const t = useTranslations('home.weather');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>('Norway');

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        // Fetch location name using Entur Geocoder API
        try {
          const geocoderUrl = process.env.NEXT_PUBLIC_ENTUR_GEOCODER_API_URL || '';
          const geocodeResponse = await fetch(
            `${geocoderUrl}/reverse?point.lat=${lat}&point.lon=${lon}&size=1`,
            {
              headers: {
                'ET-Client-Name': 'reiseklar-no',
              },
            }
          );

          if (geocodeResponse.ok) {
            const geocodeData = await geocodeResponse.json();
            if (geocodeData.features && geocodeData.features.length > 0) {
              const feature = geocodeData.features[0];
              const locality = feature.properties.locality || feature.properties.name;
              if (locality) {
                setLocationName(locality);
              }
            }
          }
        } catch (geocodeErr) {
          // Continue with weather fetch even if geocoding fails
        }

        const weatherApiUrl = process.env.NEXT_PUBLIC_YR_API_URL || '';
        const response = await fetch(
          `${weatherApiUrl}/compact?lat=${lat}&lon=${lon}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();

        // Process current weather
        const currentData = data.properties.timeseries[0];
        const current = {
          temperature: Math.round(currentData.data.instant.details.air_temperature),
          windSpeed: Math.round(currentData.data.instant.details.wind_speed),
          humidity: Math.round(currentData.data.instant.details.relative_humidity),
          condition: currentData.data.next_1_hours?.summary?.symbol_code || 'unknown',
        };

        // Process weekly forecast (next 7 days around noon)
        const forecast = [];
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 1; i <= 7; i++) {
          const targetDate = new Date();
          targetDate.setDate(targetDate.getDate() + i);
          targetDate.setHours(12, 0, 0, 0);

          // Find closest data point to noon (between 10 AM and 2 PM)
          let closestData = null;
          let closestTimeDiff = Infinity;

          for (const item of data.properties.timeseries) {
            const itemDate = new Date(item.time);

            // Check if it's the same day
            if (
              itemDate.getDate() === targetDate.getDate() &&
              itemDate.getMonth() === targetDate.getMonth() &&
              itemDate.getFullYear() === targetDate.getFullYear()
            ) {
              const hour = itemDate.getHours();
              // Look for data between 10 AM and 2 PM
              if (hour >= 10 && hour <= 14) {
                const timeDiff = Math.abs(itemDate.getTime() - targetDate.getTime());
                if (timeDiff < closestTimeDiff) {
                  closestTimeDiff = timeDiff;
                  closestData = item;
                }
              }
            }
          }

          if (closestData) {
            forecast.push({
              date: targetDate.toISOString().split('T')[0],
              day: daysOfWeek[targetDate.getDay()],
              temperature: Math.round(closestData.data.instant.details.air_temperature),
              condition: closestData.data.next_6_hours?.summary?.symbol_code ||
                        closestData.data.next_1_hours?.summary?.symbol_code || 'unknown',
            });
          }
        }

        setWeather({ current, forecast });
        setLoading(false);
      } catch (err) {
        setError('Unable to load weather data');
        setLoading(false);
      }
    };

    // Get user's geolocation
    const getUserLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // Round to 4 decimal places as recommended by Yr.no API
            const lat = Math.round(latitude * 10000) / 10000;
            const lon = Math.round(longitude * 10000) / 10000;
            fetchWeather(lat, lon);
          },
          (err) => {
            // Fallback to Oslo if geolocation fails or is denied
            setLocationName('Oslo');
            fetchWeather(59.9139, 10.7522);
          }
        );
      } else {
        // Geolocation not supported, fallback to Oslo
        setLocationName('Oslo');
        fetchWeather(59.9139, 10.7522);
      }
    };

    getUserLocation();
  }, []);

  const getWeatherIcon = (condition: string) => {
    if (condition.includes('rain')) return <CloudRain className="w-8 h-8" />;
    if (condition.includes('cloud')) return <Cloud className="w-8 h-8" />;
    return <Sun className="w-8 h-8" />;
  };

  const getSmallWeatherIcon = (condition: string) => {
    if (condition.includes('rain')) return <CloudRain className="w-full h-full" />;
    if (condition.includes('cloud')) return <Cloud className="w-full h-full" />;
    return <Sun className="w-full h-full" />;
  };

  if (loading) {
    return (
      <div className="w-full h-full min-h-[450px]">
        <div className="rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-7 gap-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="w-full h-full min-h-[450px]">
        <div className="rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
          <p className="text-red-700 text-center">{error || 'Weather data unavailable'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[450px]">
      <div className="rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 h-full flex flex-col gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">{locationName}</h2>
        </div>

        {/* Current Weather */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm md:mb-6">
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {/* Temperature */}
            <div className="flex flex-col items-start">
              <div className="text-blue-500 mb-3">
                {getWeatherIcon(weather.current.condition)}
              </div>
              <p className="text-xs uppercase tracking-wide text-gray-600 mb-1">{t('today')}</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {weather.current.temperature}°
              </p>
            </div>

            {/* Wind */}
            <div className="flex flex-col items-start">
              <Wind className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 mb-3" aria-hidden="true" />
              <p className="text-xs uppercase tracking-wide text-gray-600 mb-1">{t('wind')}</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                {weather.current.windSpeed}
                <span className="text-sm font-normal text-gray-500 ml-1">m/s</span>
              </p>
            </div>

            {/* Humidity */}
            <div className="flex flex-col items-start">
              <Droplets className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 mb-3" aria-hidden="true" />
              <p className="text-xs uppercase tracking-wide text-gray-600 mb-1">{t('humidity')}</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                {weather.current.humidity}
                <span className="text-sm font-normal text-gray-500 ml-1">%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Forecast */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">{t('forecast')}</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
            {weather.forecast.map((day, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-3 sm:p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  {day.day}
                </p>
                <div className="w-8 h-8 text-blue-500 mb-2">
                  {getSmallWeatherIcon(day.condition)}
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {day.temperature}°
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Attribution */}
        <div className="pt-4 border-t border-blue-200">
          <p className="text-xs text-gray-600 text-center">
            Weather provided by{' '}
            <a
              href="https://www.yr.no"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              YR
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
