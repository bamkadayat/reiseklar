'use client';

import { HeroSection } from '@/components/landing/HeroSection';
import { WeatherSection } from '@/components/landing/WeatherSection';
import { NewsSection } from '@/components/landing/NewsSection';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, isCheckingAuth, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated && user) {
      // Redirect logged-in users based on their role
      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/user');
      }
    }
  }, [isAuthenticated, isCheckingAuth, user, router]);

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-norwegian-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Don't render home page if user is authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="w-full min-h-[40vh] flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-950 to-blue-950 px-4 py-16 sm:py-20">
        <HeroSection />
      </div>
      <div className="w-full max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeatherSection />
          <NewsSection />
        </div>
      </div>
    </>
  );
}
