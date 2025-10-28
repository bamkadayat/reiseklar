import { Response } from 'express';
import { AuthRequest } from '../types';
import { authService } from '../services/auth.service';
import { prisma } from '../utils/prisma';

export class UserController {
  // GET /api/users/me
  async getProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const user = await authService.getUserById(req.userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // PUT /api/users/me
  async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { name, theme, language } = req.body;

      // Validate theme if provided
      if (theme && !['light', 'dark', 'system'].includes(theme)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid theme. Must be one of: light, dark, system',
        });
      }

      // Validate language if provided
      if (language && !['en', 'nb'].includes(language)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid language. Must be one of: en, nb',
        });
      }

      const updatedUser = await authService.updateUserProfile(req.userId, {
        name,
        theme,
        language,
      });

      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // POST /api/users/places - Create a new place
  async createPlace(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { label, lat, lon, address } = req.body;

      // Validate required fields
      if (!label || lat === undefined || lon === undefined || !address) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: label, lat, lon, address',
        });
      }

      // Check if place already exists for this user
      const existingPlace = await prisma.place.findFirst({
        where: {
          userId: req.userId,
          label,
          lat,
          lon,
        },
      });

      if (existingPlace) {
        return res.status(200).json({
          success: true,
          data: existingPlace,
          message: 'Place already exists',
        });
      }

      const place = await prisma.place.create({
        data: {
          userId: req.userId,
          label,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          address,
        },
      });

      res.status(201).json({
        success: true,
        data: place,
      });
    } catch (error) {
      console.error('Error creating place:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // GET /api/users/places - Get all places for user
  async getPlaces(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const places = await prisma.place.findMany({
        where: {
          userId: req.userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.status(200).json({
        success: true,
        data: places,
      });
    } catch (error) {
      console.error('Error fetching places:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // DELETE /api/users/places/:id - Delete a place
  async deletePlace(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { id } = req.params;

      // Check if place exists and belongs to user
      const place = await prisma.place.findFirst({
        where: {
          id,
          userId: req.userId,
        },
      });

      if (!place) {
        return res.status(404).json({
          success: false,
          error: 'Place not found',
        });
      }

      await prisma.place.delete({
        where: {
          id,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Place deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting place:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // POST /api/users/trips - Create a new trip
  async createTrip(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { origin, destination, accessibility, routeData } = req.body;

      // Validate required fields
      if (!origin || !destination) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: origin, destination',
        });
      }

      // Create or get origin place
      let originPlace = await prisma.place.findFirst({
        where: {
          userId: req.userId,
          label: origin.label,
          lat: parseFloat(origin.lat),
          lon: parseFloat(origin.lon),
        },
      });

      if (!originPlace) {
        originPlace = await prisma.place.create({
          data: {
            userId: req.userId,
            label: origin.label,
            lat: parseFloat(origin.lat),
            lon: parseFloat(origin.lon),
            address: origin.address || origin.label,
          },
        });
      }

      // Create or get destination place
      let destinationPlace = await prisma.place.findFirst({
        where: {
          userId: req.userId,
          label: destination.label,
          lat: parseFloat(destination.lat),
          lon: parseFloat(destination.lon),
        },
      });

      if (!destinationPlace) {
        destinationPlace = await prisma.place.create({
          data: {
            userId: req.userId,
            label: destination.label,
            lat: parseFloat(destination.lat),
            lon: parseFloat(destination.lon),
            address: destination.address || destination.label,
          },
        });
      }

      // Generate route hash if routeData is provided
      let routeHash = null;
      if (routeData) {
        const crypto = require('crypto');
        // Create hash from startTime, endTime, and leg details
        const routeString = JSON.stringify({
          startTime: routeData.startTime,
          endTime: routeData.endTime,
          legs: routeData.legs?.map((leg: any) => ({
            mode: leg.mode,
            line: leg.line?.publicCode,
            from: leg.fromPlace?.name,
            to: leg.toPlace?.name,
          })),
        });
        routeHash = crypto.createHash('sha256').update(routeString).digest('hex');

        // Check if this exact route already exists
        const existingRoute = await prisma.trip.findFirst({
          where: {
            userId: req.userId,
            routeHash,
          },
          include: {
            origin: true,
            destination: true,
          },
        });

        if (existingRoute) {
          return res.status(409).json({
            success: false,
            error: 'This exact route is already saved',
            data: existingRoute,
          });
        }
      }

      // Create trip
      const trip = await prisma.trip.create({
        data: {
          userId: req.userId,
          originId: originPlace.id,
          destinationId: destinationPlace.id,
          accessibility: accessibility || 'none',
          routeHash,
          routeData: routeData || null,
        },
        include: {
          origin: true,
          destination: true,
        },
      });

      res.status(201).json({
        success: true,
        data: trip,
      });
    } catch (error) {
      console.error('Error creating trip:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // GET /api/users/trips - Get all trips for user
  async getTrips(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const trips = await prisma.trip.findMany({
        where: {
          userId: req.userId,
        },
        include: {
          origin: true,
          destination: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.status(200).json({
        success: true,
        data: trips,
      });
    } catch (error) {
      console.error('Error fetching trips:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // DELETE /api/users/trips/:id - Delete a trip
  async deleteTrip(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { id } = req.params;

      // Check if trip exists and belongs to user
      const trip = await prisma.trip.findFirst({
        where: {
          id,
          userId: req.userId,
        },
      });

      if (!trip) {
        return res.status(404).json({
          success: false,
          error: 'Trip not found',
        });
      }

      await prisma.trip.delete({
        where: {
          id,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Trip deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting trip:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // GET /api/users/dashboard/stats - Get user dashboard statistics
  async getDashboardStats(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      // Get total trips count
      const totalTrips = await prisma.trip.count({
        where: { userId: req.userId },
      });

      // Get trips from this month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const tripsThisMonth = await prisma.trip.count({
        where: {
          userId: req.userId,
          createdAt: { gte: startOfMonth },
        },
      });

      // Get trips from this week
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const tripsThisWeek = await prisma.trip.count({
        where: {
          userId: req.userId,
          createdAt: { gte: startOfWeek },
        },
      });

      // Get unique places count
      const places = await prisma.place.count({
        where: { userId: req.userId },
      });

      // Calculate estimated time saved (assuming 5 min saved per trip)
      const timeSavedHours = (tripsThisWeek * 5) / 60;

      // Calculate estimated CO2 saved (assuming 0.5kg per trip)
      const co2SavedKg = tripsThisMonth * 0.5;

      // Calculate efficiency (percentage of trips this month vs target of 30)
      const efficiency = Math.min(Math.round((tripsThisMonth / 30) * 100), 100);

      // Calculate trend compared to last month
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
      const tripsLastMonth = await prisma.trip.count({
        where: {
          userId: req.userId,
          createdAt: { gte: lastMonthStart, lt: lastMonthEnd },
        },
      });

      const tripsTrend =
        tripsLastMonth > 0
          ? Math.round(
              ((tripsThisMonth - tripsLastMonth) / tripsLastMonth) * 100
            )
          : tripsThisMonth > 0
          ? 100
          : 0;

      res.status(200).json({
        success: true,
        stats: {
          totalTrips,
          tripsThisMonth,
          tripsThisWeek,
          places,
          timeSaved: timeSavedHours.toFixed(1),
          co2Saved: co2SavedKg.toFixed(1),
          efficiency,
          tripsTrend,
        },
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // GET /api/users/dashboard/recent-trips - Get recent trips with details
  async getRecentTrips(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const limit = parseInt(req.query.limit as string) || 5;

      const trips = await prisma.trip.findMany({
        where: { userId: req.userId },
        include: {
          origin: true,
          destination: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      const formattedTrips = trips.map((trip) => ({
        id: trip.id,
        origin: trip.origin.label,
        destination: trip.destination.label,
        createdAt: trip.createdAt.toISOString(),
        // Calculate estimated duration (placeholder - you can enhance this)
        estimatedDuration: '15 min',
        // Calculate transport mode (placeholder - you can enhance this)
        transportMode: 'Train',
        status: 'Completed',
      }));

      res.status(200).json({
        success: true,
        data: formattedTrips,
      });
    } catch (error) {
      console.error('Error fetching recent trips:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}

export const userController = new UserController();
