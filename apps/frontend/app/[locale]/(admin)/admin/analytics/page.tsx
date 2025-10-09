import { useTranslations } from 'next-intl';
import { StatCard } from '@/components/dashboard/shared/StatCard';
import { TrendingUp, Users, Route, Clock } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const t = useTranslations('dashboard.admin.analytics');

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
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === '30d'
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
          value="+234"
          icon={Users}
          trend={{ value: 23, isPositive: true }}
          description={t('thisMonth')}
          color="blue"
        />
        <StatCard
          title={t('totalRoutes')}
          value="5,678"
          icon={Route}
          trend={{ value: 12, isPositive: true }}
          description={t('thisMonth')}
          color="green"
        />
        <StatCard
          title={t('avgSessionTime')}
          value="8.5m"
          icon={Clock}
          trend={{ value: 5, isPositive: true }}
          description={t('vsLastMonth')}
          color="purple"
        />
        <StatCard
          title={t('conversionRate')}
          value="3.2%"
          icon={TrendingUp}
          trend={{ value: 0.5, isPositive: true }}
          description={t('vsLastMonth')}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('userGrowthChart')}
          </h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 65, 45, 80, 60, 90, 75, 95, 85, 100, 88, 92].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-norwegian-blue rounded-t hover:bg-norwegian-blue-600 transition-colors cursor-pointer"
                  style={{ height: `${height}%` }}
                  title={`${height} users`}
                ></div>
                <span className="text-xs text-gray-500">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Route Usage Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('routeUsage')}
          </h2>
          <div className="space-y-4">
            {[
              { name: 'Train', value: 45, color: 'bg-blue-600' },
              { name: 'Bus', value: 30, color: 'bg-green-600' },
              { name: 'Tram', value: 15, color: 'bg-purple-600' },
              { name: 'Walking', value: 10, color: 'bg-orange-600' },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {item.name}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.value}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Routes */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('popularRoutes')}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('route')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('users')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('avgDuration')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('trend')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { route: 'Oslo S → Lysaker', users: 456, duration: '15 min', trend: '+12%' },
                { route: 'Nationaltheatret → Majorstuen', users: 389, duration: '8 min', trend: '+8%' },
                { route: 'Jernbanetorget → Grønland', users: 278, duration: '5 min', trend: '+5%' },
                { route: 'Stortinget → Aker Brygge', users: 234, duration: '12 min', trend: '+15%' },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {item.route}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.users}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.duration}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-green-600 font-medium">
                      {item.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
