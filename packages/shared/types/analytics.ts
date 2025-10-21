import { z } from 'zod';

// ============================================
// ANALYTICS METRICS TYPES
// ============================================

export const AnalyticsMetricsSchema = z.object({
  userGrowth: z.number(),
  userGrowthTrend: z.number(),
  totalRoutes: z.number(),
  routesTrend: z.number(),
  avgSessionTime: z.string(),
  sessionTrend: z.number(),
  conversionRate: z.string(),
  conversionTrend: z.number(),
});

export type AnalyticsMetrics = z.infer<typeof AnalyticsMetricsSchema>;

// ============================================
// USER GROWTH CHART TYPES
// ============================================

export const UserGrowthDataPointSchema = z.object({
  month: z.string(),
  count: z.number(),
});

export type UserGrowthDataPoint = z.infer<typeof UserGrowthDataPointSchema>;

export type UserGrowthData = UserGrowthDataPoint[];

// ============================================
// ROUTE USAGE TYPES
// ============================================

export const RouteUsageItemSchema = z.object({
  name: z.string(),
  value: z.number(),
  count: z.number(),
});

export type RouteUsageItem = z.infer<typeof RouteUsageItemSchema>;

export type RouteUsageData = RouteUsageItem[];

// ============================================
// POPULAR ROUTES TYPES
// ============================================

export const PopularRouteSchema = z.object({
  route: z.string(),
  origin: z.string(),
  destination: z.string(),
  count: z.number(),
  mode: z.string(),
  duration: z.string(),
  trend: z.number(),
});

export type PopularRoute = z.infer<typeof PopularRouteSchema>;

export type PopularRoutesData = PopularRoute[];

// ============================================
// ANALYTICS API RESPONSE TYPES
// ============================================

export interface GetAnalyticsMetricsResponse {
  success: boolean;
  metrics: AnalyticsMetrics;
}

export interface GetUserGrowthChartResponse {
  success: boolean;
  data: UserGrowthData;
}

export interface GetRouteUsageResponse {
  success: boolean;
  data: RouteUsageData;
}

export interface GetPopularRoutesResponse {
  success: boolean;
  data: PopularRoutesData;
}
