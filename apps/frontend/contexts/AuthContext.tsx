'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authService, User } from '@/lib/api/auth.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to get cached user from localStorage
const getCachedUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem('auth_user');
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

// Helper to cache user in localStorage
const setCachedUser = (user: User | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  } catch {
    // Ignore localStorage errors
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize with cached user to prevent flickering
  const initialUser = useMemo(() => getCachedUser(), []);
  const [user, setUser] = useState<User | null>(initialUser);
  // Start with loading true, only set to false after initial auth check
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile on mount
  // With cookie-based auth, we always try to get the profile
  // The backend will validate the cookie
  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const userData = await authService.getProfile();
      setUser(userData);
      setCachedUser(userData); // Cache for next page load
    } catch (error) {
      // Not logged in or session expired
      setUser(null);
      setCachedUser(null); // Clear cache
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
    setCachedUser(response.user); // Cache user
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if backend call fails
    } finally {
      setUser(null);
      setCachedUser(null); // Clear cache
    }
  };

  const refreshUser = async () => {
    await loadUser();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
