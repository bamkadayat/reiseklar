import { z } from 'zod';

// ============================================
// ENTUR LOCATION TYPES
// ============================================

export const EnturLocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  category: z.array(z.string()).optional(),
});

export type EnturLocation = z.infer<typeof EnturLocationSchema>;

// ============================================
// ENTUR AUTOCOMPLETE REQUEST/RESPONSE TYPES
// ============================================

export const EnturAutocompleteRequestSchema = z.object({
  text: z.string().min(2, 'Search text must be at least 2 characters'),
  lang: z.string().optional().default('en'),
  size: z.number().min(1).max(50).optional().default(10),
});

export const EnturAutocompleteResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(EnturLocationSchema),
  count: z.number(),
});

export type EnturAutocompleteRequest = z.infer<typeof EnturAutocompleteRequestSchema>;
export type EnturAutocompleteResponse = z.infer<typeof EnturAutocompleteResponseSchema>;

// ============================================
// ENTUR REVERSE GEOCODE REQUEST/RESPONSE TYPES
// ============================================

export const EnturReverseGeocodeRequestSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  size: z.number().min(1).max(10).optional().default(1),
});

export const EnturReverseGeocodeResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(EnturLocationSchema),
  count: z.number(),
});

export type EnturReverseGeocodeRequest = z.infer<typeof EnturReverseGeocodeRequestSchema>;
export type EnturReverseGeocodeResponse = z.infer<typeof EnturReverseGeocodeResponseSchema>;

// ============================================
// ENTUR JOURNEY REQUEST/RESPONSE TYPES (Placeholder)
// ============================================

export const EnturJourneyRequestSchema = z.object({
  fromLat: z.number(),
  fromLon: z.number(),
  toLat: z.number(),
  toLon: z.number(),
  date: z.string().optional(),
  transportModes: z.array(z.string()).optional(),
});

export type EnturJourneyRequest = z.infer<typeof EnturJourneyRequestSchema>;

// ============================================
// ENTUR API RESPONSE TYPES (from Entur API)
// ============================================

// Response structure from Entur's autocomplete API
export interface EnturApiAutocompleteResponse {
  features: Array<{
    geometry: {
      coordinates: [number, number]; // [longitude, latitude]
      type: string;
    };
    properties: {
      id: string;
      name: string;
      label: string;
      category?: string[];
      locality?: string;
      county?: string;
      country?: string;
    };
    type: string;
  }>;
  type: string;
}

// Response structure from Entur's reverse geocode API
export interface EnturApiReverseGeocodeResponse {
  features: Array<{
    geometry: {
      coordinates: [number, number]; // [longitude, latitude]
      type: string;
    };
    properties: {
      id: string;
      name: string;
      label: string;
      category?: string[];
    };
    type: string;
  }>;
  type: string;
}
