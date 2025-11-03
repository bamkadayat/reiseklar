'use client';

import { useTranslations } from 'next-intl';
import { StatCard } from '@/components/dashboard/shared/StatCard';
import { Users, Route, TrendingUp, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminService } from '@/lib/api/admin.service';
import type { AdminStats, AdminUser, SystemHealth } from '@reiseklar/shared';
import {
  StatCardSkeleton,
  RecentUserCardSkeleton,
  SystemHealthSkeleton,
  QuickActionSkeleton,
} from '@/components/dashboard/shared/SkeletonLoaders';

export default function AdminDashboardPage() {
  const t = useTranslations('dashboard.admin');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, usersData, healthData] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers(),
          adminService.getSystemHealth(),
        ]);
        setStats(statsData);
        // Get 5 most recent users
        setRecentUsers(usersData.slice(0, 5));
        setSystemHealth(healthData);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          {t('welcome')}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          {t('welcomeMessage')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title={t('totalUsers')}
              value={stats?.totalUsers.toLocaleString() || '0'}
              icon={Users}
              description={`${stats?.newToday || 0} new today`}
              color="blue"
            />
            <StatCard
              title={t('activeRoutes')}
              value={stats?.totalTrips.toLocaleString() || '0'}
              icon={Route}
              description="Total trips created"
              color="green"
            />
            <StatCard
              title="Active Users"
              value={stats?.activeUsers.toLocaleString() || '0'}
              icon={Activity}
              description="Email verified"
              color="purple"
            />
            <StatCard
              title="Admins"
              value={stats?.admins.toLocaleString() || '0'}
              icon={TrendingUp}
              description={`${stats?.totalPlaces || 0} total places`}
              color="orange"
            />
          </>
        )}
      </div>

      {/* Recent Activity & User Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Users */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-5 border-b border-border bg-card">
            <h2 className="text-xl font-semibold text-foreground">
              {t('recentUsers')}
            </h2>
          </div>
          <div className="space-y-0">
            {loading ? (
              <>
                <RecentUserCardSkeleton />
                <RecentUserCardSkeleton />
                <RecentUserCardSkeleton />
                <RecentUserCardSkeleton />
                <RecentUserCardSkeleton />
              </>
            ) : recentUsers.length === 0 ? (
              <div className="px-6 py-8 text-center text-muted-foreground">
                No users yet
              </div>
            ) : (
              recentUsers.map((user) => {
                const joinDate = new Date(user.joinDate);
                const now = new Date();
                const diffMs = now.getTime() - joinDate.getTime();
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
                    key={user.id}
                    className="px-6 py-4 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">
                            {user.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-foreground">
                          {timeAgo}
                        </p>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                          user.status === 'Active'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-5 border-b border-border bg-card">
            <h2 className="text-xl font-semibold text-foreground">
              {t('systemHealth')}
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {loading ? (
              <>
                <SystemHealthSkeleton />
                <SystemHealthSkeleton />
                <SystemHealthSkeleton />
                <SystemHealthSkeleton />
              </>
            ) : systemHealth.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                No health data available
              </div>
            ) : (
              systemHealth.map((metric) => {
                const statusColor =
                  metric.status === 'Healthy'
                    ? 'text-green-500'
                    : metric.status === 'Warning'
                    ? 'text-yellow-500'
                    : 'text-destructive';

                const barColor =
                  metric.status === 'Healthy'
                    ? 'bg-green-500'
                    : metric.status === 'Warning'
                    ? 'bg-yellow-500'
                    : 'bg-destructive';

                return (
                  <div key={metric.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {metric.name}
                      </span>
                      <span className={`text-sm font-semibold ${statusColor}`}>
                        {metric.status}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`${barColor} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${metric.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <>
            <QuickActionSkeleton />
            <QuickActionSkeleton />
            <QuickActionSkeleton />
          </>
        ) : (
          <>
            <button className="p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all group text-left">
              <Users className="w-10 h-10 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">{t('manageUsers')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('manageUsersDesc')}
              </p>
            </button>
            <button className="p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all text-left">
              <Activity className="w-10 h-10 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">{t('viewAnalytics')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('viewAnalyticsDesc')}</p>
            </button>
            <button className="p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all text-left">
              <Route className="w-10 h-10 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">{t('routeManagement')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('routeManagementDesc')}</p>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
