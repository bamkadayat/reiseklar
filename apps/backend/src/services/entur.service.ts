import dotenv from 'dotenv';
import {
  EnturLocation,
  EnturApiAutocompleteResponse,
  EnturApiReverseGeocodeResponse,
} from '@reiseklar/shared';

dotenv.config();

const ENTUR_API_URL = process.env.ENTUR_API_URL || 'https://api.entur.io';
const ENTUR_CLIENT_NAME = process.env.ENTUR_CLIENT_NAME || 'reiseklar-norway';

/**
 * Service for interacting with Entur's geocoding API
 */
class EnturService {
  private readonly apiUrl: string;
  private readonly clientName: string;

  constructor() {
    this.apiUrl = ENTUR_API_URL;
    this.clientName = ENTUR_CLIENT_NAME;
  }

  /**
   * Get common headers for Entur API requests
   */
  private getHeaders(): Record<string, string> {
    return {
      'ET-Client-Name': this.clientName,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Search for locations using autocomplete
   * @param text Search query
   * @param lang Language code (default: 'en')
   * @param size Number of results to return (default: 10)
   */
  async autocomplete(
    text: string,
    lang: string = 'en',
    size: number = 10
  ): Promise<EnturLocation[]> {
    try {
      const url = `${this.apiUrl}/geocoder/v1/autocomplete?text=${encodeURIComponent(
        text
      )}&lang=${lang}&size=${size}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Entur API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as EnturApiAutocompleteResponse;

      // Transform the response to our format
      return data.features.map((feature) => ({
        id: feature.properties.id || '',
        name: feature.properties.name || '',
        label: feature.properties.label || '',
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
        category: feature.properties.category,
      }));
    } catch (error) {
      console.error('Error in Entur autocomplete:', error);
      throw error;
    }
  }

  /**
   * Reverse geocode coordinates to get location information
   * @param lat Latitude
   * @param lon Longitude
   * @param size Number of results to return (default: 1)
   */
  async reverseGeocode(
    lat: number,
    lon: number,
    size: number = 1
  ): Promise<EnturLocation[]> {
    try {
      const url = `${this.apiUrl}/geocoder/v1/reverse?point.lat=${lat}&point.lon=${lon}&size=${size}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Entur API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as EnturApiReverseGeocodeResponse;

      // Transform the response to our format
      return data.features.map((feature) => ({
        id: feature.properties.id || `${lat},${lon}`,
        name: feature.properties.name || 'Unknown location',
        label: feature.properties.label || 'Unknown location',
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
        category: feature.properties.category,
      }));
    } catch (error) {
      console.error('Error in Entur reverse geocode:', error);
      throw error;
    }
  }

  /**
   * Search for journey plans (for future implementation)
   * This is a placeholder for when you want to add journey planning
   */
  async searchJourneys(_params: {
    fromLat: number;
    fromLon: number;
    toLat: number;
    toLon: number;
    date?: string;
    transportModes?: string[];
  }): Promise<any> {
    // TODO: Implement journey search using Entur's Journey Planner API
    // This will use GraphQL endpoint: https://api.entur.io/journey-planner/v3/graphql
    throw new Error('Journey search not yet implemented');
  }
}

// Export singleton instance
export const enturService = new EnturService();
