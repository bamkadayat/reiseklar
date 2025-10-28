'use client';

import { useTranslations } from 'next-intl';
import { StatCard } from '@/components/dashboard/shared/StatCard';
import { DashboardSkeleton } from '@/components/dashboard/shared/DashboardSkeleton';
import { Route, Clock, Leaf, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { dashboardService } from '@/lib/api/dashboard.service';
import type { DashboardStats, RecentTrip } from '@reiseklar/shared';

export default function UserDashboardPage() {
  const t = useTranslations('dashboard.user');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTrips, setRecentTrips] = useState<RecentTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, tripsData] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getRecentTrips(5),
        ]);
        setStats(statsData);
        setRecentTrips(tripsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {t('welcome')}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          {t('welcomeMessage')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title={t('totalTrips')}
          value={stats?.totalTrips.toString() || '0'}
          icon={Route}
          trend={{
            value: Math.abs(stats?.tripsTrend || 0),
            isPositive: (stats?.tripsTrend || 0) >= 0,
          }}
          description={t('thisMonth')}
          color="blue"
        />
        <StatCard
          title={t('timeSaved')}
          value={`${stats?.timeSaved || '0'}h`}
          icon={Clock}
          trend={{ value: 8, isPositive: true }}
          description={t('thisWeek')}
          color="green"
        />
        <StatCard
          title={t('co2Saved')}
          value={`${stats?.co2Saved || '0'}kg`}
          icon={Leaf}
          trend={{ value: 5, isPositive: true }}
          description={t('thisMonth')}
          color="purple"
        />
        <StatCard
          title={t('efficiency')}
          value={`${stats?.efficiency || 0}%`}
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
          description={t('vsLastMonth')}
          color="orange"
        />
      </div>

      {/* Recent Trips */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {t('recentTrips')}
          </h2>
        </div>
        <div className="divide-y divide-border">
          {recentTrips.length === 0 ? (
            <div className="px-6 py-8 text-center text-muted-foreground">
              No recent trips yet. Start planning your first journey!
            </div>
          ) : (
            recentTrips.map((trip) => {
              const tripDate = new Date(trip.createdAt);
              const now = new Date();
              const diffMs = now.getTime() - tripDate.getTime();
              const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
              const diffDays = Math.floor(diffHours / 24);

              let timeAgo = '';
              if (diffDays > 0) {
                timeAgo = `${diffDays}d ago`;
              } else if (diffHours > 0) {
                timeAgo = `${diffHours}h ago`;
              } else {
                timeAgo = 'Just now';
              }

              return (
                <div
                  key={trip.id}
                  className="px-6 py-4 hover:bg-muted transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Route className="w-4 h-4 text-primary" />
                        <h3 className="font-medium text-foreground">
                          {trip.origin} → {trip.destination}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {trip.transportMode} • {trip.estimatedDuration}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className="text-sm text-muted-foreground">{timeAgo}</span>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          trip.status === 'Completed'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-accent/10 text-accent-foreground'
                        }`}
                      >
                        {trip.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button className="p-6 bg-card border-2 border-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all group text-left">
          <Route className="w-8 h-8 mb-3 text-primary group-hover:text-primary-foreground" />
          <h3 className="font-semibold mb-1 text-foreground group-hover:text-primary-foreground">{t('planNewRoute')}</h3>
          <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/90">
            {t('planNewRouteDesc')}
          </p>
        </button>
        <button className="p-6 bg-card border border-border rounded-lg hover:shadow-md transition-all text-left">
          <Clock className="w-8 h-8 mb-3 text-primary" />
          <h3 className="font-semibold mb-1 text-foreground">{t('savedRoutes')}</h3>
          <p className="text-sm text-muted-foreground">{t('savedRoutesDesc')}</p>
        </button>
        <button className="p-6 bg-card border border-border rounded-lg hover:shadow-md transition-all text-left">
          <Leaf className="w-8 h-8 mb-3 text-primary" />
          <h3 className="font-semibold mb-1 text-foreground">{t('ecoStats')}</h3>
          <p className="text-sm text-muted-foreground">{t('ecoStatsDesc')}</p>
        </button>
      </div>
    </div>
  );
}
