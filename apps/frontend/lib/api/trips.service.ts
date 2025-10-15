import { apiClient, ApiResponse } from './client';

/**
 * Place type
 */
export interface Place {
  id: string;
  userId: string;
  label: string;
  lat: number;
  lon: number;
  address: string;
  createdAt: string;
}

/**
 * Trip type
 */
export interface Trip {
  id: string;
  userId: string;
  originId: string;
  destinationId: string;
  accessibility: string;
  createdAt: string;
  origin?: Place;
  destination?: Place;
}

/**
 * Create place request
 */
export interface CreatePlaceRequest {
  label: string;
  lat: number;
  lon: number;
  address: string;
}

/**
 * Create trip request
 */
export interface CreateTripRequest {
  origin: {
    label: string;
    lat: number;
    lon: number;
    address?: string;
  };
  destination: {
    label: string;
    lat: number;
    lon: number;
    address?: string;
  };
  accessibility?: string;
}

/**
 * Trips Service
 */
export const tripsService = {
  /**
   * Create a new place
   */
  async createPlace(data: CreatePlaceRequest): Promise<Place> {
    const response = await apiClient.post<ApiResponse<Place>>(
      '/api/users/places',
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create place');
    }

    return response.data;
  },

  /**
   * Get all places for the current user
   */
  async getPlaces(): Promise<Place[]> {
    const response = await apiClient.get<ApiResponse<Place[]>>('/api/users/places');

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch places');
    }

    return response.data;
  },

  /**
   * Delete a place
   */
  async deletePlace(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/api/users/places/${id}`
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete place');
    }
  },

  /**
   * Create a new trip (with origin and destination)
   */
  async createTrip(data: CreateTripRequest): Promise<Trip> {
    const response = await apiClient.post<ApiResponse<Trip>>(
      '/api/users/trips',
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create trip');
    }

    return response.data;
  },

  /**
   * Get all trips for the current user
   */
  async getTrips(): Promise<Trip[]> {
    const response = await apiClient.get<ApiResponse<Trip[]>>('/api/users/trips');

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch trips');
    }

    return response.data;
  },

  /**
   * Delete a trip
   */
  async deleteTrip(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/api/users/trips/${id}`
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete trip');
    }
  },
};
