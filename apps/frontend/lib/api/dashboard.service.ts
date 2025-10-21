import { apiClient } from './client';
import type {
  DashboardStats,
  RecentTrip,
  GetDashboardStatsResponse,
  GetRecentTripsResponse,
} from '@reiseklar/shared';

export const dashboardService = {
  /**
   * Get user dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<GetDashboardStatsResponse>(
      '/api/users/dashboard/stats'
    );
    return response.stats;
  },

  /**
   * Get recent trips for dashboard
   */
  async getRecentTrips(limit: number = 5): Promise<RecentTrip[]> {
    const response = await apiClient.get<GetRecentTripsResponse>(
      `/api/users/dashboard/recent-trips?limit=${limit}`
    );
    return response.data;
  },
};
