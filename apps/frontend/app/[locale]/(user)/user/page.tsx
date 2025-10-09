import { useTranslations } from 'next-intl';
import { StatCard } from '@/components/dashboard/shared/StatCard';
import { Route, Clock, Leaf, TrendingUp } from 'lucide-react';

export default function UserDashboardPage() {
  const t = useTranslations('dashboard.user');

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {t('welcome')}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          {t('welcomeMessage')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title={t('totalTrips')}
          value="24"
          icon={Route}
          trend={{ value: 12, isPositive: true }}
          description={t('thisMonth')}
          color="blue"
        />
        <StatCard
          title={t('timeSaved')}
          value="4.5h"
          icon={Clock}
          trend={{ value: 8, isPositive: true }}
          description={t('thisWeek')}
          color="green"
        />
        <StatCard
          title={t('co2Saved')}
          value="15kg"
          icon={Leaf}
          trend={{ value: 5, isPositive: true }}
          description={t('thisMonth')}
          color="purple"
        />
        <StatCard
          title={t('efficiency')}
          value="94%"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
          description={t('vsLastMonth')}
          color="orange"
        />
      </div>

      {/* Recent Trips */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('recentTrips')}
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {[1, 2, 3, 4, 5].map((trip) => (
            <div
              key={trip}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Route className="w-4 h-4 text-norwegian-blue" />
                    <h3 className="font-medium text-gray-900">
                      Oslo S → Lysaker
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500">Train • 15 min</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-sm text-gray-600">Today, 08:30</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    On time
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button className="p-6 bg-white border-2 border-norwegian-blue rounded-lg hover:bg-norwegian-blue hover:text-white transition-all group">
          <Route className="w-8 h-8 mb-3 text-norwegian-blue group-hover:text-white" />
          <h3 className="font-semibold mb-1">{t('planNewRoute')}</h3>
          <p className="text-sm text-gray-600 group-hover:text-white/90">
            {t('planNewRouteDesc')}
          </p>
        </button>
        <button className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all">
          <Clock className="w-8 h-8 mb-3 text-green-600" />
          <h3 className="font-semibold mb-1">{t('savedRoutes')}</h3>
          <p className="text-sm text-gray-600">{t('savedRoutesDesc')}</p>
        </button>
        <button className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all">
          <Leaf className="w-8 h-8 mb-3 text-purple-600" />
          <h3 className="font-semibold mb-1">{t('ecoStats')}</h3>
          <p className="text-sm text-gray-600">{t('ecoStatsDesc')}</p>
        </button>
      </div>
    </div>
  );
}
