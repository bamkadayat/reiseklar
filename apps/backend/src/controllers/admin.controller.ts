import { Response } from 'express';
import { AuthRequest } from '../types';
import { prisma } from '../utils/prisma';

export class AdminController {
  // Get all users with stats
  async getUsers(req: AuthRequest, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerifiedAt: true,
          provider: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              trips: true,
              places: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const formattedUsers = users.map((user) => ({
        id: user.id,
        name: user.name || 'N/A',
        email: user.email,
        role: user.role,
        status: user.emailVerifiedAt ? 'Active' : 'Inactive',
        joinDate: user.createdAt.toISOString(),
        trips: user._count.trips,
        places: user._count.places,
        provider: user.provider,
        avatar: user.avatar,
      }));

      return res.json({
        success: true,
        users: formattedUsers,
      });
    } catch (error: any) {
      console.error('Error fetching users:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch users',
      });
    }
  }

  // Get dashboard stats
  async getStats(req: AuthRequest, res: Response) {
    try {
      const [totalUsers, activeUsers, totalTrips, totalPlaces] =
        await Promise.all([
          prisma.user.count(),
          prisma.user.count({
            where: {
              emailVerifiedAt: {
                not: null,
              },
            },
          }),
          prisma.trip.count(),
          prisma.place.count(),
        ]);

      // Get users created today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const newToday = await prisma.user.count({
        where: {
          createdAt: {
            gte: today,
          },
        },
      });

      const admins = await prisma.user.count({
        where: {
          role: 'ADMIN',
        },
      });

      return res.json({
        success: true,
        stats: {
          totalUsers,
          activeUsers,
          newToday,
          admins,
          totalTrips,
          totalPlaces,
        },
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch stats',
      });
    }
  }

  // Update user role
  async updateUserRole(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!['USER', 'ADMIN'].includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role. Must be USER or ADMIN',
        });
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      return res.json({
        success: true,
        user,
      });
    } catch (error: any) {
      console.error('Error updating user role:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to update user role',
      });
    }
  }

  // Delete user
  async deleteUser(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;

      // Prevent self-deletion
      if (userId === req.userId) {
        return res.status(400).json({
          success: false,
          error: 'You cannot delete your own account',
        });
      }

      await prisma.user.delete({
        where: { id: userId },
      });

      return res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete user',
      });
    }
  }
}

export const adminController = new AdminController();
