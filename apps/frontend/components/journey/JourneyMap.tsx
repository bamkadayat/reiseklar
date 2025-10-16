'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Stop {
  name: string;
  lat: number;
  lon: number;
  quay?: {
    publicCode?: string;
  };
}

interface Leg {
  mode: string;
  fromPlace?: {
    name: string;
    latitude?: number;
    longitude?: number;
    quay?: {
      publicCode?: string;
    };
  };
  toPlace?: {
    name: string;
    latitude?: number;
    longitude?: number;
    quay?: {
      publicCode?: string;
    };
  };
  pointsOnLink?: {
    points: string;
  };
}

interface JourneyMapProps {
  journey: {
    legs: Leg[];
  };
  startLat: number;
  startLon: number;
  startLabel: string;
  stopLat: number;
  stopLon: number;
  stopLabel: string;
}

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export function JourneyMap({
  journey,
  startLat,
  startLon,
  startLabel,
  stopLat,
  stopLon,
  stopLabel,
}: JourneyMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [startLat, startLon],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // Add Mapbox tiles (same as Ruter uses)
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

      if (mapboxToken) {
        // Use Mapbox Light style (clean, neutral look with better contrast)
        L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`, {
          attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          tileSize: 512,
          zoomOffset: -1,
          maxZoom: 19,
        }).addTo(mapRef.current);
      } else {
        // Fallback to OpenStreetMap if no token
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapRef.current);
      }
    }

    const map = mapRef.current;

    // Clear existing layers (except tile layer)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Create custom icons with enhanced visibility (darker, more prominent)
    const startIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="position: relative;">
          <div style="
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            width: 52px;
            height: 52px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 4px solid white;
            box-shadow: 0 6px 16px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              transform: rotate(45deg);
              font-weight: 900;
              color: white;
              font-size: 22px;
              text-shadow: 0 2px 4px rgba(0,0,0,0.4);
            ">A</span>
          </div>
          <div style="
            position: absolute;
            top: 56px;
            left: 50%;
            transform: translateX(-50%);
            background: #1d4ed8;
            padding: 5px 10px;
            border-radius: 6px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            white-space: nowrap;
            font-size: 13px;
            font-weight: 700;
            color: white;
            border: 2px solid white;
          ">Start</div>
        </div>
      `,
      iconSize: [52, 52],
      iconAnchor: [26, 52],
    });

    const stopIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="position: relative;">
          <div style="
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            width: 52px;
            height: 52px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 4px solid white;
            box-shadow: 0 6px 16px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              transform: rotate(45deg);
              font-weight: 900;
              color: white;
              font-size: 22px;
              text-shadow: 0 2px 4px rgba(0,0,0,0.4);
            ">B</span>
          </div>
          <div style="
            position: absolute;
            top: 56px;
            left: 50%;
            transform: translateX(-50%);
            background: #b91c1c;
            padding: 5px 10px;
            border-radius: 6px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            white-space: nowrap;
            font-size: 13px;
            font-weight: 700;
            color: white;
            border: 2px solid white;
          ">End</div>
        </div>
      `,
      iconSize: [52, 52],
      iconAnchor: [26, 52],
    });

    const transitStopIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          background-color: #1e40af;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 3px 8px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    // Add start marker with better popup
    const startMarker = L.marker([startLat, startLon], { icon: startIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: system-ui, -apple-system, sans-serif;">
          <div style="font-weight: 700; font-size: 14px; color: #059669; margin-bottom: 4px;">
            START
          </div>
          <div style="font-size: 13px; color: #374151;">
            ${startLabel}
          </div>
        </div>
      `, {
        offset: [0, -40]
      });

    // Add end marker with better popup
    const endMarker = L.marker([stopLat, stopLon], { icon: stopIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: system-ui, -apple-system, sans-serif;">
          <div style="font-weight: 700; font-size: 14px; color: #dc2626; margin-bottom: 4px;">
            DESTINATION
          </div>
          <div style="font-size: 13px; color: #374151;">
            ${stopLabel}
          </div>
        </div>
      `, {
        offset: [0, -40]
      });

    // Add permanent tooltips (always visible labels with dark background)
    startMarker.bindTooltip(startLabel, {
      permanent: true,
      direction: 'top',
      offset: [0, -60],
      className: 'map-label-dark',
    }).openTooltip();

    endMarker.bindTooltip(stopLabel, {
      permanent: true,
      direction: 'top',
      offset: [0, -60],
      className: 'map-label-dark',
    }).openTooltip();

    // Collect all points for bounds
    const allPoints: L.LatLngExpression[] = [[startLat, startLon], [stopLat, stopLon]];

    // Process each leg
    journey.legs?.forEach((leg, index) => {
      if (leg.mode !== 'foot') {
        // Add markers for transit stops
        if (leg.fromPlace?.latitude && leg.fromPlace?.longitude) {
          const fromLat = leg.fromPlace.latitude;
          const fromLon = leg.fromPlace.longitude;

          const fromMarker = L.marker([fromLat, fromLon], { icon: transitStopIcon })
            .addTo(map)
            .bindPopup(`
              <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 150px;">
                <div style="font-weight: 700; font-size: 13px; color: #1f2937; margin-bottom: 4px;">
                  ${leg.fromPlace.name}
                </div>
                ${leg.fromPlace.quay?.publicCode ? `
                  <div style="font-size: 12px; color: #6b7280;">
                    Platform <span style="
                      background: #3b82f6;
                      color: white;
                      padding: 2px 6px;
                      border-radius: 4px;
                      font-weight: 600;
                    ">${leg.fromPlace.quay.publicCode}</span>
                  </div>
                ` : ''}
              </div>
            `);

          // Add tooltip on hover for transit stops
          fromMarker.bindTooltip(leg.fromPlace.name, {
            permanent: false,
            direction: 'top',
            offset: [0, -10],
            className: 'map-label',
          });

          allPoints.push([fromLat, fromLon]);
        }

        if (leg.toPlace?.latitude && leg.toPlace?.longitude) {
          const toLat = leg.toPlace.latitude;
          const toLon = leg.toPlace.longitude;

          const toMarker = L.marker([toLat, toLon], { icon: transitStopIcon })
            .addTo(map)
            .bindPopup(`
              <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 150px;">
                <div style="font-weight: 700; font-size: 13px; color: #1f2937; margin-bottom: 4px;">
                  ${leg.toPlace.name}
                </div>
                ${leg.toPlace.quay?.publicCode ? `
                  <div style="font-size: 12px; color: #6b7280;">
                    Platform <span style="
                      background: #3b82f6;
                      color: white;
                      padding: 2px 6px;
                      border-radius: 4px;
                      font-weight: 600;
                    ">${leg.toPlace.quay.publicCode}</span>
                  </div>
                ` : ''}
              </div>
            `);

          // Add tooltip on hover for transit stops
          toMarker.bindTooltip(leg.toPlace.name, {
            permanent: false,
            direction: 'top',
            offset: [0, -10],
            className: 'map-label',
          });

          allPoints.push([toLat, toLon]);
        }

        // Draw route line for transit legs
        if (leg.pointsOnLink?.points) {
          // Decode polyline (if Entur provides encoded polyline)
          const coordinates = decodePolyline(leg.pointsOnLink.points);

          if (coordinates.length > 0) {
            const color = getModeColor(leg.mode);

            // Draw outline for better visibility
            L.polyline(coordinates, {
              color: '#ffffff',
              weight: 8,
              opacity: 0.8,
            }).addTo(map);

            // Draw main line
            L.polyline(coordinates, {
              color: color,
              weight: 5,
              opacity: 1,
            }).addTo(map);

            allPoints.push(...coordinates);
          }
        } else if (leg.fromPlace?.latitude && leg.fromPlace?.longitude &&
                   leg.toPlace?.latitude && leg.toPlace?.longitude) {
          // Fallback: draw straight line if no polyline data
          const color = getModeColor(leg.mode);

          // Draw outline
          L.polyline([
            [leg.fromPlace.latitude, leg.fromPlace.longitude],
            [leg.toPlace.latitude, leg.toPlace.longitude]
          ], {
            color: '#ffffff',
            weight: 8,
            opacity: 0.8,
            dashArray: '10, 10',
          }).addTo(map);

          // Draw main line
          L.polyline([
            [leg.fromPlace.latitude, leg.fromPlace.longitude],
            [leg.toPlace.latitude, leg.toPlace.longitude]
          ], {
            color: color,
            weight: 5,
            opacity: 1,
            dashArray: '10, 10',
          }).addTo(map);
        }
      } else {
        // Walking leg - dashed line with outline
        if (leg.fromPlace?.latitude && leg.fromPlace?.longitude &&
            leg.toPlace?.latitude && leg.toPlace?.longitude) {
          // Outline
          L.polyline([
            [leg.fromPlace.latitude, leg.fromPlace.longitude],
            [leg.toPlace.latitude, leg.toPlace.longitude]
          ], {
            color: '#ffffff',
            weight: 6,
            opacity: 0.8,
            dashArray: '8, 12',
          }).addTo(map);

          // Main dashed line
          L.polyline([
            [leg.fromPlace.latitude, leg.fromPlace.longitude],
            [leg.toPlace.latitude, leg.toPlace.longitude]
          ], {
            color: '#6b7280',
            weight: 4,
            opacity: 0.9,
            dashArray: '8, 12',
          }).addTo(map);
        }
      }
    });

    // Fit map to show all points
    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [journey, startLat, startLon, startLabel, stopLat, stopLon, stopLabel]);

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        className="w-full h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-md border-2 border-gray-200"
        style={{ zIndex: 0 }}
      />

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000] border border-gray-200">
        <div className="text-xs font-semibold text-gray-700 mb-2">Legend</div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-white shadow-sm"></div>
            <span className="text-gray-700">Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-red-600 border-2 border-white shadow-sm"></div>
            <span className="text-gray-700">Destination</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
            <span className="text-gray-700">Transit Stop</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-gray-600" style={{clipPath: 'polygon(0 0, 40% 0, 40% 100%, 0 100%, 0 0, 60% 0, 60% 100%, 100% 100%, 100% 0)'}}></div>
            <span className="text-gray-700">Walking</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get color based on transport mode
function getModeColor(mode: string): string {
  switch (mode.toLowerCase()) {
    case 'bus':
      return '#dc2626'; // red
    case 'tram':
      return '#2563eb'; // blue
    case 'rail':
    case 'train':
      return '#7c3aed'; // purple
    case 'metro':
      return '#ea580c'; // orange
    case 'water':
    case 'ferry':
      return '#0891b2'; // cyan
    case 'air':
    case 'plane':
      return '#4f46e5'; // indigo
    default:
      return '#3b82f6'; // default blue
  }
}

// Decode polyline (Google's encoded polyline algorithm)
function decodePolyline(encoded: string): L.LatLngExpression[] {
  const points: L.LatLngExpression[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b;
    let shift = 0;
    let result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
}
