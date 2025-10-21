import { z } from 'zod';

// ============================================
// ADMIN USER TYPES
// ============================================

export const AdminUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['USER', 'ADMIN']),
  status: z.string(),
  joinDate: z.string(),
  trips: z.number(),
  places: z.number(),
  provider: z.string().optional(),
  avatar: z.string().optional(),
});

export type AdminUser = z.infer<typeof AdminUserSchema>;

// ============================================
// ADMIN STATS TYPES
// ============================================

export const AdminStatsSchema = z.object({
  totalUsers: z.number(),
  activeUsers: z.number(),
  newToday: z.number(),
  admins: z.number(),
  totalTrips: z.number(),
  totalPlaces: z.number(),
});

export type AdminStats = z.infer<typeof AdminStatsSchema>;

// ============================================
// SYSTEM HEALTH TYPES
// ============================================

export type SystemHealthStatus = 'Healthy' | 'Warning' | 'Error';

export const SystemHealthMetricSchema = z.object({
  name: z.string(),
  status: z.enum(['Healthy', 'Warning', 'Error']),
  percentage: z.number().min(0).max(100),
});

export type SystemHealthMetric = z.infer<typeof SystemHealthMetricSchema>;

export type SystemHealth = SystemHealthMetric[];

// ============================================
// ADMIN API RESPONSE TYPES
// ============================================

export interface GetUsersResponse {
  success: boolean;
  users: AdminUser[];
}

export interface GetStatsResponse {
  success: boolean;
  stats: AdminStats;
}

export interface GetSystemHealthResponse {
  success: boolean;
  health: SystemHealth;
}

export interface UpdateUserRoleResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
  };
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}
