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

      const { name } = req.body;

      const updatedUser = await authService.updateUserProfile(req.userId, {
        name,
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

      const { origin, destination, accessibility } = req.body;

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

      // Check if trip already exists
      const existingTrip = await prisma.trip.findFirst({
        where: {
          userId: req.userId,
          originId: originPlace.id,
          destinationId: destinationPlace.id,
        },
      });

      if (existingTrip) {
        return res.status(200).json({
          success: true,
          data: existingTrip,
          message: 'Trip already exists',
        });
      }

      // Create trip
      const trip = await prisma.trip.create({
        data: {
          userId: req.userId,
          originId: originPlace.id,
          destinationId: destinationPlace.id,
          accessibility: accessibility || 'none',
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
}

export const userController = new UserController();
