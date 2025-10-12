'use client';

import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { authService, User } from '@/lib/api/auth.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser as setReduxUser, clearUser } from '@/store/authSlice';

interface AuthContextType {
  user: User | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);

  // Load user profile on mount
  // With cookie-based auth, we always try to get the profile
  // The backend will validate the cookie
  const loadUser = useCallback(async () => {
    try {
      const userData = await authService.getProfile();
      dispatch(setReduxUser(userData));
    } catch (error) {
      // Not logged in or session expired
      dispatch(clearUser());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isInitialized) {
      loadUser();
    }
  }, [isInitialized, loadUser]);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    dispatch(setReduxUser(response.user));
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if backend call fails
    } finally {
      dispatch(clearUser());
    }
  };

  const refreshUser = async () => {
    await loadUser();
  };

  const value: AuthContextType = {
    user,
    isInitialized,
    isAuthenticated,
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
