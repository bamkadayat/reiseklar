import { apiClient } from './client';
import type {
  AnalyticsMetrics,
  UserGrowthData,
  RouteUsageData,
  PopularRoutesData,
  GetAnalyticsMetricsResponse,
  GetUserGrowthChartResponse,
  GetRouteUsageResponse,
  GetPopularRoutesResponse,
} from '@reiseklar/shared';

export const analyticsService = {
  /**
   * Get analytics metrics (user growth, routes, session time, conversion)
   */
  async getMetrics(): Promise<AnalyticsMetrics> {
    const response = await apiClient.get<GetAnalyticsMetricsResponse>(
      '/api/admin/analytics/metrics'
    );
    return response.metrics;
  },

  /**
   * Get user growth chart data (last 12 months)
   */
  async getUserGrowthChart(): Promise<UserGrowthData> {
    const response = await apiClient.get<GetUserGrowthChartResponse>(
      '/api/admin/analytics/user-growth'
    );
    return response.data;
  },

  /**
   * Get route usage by transport mode
   */
  async getRouteUsage(): Promise<RouteUsageData> {
    const response = await apiClient.get<GetRouteUsageResponse>(
      '/api/admin/analytics/route-usage'
    );
    return response.data;
  },

  /**
   * Get popular routes
   */
  async getPopularRoutes(): Promise<PopularRoutesData> {
    const response = await apiClient.get<GetPopularRoutesResponse>(
      '/api/admin/analytics/popular-routes'
    );
    return response.data;
  },
};
