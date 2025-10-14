import { Router } from 'express';
import { enturController } from '../controllers/entur.controller';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for Entur API endpoints
// This prevents abuse and protects both your backend and Entur's API
const enturRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per minute
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all Entur routes
router.use(enturRateLimiter);

/**
 * GET /api/entur/autocomplete
 * Search for locations using autocomplete
 *
 * Query parameters:
 * - text: Search query (required)
 * - lang: Language code (optional, default: 'en')
 * - size: Number of results (optional, default: 10, max: 50)
 *
 * Example: /api/entur/autocomplete?text=Oslo&lang=en&size=10
 */
router.get('/autocomplete', (req, res) => enturController.autocomplete(req, res));

/**
 * GET /api/entur/reverse
 * Reverse geocode coordinates to get location information
 *
 * Query parameters:
 * - lat: Latitude (required)
 * - lon: Longitude (required)
 * - size: Number of results (optional, default: 1, max: 10)
 *
 * Example: /api/entur/reverse?lat=59.9139&lon=10.7522&size=1
 */
router.get('/reverse', (req, res) => enturController.reverseGeocode(req, res));

/**
 * POST /api/entur/journey
 * Search for journey plans (placeholder for future implementation)
 */
router.post('/journey', (req, res) => enturController.searchJourneys(req, res));

export default router;
