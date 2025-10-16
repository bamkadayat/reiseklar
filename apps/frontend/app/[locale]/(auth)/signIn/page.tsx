'use client';

import { SignInForm } from '@/components/auth/signIn/SignInForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignInPage() {
  const { isAuthenticated, isCheckingAuth, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated && user) {
      // Redirect based on user role
      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/user');
      }
    }
  }, [isAuthenticated, isCheckingAuth, user, router]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-norwegian-blue"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full max-w-[500px] mx-auto p-4 mt-8 sm:mt-24">
      <SignInForm />
    </div>
  );
}
