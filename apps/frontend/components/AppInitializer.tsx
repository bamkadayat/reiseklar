'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { checkAuth } from '@/store/authSlice';

/**
 * AppInitializer - Checks auth on mount in the background
 * The app renders immediately without waiting for auth check
 */
export function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check auth status on app mount (runs in background)
    dispatch(checkAuth());
  }, [dispatch]);

  // Render the app immediately without waiting for auth check
  return <>{children}</>;
}
