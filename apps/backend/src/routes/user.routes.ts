import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User profile routes
// GET /api/users/me - Get current user profile
router.get('/me', (req, res) => userController.getProfile(req, res));

// PUT /api/users/me - Update current user profile
router.put('/me', (req, res) => userController.updateProfile(req, res));

// Place routes
// POST /api/users/places - Create a new place
router.post('/places', (req, res) => userController.createPlace(req, res));

// GET /api/users/places - Get all places for user
router.get('/places', (req, res) => userController.getPlaces(req, res));

// DELETE /api/users/places/:id - Delete a place
router.delete('/places/:id', (req, res) => userController.deletePlace(req, res));

// Trip routes
// POST /api/users/trips - Create a new trip
router.post('/trips', (req, res) => userController.createTrip(req, res));

// GET /api/users/trips - Get all trips for user
router.get('/trips', (req, res) => userController.getTrips(req, res));

// DELETE /api/users/trips/:id - Delete a trip
router.delete('/trips/:id', (req, res) => userController.deleteTrip(req, res));

// Dashboard routes
// GET /api/users/dashboard/stats - Get dashboard statistics
router.get('/dashboard/stats', (req, res) =>
  userController.getDashboardStats(req, res)
);

// GET /api/users/dashboard/recent-trips - Get recent trips
router.get('/dashboard/recent-trips', (req, res) =>
  userController.getRecentTrips(req, res)
);

export default router;
