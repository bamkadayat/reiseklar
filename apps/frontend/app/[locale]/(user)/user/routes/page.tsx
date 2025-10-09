import { useTranslations } from 'next-intl';
import { Route, MapPin, Clock, Star, Plus, Trash2, Edit } from 'lucide-react';

export default function UserRoutesPage() {
  const t = useTranslations('dashboard.user.routes');

  const savedRoutes = [
    {
      id: 1,
      name: 'Morning Commute',
      from: 'Home',
      to: 'Office',
      duration: '35 min',
      type: 'Train + Walk',
      favorite: true,
      frequency: 'Daily',
    },
    {
      id: 2,
      name: 'Evening Return',
      from: 'Office',
      to: 'Home',
      duration: '40 min',
      type: 'Bus + Walk',
      favorite: true,
      frequency: 'Daily',
    },
    {
      id: 3,
      name: 'Weekend Shopping',
      from: 'Home',
      to: 'Shopping Center',
      duration: '25 min',
      type: 'Tram',
      favorite: false,
      frequency: 'Weekly',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t('title')}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            {t('description')}
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-norwegian-blue text-white font-medium rounded-lg hover:bg-norwegian-blue-600 transition-colors whitespace-nowrap">
          <Plus className="w-5 h-5" />
          {t('addRoute')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">{t('totalRoutes')}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">{t('favorites')}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">{t('thisWeek')}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">{t('avgTime')}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">33m</p>
        </div>
      </div>

      {/* Saved Routes List */}
      <div className="space-y-4">
        {savedRoutes.map((route) => (
          <div
            key={route.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Route Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-norwegian-blue/10 rounded-lg">
                      <Route className="w-5 h-5 text-norwegian-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {route.name}
                      </h3>
                      <p className="text-sm text-gray-500">{route.frequency}</p>
                    </div>
                  </div>
                  {route.favorite && (
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {route.from} → {route.to}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {route.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Route className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{route.type}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex-1 sm:flex-none px-4 py-2 text-norwegian-blue border border-norwegian-blue rounded-lg hover:bg-norwegian-blue hover:text-white transition-colors">
                  <Edit className="w-4 h-4 mx-auto" />
                </button>
                <button className="flex-1 sm:flex-none px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors">
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
                <button className="flex-1 sm:flex-none px-6 py-2 bg-norwegian-blue text-white font-medium rounded-lg hover:bg-norwegian-blue-600 transition-colors whitespace-nowrap">
                  {t('useRoute')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
