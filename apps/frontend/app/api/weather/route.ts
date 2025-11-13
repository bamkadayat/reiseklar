import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Fetch weather data from YR API
    const weatherApiUrl = process.env.NEXT_PUBLIC_YR_API_URL || '';

    // Add timeout to prevent long waits
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(
        `${weatherApiUrl}/compact?lat=${lat}&lon=${lon}`,
        {
          headers: {
            'User-Agent': 'Reiseklar reiseklar.no contact@reiseklar.no',
          },
          next: { revalidate: 600 }, // Cache for 10 minutes
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

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

      return NextResponse.json({ current, forecast });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
