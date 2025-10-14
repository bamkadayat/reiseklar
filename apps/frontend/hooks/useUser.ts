import { useState, useEffect } from 'react';
import { authService } from '@/lib/api/auth.service';
import type { User } from '@reiseklar/shared';

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage current user data
 */
export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (err: any) {
      // Don't set error for 401 - user is just not authenticated
      if (err?.statusCode === 401) {
        setUser(null);
      } else {
        setError(err?.message || 'Failed to fetch user data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}
