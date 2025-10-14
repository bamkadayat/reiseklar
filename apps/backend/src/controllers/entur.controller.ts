import { Request, Response } from 'express';
import { enturService } from '../services/entur.service';
import {
  EnturAutocompleteResponse,
  EnturReverseGeocodeResponse,
} from '@reiseklar/shared';

/**
 * Controller for Entur API endpoints
 */
export class EnturController {
  /**
   * GET /api/entur/autocomplete
   * Search for locations using autocomplete
   *
   * Query parameters:
   * - text: Search query (required)
   * - lang: Language code (optional, default: 'en')
   * - size: Number of results (optional, default: 10)
   */
  async autocomplete(req: Request, res: Response): Promise<void> {
    try {
      const { text, lang = 'en', size = '10' } = req.query;

      // Validate input
      if (!text || typeof text !== 'string') {
        res.status(400).json({
          error: 'Missing or invalid required parameter: text',
        });
        return;
      }

      if (text.length < 2) {
        res.status(400).json({
          error: 'Search text must be at least 2 characters long',
        });
        return;
      }

      const parsedSize = parseInt(size as string, 10);
      if (isNaN(parsedSize) || parsedSize < 1 || parsedSize > 50) {
        res.status(400).json({
          error: 'Size must be a number between 1 and 50',
        });
        return;
      }

      // Call Entur service
      const locations = await enturService.autocomplete(
        text,
        lang as string,
        parsedSize
      );

      const response: EnturAutocompleteResponse = {
        success: true,
        data: locations,
        count: locations.length,
      };

      res.json(response);
    } catch (error) {
      console.error('Error in autocomplete controller:', error);
      res.status(500).json({
        error: 'Failed to fetch location suggestions',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/entur/reverse
   * Reverse geocode coordinates to get location information
   *
   * Query parameters:
   * - lat: Latitude (required)
   * - lon: Longitude (required)
   * - size: Number of results (optional, default: 1)
   */
  async reverseGeocode(req: Request, res: Response): Promise<void> {
    try {
      const { lat, lon, size = '1' } = req.query;

      // Validate input
      if (!lat || !lon) {
        res.status(400).json({
          error: 'Missing required parameters: lat and lon',
        });
        return;
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);

      if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({
          error: 'Invalid latitude or longitude values',
        });
        return;
      }

      // Validate coordinate ranges
      if (latitude < -90 || latitude > 90) {
        res.status(400).json({
          error: 'Latitude must be between -90 and 90',
        });
        return;
      }

      if (longitude < -180 || longitude > 180) {
        res.status(400).json({
          error: 'Longitude must be between -180 and 180',
        });
        return;
      }

      const parsedSize = parseInt(size as string, 10);
      if (isNaN(parsedSize) || parsedSize < 1 || parsedSize > 10) {
        res.status(400).json({
          error: 'Size must be a number between 1 and 10',
        });
        return;
      }

      // Call Entur service
      const locations = await enturService.reverseGeocode(
        latitude,
        longitude,
        parsedSize
      );

      const response: EnturReverseGeocodeResponse = {
        success: true,
        data: locations,
        count: locations.length,
      };

      res.json(response);
    } catch (error) {
      console.error('Error in reverse geocode controller:', error);
      res.status(500).json({
        error: 'Failed to reverse geocode location',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * POST /api/entur/journey
   * Search for journey plans (placeholder for future implementation)
   */
  async searchJourneys(req: Request, res: Response): Promise<void> {
    res.status(501).json({
      error: 'Journey search not yet implemented',
      message: 'This endpoint will be implemented in a future update',
    });
  }
}

// Export singleton instance
export const enturController = new EnturController();
