'use client';

import { useSearchParams } from 'next/navigation';
import { JourneyResults } from '@/components/journey/JourneyResults';
import { Suspense } from 'react';

function JourneyContent() {
  const searchParams = useSearchParams();
  const startId = searchParams.get('startId');
  const startLabel = searchParams.get('startLabel');
  const startLat = searchParams.get('startLat');
  const startLon = searchParams.get('startLon');
  const stopId = searchParams.get('stopId');
  const stopLabel = searchParams.get('stopLabel');
  const stopLat = searchParams.get('stopLat');
  const stopLon = searchParams.get('stopLon');
  const date = searchParams.get('date');

  if (!startId || !stopId || !startLat || !startLon || !stopLat || !stopLon) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Missing search parameters</h1>
          <p className="text-gray-600">Please provide complete origin and destination information</p>
        </div>
      </div>
    );
  }

  // Parse date safely - expect timestamp in milliseconds
  let dateTime = new Date();
  if (date) {
    const timestamp = parseInt(date, 10);
    if (!isNaN(timestamp)) {
      dateTime = new Date(timestamp);
    }
  }

  return (
    <JourneyResults
      startId={startId}
      startLabel={startLabel || ''}
      startLat={parseFloat(startLat)}
      startLon={parseFloat(startLon)}
      stopId={stopId}
      stopLabel={stopLabel || ''}
      stopLat={parseFloat(stopLat)}
      stopLon={parseFloat(stopLon)}
      dateTime={dateTime}
    />
  );
}

export default function JourneyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading journey options...</p>
          </div>
        </div>
      }>
        <JourneyContent />
      </Suspense>
    </div>
  );
}
