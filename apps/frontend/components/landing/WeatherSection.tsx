'use client';

import { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, MapPin } from 'lucide-react';
import type { WeatherData } from '@reiseklar/shared/types/weather';

export function WeatherSection() {
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
          console.error('Error fetching location name:', geocodeErr);
          // Continue with weather fetch even if geocoding fails
        }

        const weatherApiUrl = process.env.NEXT_PUBLIC_YR_API_URL || '';
        const response = await fetch(
          `${weatherApiUrl}/compact?lat=${lat}&lon=${lon}`,
          {
            headers: {
              'User-Agent': 'Reiseklar reiseklar.no contact@reiseklar.no',
            },
          }
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
        console.error('Error fetching weather:', err);
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
            console.warn('Geolocation error:', err);
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
    if (condition.includes('rain')) return <CloudRain className="w-6 h-6" />;
    if (condition.includes('cloud')) return <Cloud className="w-6 h-6" />;
    return <Sun className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-sm border border-gray-100">
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
      <div className="w-full max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 shadow-sm border border-red-100">
          <p className="text-red-700 text-center">{error || 'Weather data unavailable'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-8">
          <MapPin className="w-6 h-6 text-gray-700" />
          <h2 className="text-3xl font-bold text-gray-900">Weather in {locationName}</h2>
        </div>

        {/* Current Weather */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-blue-600">
                {getWeatherIcon(weather.current.condition)}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Today</p>
                <p className="text-5xl font-bold text-gray-900">
                  {weather.current.temperature}°C
                </p>
              </div>
            </div>

            <div className="flex space-x-8">
              <div className="flex items-center space-x-2">
                <Wind className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Wind</p>
                  <p className="text-lg font-semibold text-gray-700">
                    {weather.current.windSpeed} m/s
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Droplets className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Humidity</p>
                  <p className="text-lg font-semibold text-gray-700">
                    {weather.current.humidity}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Forecast */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">7-Day Forecast</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
            {weather.forecast.map((day, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  {day.day}
                </p>
                <div className="flex justify-center text-blue-600 mb-2">
                  {getSmallWeatherIcon(day.condition)}
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {day.temperature}°
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
