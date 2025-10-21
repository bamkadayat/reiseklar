'use client';

import { useTranslations } from 'next-intl';
import { StatCard } from '@/components/dashboard/shared/StatCard';
import { TrendingUp, Users, Route, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { analyticsService } from '@/lib/api/analytics.service';
import type {
  AnalyticsMetrics,
  UserGrowthData,
  RouteUsageData,
  PopularRoutesData,
} from '@reiseklar/shared';

export default function AdminAnalyticsPage() {
  const t = useTranslations('dashboard.admin.analyticsPage');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData>([]);
  const [routeUsageData, setRouteUsageData] = useState<RouteUsageData>([]);
  const [popularRoutes, setPopularRoutes] = useState<PopularRoutesData>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [metricsData, growthData, usageData, routesData] =
          await Promise.all([
            analyticsService.getMetrics(),
            analyticsService.getUserGrowthChart(),
            analyticsService.getRouteUsage(),
            analyticsService.getPopularRoutes(),
          ]);

        setMetrics(metricsData);
        setUserGrowthData(growthData);
        setRouteUsageData(usageData);
        setPopularRoutes(routesData);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-norwegian-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {t('title')}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          {t('description')}
        </p>
      </div>

      {/* Time Period Selector */}
      <div className="flex flex-wrap gap-2">
        {['7d', '30d', '90d', '1y'].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === selectedPeriod
                ? 'bg-norwegian-blue text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {period === '7d' && t('last7Days')}
            {period === '30d' && t('last30Days')}
            {period === '90d' && t('last90Days')}
            {period === '1y' && t('lastYear')}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title={t('userGrowth')}
          value={metrics?.userGrowth.toString() || '0'}
          icon={Users}
          trend={{
            value: Math.abs(metrics?.userGrowthTrend || 0),
            isPositive: (metrics?.userGrowthTrend || 0) >= 0,
          }}
          description={t('thisMonth')}
          color="blue"
        />
        <StatCard
          title={t('totalRoutes')}
          value={metrics?.totalRoutes.toLocaleString() || '0'}
          icon={Route}
          trend={{
            value: Math.abs(metrics?.routesTrend || 0),
            isPositive: (metrics?.routesTrend || 0) >= 0,
          }}
          description={t('thisMonth')}
          color="green"
        />
        <StatCard
          title={t('avgSessionTime')}
          value={metrics?.avgSessionTime || '0m'}
          icon={Clock}
          trend={{
            value: Math.abs(metrics?.sessionTrend || 0),
            isPositive: (metrics?.sessionTrend || 0) >= 0,
          }}
          description={t('vsLastMonth')}
          color="purple"
        />
        <StatCard
          title={t('conversionRate')}
          value={metrics?.conversionRate || '0%'}
          icon={TrendingUp}
          trend={{
            value: Math.abs(metrics?.conversionTrend || 0),
            isPositive: (metrics?.conversionTrend || 0) >= 0,
          }}
          description={t('vsLastMonth')}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('userGrowthChart')}
            </h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Last 12 months
            </span>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {userGrowthData.length > 0 ? (
              userGrowthData.map((dataPoint, i) => {
                const maxCount = Math.max(...userGrowthData.map((d) => d.count));
                const height = maxCount > 0 ? (dataPoint.count / maxCount) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-norwegian-blue rounded-t hover:bg-blue-700 transition-colors cursor-pointer group relative"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                        {dataPoint.count} users
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{dataPoint.month}</span>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Route Usage Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('routeUsage')}
            </h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              By transport mode
            </span>
          </div>
          <div className="space-y-4">
            {routeUsageData.length > 0 ? (
              routeUsageData.map((item) => {
                // Map transport mode to color
                const getColorClass = (name: string) => {
                  const lowerName = name.toLowerCase();
                  if (lowerName.includes('train') || lowerName.includes('rail'))
                    return 'bg-blue-600';
                  if (lowerName.includes('bus')) return 'bg-green-600';
                  if (lowerName.includes('tram') || lowerName.includes('metro'))
                    return 'bg-purple-600';
                  if (lowerName.includes('walk') || lowerName.includes('foot'))
                    return 'bg-orange-600';
                  if (lowerName.includes('ferry') || lowerName.includes('boat'))
                    return 'bg-cyan-600';
                  if (lowerName.includes('bike') || lowerName.includes('cycle'))
                    return 'bg-yellow-600';
                  return 'bg-gray-600'; // default
                };
                const color = getColorClass(item.name);

                return (
                  <div key={item.name} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${color}`}></div>
                        <span className="text-sm font-medium text-gray-700">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">
                          {item.count.toLocaleString()} trips
                        </span>
                        <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                          {item.value}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`${color} h-2.5 rounded-full transition-all duration-500 group-hover:opacity-80`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-400">
                No route usage data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popular Routes */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('popularRoutes')}
          </h2>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Top 10 routes
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('route')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('users')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('avgDuration')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('trend')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {popularRoutes.length > 0 ? (
                popularRoutes.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          i === 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : i === 1
                            ? 'bg-gray-100 text-gray-700'
                            : i === 2
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {i + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {item.route}
                        </span>
                        <span className="text-xs text-gray-500">{item.mode}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900 font-medium">
                          {item.count.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">trips</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.trend > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.trend > 0 ? '↑' : '↓'} {Math.abs(item.trend)}%
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12">
                    <div className="flex items-center justify-center text-gray-400">
                      No popular routes data available
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
