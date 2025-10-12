'use client';

import { SignInForm } from '@/components/auth/signIn/SignInForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignInPage() {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push('/user');
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-norwegian-blue"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <SignInForm />;
}
