'use client';

import { useTranslations } from 'next-intl';
import { Route, MapPin, Plus, Trash2, Search, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { tripsService, Trip } from '@/lib/api/trips.service';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function UserRoutesPage() {
  const t = useTranslations('dashboard.user.routesPage');
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await tripsService.getTrips();
      setTrips(data);
    } catch (err: any) {
      console.error('Error fetching trips:', err);
      setError(err.message || 'Failed to load saved routes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (trip: Trip) => {
    setTripToDelete(trip);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!tripToDelete) return;

    try {
      setDeletingId(tripToDelete.id);
      await tripsService.deleteTrip(tripToDelete.id);
      // Remove from local state
      setTrips(trips.filter(trip => trip.id !== tripToDelete.id));
      setDeleteDialogOpen(false);
      setTripToDelete(null);
    } catch (err: any) {
      console.error('Error deleting trip:', err);
      alert(err.message || 'Failed to delete route');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUseRoute = (trip: Trip) => {
    // Navigate to journey page with the trip's origin and destination
    const params = new URLSearchParams({
      startId: trip.origin?.id || '',
      startLabel: trip.origin?.label || '',
      startLat: trip.origin?.lat.toString() || '',
      startLon: trip.origin?.lon.toString() || '',
      stopId: trip.destination?.id || '',
      stopLabel: trip.destination?.label || '',
      stopLat: trip.destination?.lat.toString() || '',
      stopLon: trip.destination?.lon.toString() || '',
      transportModes: 'rail,tram,bus,coach,water,car_ferry,metro',
      date: new Date().getTime().toString(),
      tripMode: 'oneway',
      walkSpeed: '1.3',
      minimumTransferTime: '120',
      timepickerMode: 'departAfter',
    });
    router.push(`/journey?${params.toString()}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {t('description')}
          </p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-norwegian-blue text-white font-medium rounded-lg hover:bg-norwegian-blue-600 transition-colors whitespace-nowrap"
        >
          <Search className="w-5 h-5" />
          Search New Route
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-transparent rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('totalRoutes')}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{trips.length}</p>
        </div>
        <div className="bg-transparent rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Recent</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{trips.slice(0, 5).length}</p>
        </div>
        <div className="bg-transparent rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {trips.filter(t => {
              const tripDate = new Date(t.createdAt);
              const now = new Date();
              return tripDate.getMonth() === now.getMonth() && tripDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
        <div className="bg-transparent rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Places</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {new Set([...trips.map(t => t.originId), ...trips.map(t => t.destinationId)]).size}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-norwegian-blue dark:text-blue-400" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">Error loading routes</p>
          <p className="text-red-500 dark:text-red-400 text-sm mb-4">{error}</p>
          <button
            onClick={fetchTrips}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && trips.length === 0 && (
        <div className="bg-transparent rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Route className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No saved routes yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Search for a route and click &quot;Save Route&quot; to save it here.</p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-norwegian-blue text-white font-medium rounded-lg hover:bg-norwegian-blue-600 transition-colors"
          >
            <Search className="w-5 h-5" />
            Search Routes
          </button>
        </div>
      )}

      {/* Saved Routes List */}
      {!isLoading && !error && trips.length > 0 && (
        <div className="space-y-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-transparent rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-gray-800/50 transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Route Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-norwegian-blue/10 dark:bg-blue-500/20 rounded-lg">
                        <Route className="w-5 h-5 text-norwegian-blue dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {trip.origin?.label} → {trip.destination?.label}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Saved {new Date(trip.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {trip.origin?.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {trip.destination?.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteClick(trip)}
                    disabled={deletingId === trip.id}
                    className="flex-1 sm:flex-none px-4 py-2 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === trip.id ? (
                      <Loader2 className="w-4 h-4 mx-auto animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mx-auto" />
                    )}
                  </button>
                  <button
                    onClick={() => handleUseRoute(trip)}
                    className="flex-1 sm:flex-none px-6 py-2 bg-norwegian-blue text-white font-medium rounded-lg hover:bg-norwegian-blue-600 transition-colors whitespace-nowrap"
                  >
                    Use Route
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Route?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the route from{' '}
              <span className="font-semibold">{tripToDelete?.origin?.label}</span> to{' '}
              <span className="font-semibold">{tripToDelete?.destination?.label}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingId !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deletingId !== null}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 disabled:opacity-70"
            >
              {deletingId ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Deleting...
                </span>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
