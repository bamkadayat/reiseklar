'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuth } from '@/store/authSlice';

/**
 * AppInitializer - Checks auth on mount and shows loading until complete
 * This prevents navbar from flickering by ensuring auth state is ready before rendering
 */
export function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isCheckingAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check auth status on app mount
    dispatch(checkAuth());
  }, [dispatch]);

  // Show loading screen until auth check is complete
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-norwegian-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Auth check complete - render the app
  return <>{children}</>;
}
