'use client';

import React, { createContext, useContext } from 'react';
import { User } from '@/lib/api/auth.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuth, loginUser, logoutUser } from '@/store/authSlice';

interface AuthContextType {
  user: User | null;
  isCheckingAuth: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isCheckingAuth } = useAppSelector((state) => state.auth);

  const login = async (email: string, password: string) => {
    await dispatch(loginUser({ email, password })).unwrap();
  };

  const logout = async () => {
    await dispatch(logoutUser()).unwrap();
  };

  const refreshUser = async () => {
    await dispatch(checkAuth()).unwrap();
  };

  const value: AuthContextType = {
    user,
    isCheckingAuth,
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
