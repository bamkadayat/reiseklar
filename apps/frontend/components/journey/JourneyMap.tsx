'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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

export function JourneyMap({
  journey,
  startLat,
  startLon,
  startLabel,
  stopLat,
  stopLon,
  stopLabel,
}: JourneyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!mapboxToken) {
      console.error('NEXT_PUBLIC_MAPBOX_TOKEN is required for Mapbox GL JS');
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    // Initialize map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [startLon, startLat],
      zoom: 12,
    });

    const map = mapRef.current;

    map.on('load', () => {
      // Create start marker (A)
      const startEl = document.createElement('div');
      startEl.className = 'custom-marker';
      startEl.innerHTML = `
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
      `;

      new mapboxgl.Marker({ element: startEl, anchor: 'bottom' })
        .setLngLat([startLon, startLat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="font-family: system-ui, -apple-system, sans-serif;">
              <div style="font-weight: 700; font-size: 14px; color: #059669; margin-bottom: 4px;">
                START
              </div>
              <div style="font-size: 13px; color: #374151;">
                ${startLabel}
              </div>
            </div>
          `)
        )
        .addTo(map);

      // Create end marker (B)
      const endEl = document.createElement('div');
      endEl.className = 'custom-marker';
      endEl.innerHTML = `
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
      `;

      new mapboxgl.Marker({ element: endEl, anchor: 'bottom' })
        .setLngLat([stopLon, stopLat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="font-family: system-ui, -apple-system, sans-serif;">
              <div style="font-weight: 700; font-size: 14px; color: #dc2626; margin-bottom: 4px;">
                DESTINATION
              </div>
              <div style="font-size: 13px; color: #374151;">
                ${stopLabel}
              </div>
            </div>
          `)
        )
        .addTo(map);

      // Collect all coordinates for bounds
      const allCoordinates: [number, number][] = [
        [startLon, startLat],
        [stopLon, stopLat],
      ];

      // Process each leg
      journey.legs?.forEach((leg, legIndex) => {
        if (leg.mode !== 'foot') {
          // Add markers for transit stops
          if (leg.fromPlace?.latitude && leg.fromPlace?.longitude) {
            const fromEl = document.createElement('div');
            fromEl.className = 'transit-stop-marker';
            fromEl.innerHTML = `
              <div style="
                background-color: #1e40af;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 3px 8px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3);
              "></div>
            `;

            new mapboxgl.Marker({ element: fromEl })
              .setLngLat([leg.fromPlace.longitude, leg.fromPlace.latitude])
              .setPopup(
                new mapboxgl.Popup({ offset: 15 }).setHTML(`
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
                `)
              )
              .addTo(map);

            allCoordinates.push([leg.fromPlace.longitude, leg.fromPlace.latitude]);
          }

          if (leg.toPlace?.latitude && leg.toPlace?.longitude) {
            const toEl = document.createElement('div');
            toEl.className = 'transit-stop-marker';
            toEl.innerHTML = `
              <div style="
                background-color: #1e40af;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 3px 8px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3);
              "></div>
            `;

            new mapboxgl.Marker({ element: toEl })
              .setLngLat([leg.toPlace.longitude, leg.toPlace.latitude])
              .setPopup(
                new mapboxgl.Popup({ offset: 15 }).setHTML(`
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
                `)
              )
              .addTo(map);

            allCoordinates.push([leg.toPlace.longitude, leg.toPlace.latitude]);
          }

          // Draw route line for transit legs
          if (leg.pointsOnLink?.points) {
            const coordinates = decodePolyline(leg.pointsOnLink.points);
            const color = getModeColor(leg.mode);

            // Add source and layer for the route
            const sourceId = `route-${legIndex}`;
            const outlineLayerId = `route-outline-${legIndex}`;
            const lineLayerId = `route-line-${legIndex}`;

            map.addSource(sourceId, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: coordinates.map(([lat, lon]) => [lon, lat]),
                },
              },
            });

            // Add white outline
            map.addLayer({
              id: outlineLayerId,
              type: 'line',
              source: sourceId,
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': '#ffffff',
                'line-width': 8,
                'line-opacity': 0.8,
              },
            });

            // Add colored line
            map.addLayer({
              id: lineLayerId,
              type: 'line',
              source: sourceId,
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': color,
                'line-width': 5,
                'line-opacity': 1,
              },
            });

            allCoordinates.push(...coordinates.map(([lat, lon]) => [lon, lat] as [number, number]));
          } else if (
            leg.fromPlace?.latitude &&
            leg.fromPlace?.longitude &&
            leg.toPlace?.latitude &&
            leg.toPlace?.longitude
          ) {
            // Fallback: draw straight line if no polyline data
            const color = getModeColor(leg.mode);
            const sourceId = `route-straight-${legIndex}`;
            const outlineLayerId = `route-straight-outline-${legIndex}`;
            const lineLayerId = `route-straight-line-${legIndex}`;

            map.addSource(sourceId, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [leg.fromPlace.longitude, leg.fromPlace.latitude],
                    [leg.toPlace.longitude, leg.toPlace.latitude],
                  ],
                },
              },
            });

            // Add white outline
            map.addLayer({
              id: outlineLayerId,
              type: 'line',
              source: sourceId,
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': '#ffffff',
                'line-width': 8,
                'line-opacity': 0.8,
                'line-dasharray': [2, 2],
              },
            });

            // Add colored dashed line
            map.addLayer({
              id: lineLayerId,
              type: 'line',
              source: sourceId,
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': color,
                'line-width': 5,
                'line-opacity': 1,
                'line-dasharray': [2, 2],
              },
            });
          }
        } else {
          // Walking leg - dashed line
          if (
            leg.fromPlace?.latitude &&
            leg.fromPlace?.longitude &&
            leg.toPlace?.latitude &&
            leg.toPlace?.longitude
          ) {
            const sourceId = `walk-${legIndex}`;
            const outlineLayerId = `walk-outline-${legIndex}`;
            const lineLayerId = `walk-line-${legIndex}`;

            map.addSource(sourceId, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [leg.fromPlace.longitude, leg.fromPlace.latitude],
                    [leg.toPlace.longitude, leg.toPlace.latitude],
                  ],
                },
              },
            });

            // Add white outline
            map.addLayer({
              id: outlineLayerId,
              type: 'line',
              source: sourceId,
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': '#ffffff',
                'line-width': 6,
                'line-opacity': 0.8,
                'line-dasharray': [1, 2],
              },
            });

            // Add gray dashed line
            map.addLayer({
              id: lineLayerId,
              type: 'line',
              source: sourceId,
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': '#6b7280',
                'line-width': 4,
                'line-opacity': 0.9,
                'line-dasharray': [1, 2],
              },
            });
          }
        }
      });

      // Fit map to show all points
      if (allCoordinates.length > 0) {
        const bounds = allCoordinates.reduce(
          (bounds, coord) => bounds.extend(coord as mapboxgl.LngLatLike),
          new mapboxgl.LngLatBounds(allCoordinates[0], allCoordinates[0])
        );

        map.fitBounds(bounds, {
          padding: 50,
        });
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [journey, startLat, startLon, startLabel, stopLat, stopLon, stopLabel]);

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        className="w-full h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-md border-2 border-gray-200"
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
function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
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
