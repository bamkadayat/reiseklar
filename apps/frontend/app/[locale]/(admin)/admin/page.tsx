'use client';

import { useTranslations } from 'next-intl';
import { StatCard } from '@/components/dashboard/shared/StatCard';
import { Users, Route, TrendingUp, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminService, AdminStats, AdminUser } from '@/lib/api/admin.service';

export default function AdminDashboardPage() {
  const t = useTranslations('dashboard.admin');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, usersData] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers(),
        ]);
        setStats(statsData);
        // Get 5 most recent users
        setRecentUsers(usersData.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-norwegian-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
      </div>

      {/* Recent Activity & User Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('recentUsers')}
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentUsers.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
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
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-norwegian-blue rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {timeAgo}
                        </p>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                          user.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
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
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('systemHealth')}
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  API Server
                </span>
                <span className="text-sm font-semibold text-green-600">
                  Healthy
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: '98%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Database
                </span>
                <span className="text-sm font-semibold text-green-600">
                  Healthy
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: '95%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Cache Server
                </span>
                <span className="text-sm font-semibold text-yellow-600">
                  Warning
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: '78%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Storage
                </span>
                <span className="text-sm font-semibold text-green-600">
                  Healthy
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: '92%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button className="p-6 bg-white border-2 border-norwegian-blue rounded-lg hover:bg-norwegian-blue hover:text-white transition-all group text-left">
          <Users className="w-8 h-8 mb-3 text-norwegian-blue group-hover:text-white" />
          <h3 className="font-semibold mb-1">{t('manageUsers')}</h3>
          <p className="text-sm text-gray-600 group-hover:text-white/90">
            {t('manageUsersDesc')}
          </p>
        </button>
        <button className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all text-left">
          <Activity className="w-8 h-8 mb-3 text-green-600" />
          <h3 className="font-semibold mb-1">{t('viewAnalytics')}</h3>
          <p className="text-sm text-gray-600">{t('viewAnalyticsDesc')}</p>
        </button>
        <button className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all text-left">
          <Route className="w-8 h-8 mb-3 text-purple-600" />
          <h3 className="font-semibold mb-1">{t('routeManagement')}</h3>
          <p className="text-sm text-gray-600">{t('routeManagementDesc')}</p>
        </button>
      </div>
    </div>
  );
}
