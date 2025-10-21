import { z } from 'zod';

// ============================================
// DASHBOARD STATS TYPES
// ============================================

export const DashboardStatsSchema = z.object({
  totalTrips: z.number(),
  tripsThisMonth: z.number(),
  tripsThisWeek: z.number(),
  places: z.number(),
  timeSaved: z.string(),
  co2Saved: z.string(),
  efficiency: z.number().min(0).max(100),
  tripsTrend: z.number(),
});

export type DashboardStats = z.infer<typeof DashboardStatsSchema>;

// ============================================
// RECENT TRIP TYPES
// ============================================

export const RecentTripSchema = z.object({
  id: z.string(),
  origin: z.string(),
  destination: z.string(),
  createdAt: z.string(),
  estimatedDuration: z.string(),
  transportMode: z.string(),
  status: z.string(),
});

export type RecentTrip = z.infer<typeof RecentTripSchema>;

// ============================================
// DASHBOARD API RESPONSE TYPES
// ============================================

export interface GetDashboardStatsResponse {
  success: boolean;
  stats: DashboardStats;
}

export interface GetRecentTripsResponse {
  success: boolean;
  data: RecentTrip[];
}
