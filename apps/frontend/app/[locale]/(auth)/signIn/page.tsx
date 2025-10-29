'use client';

import { SignInForm } from '@/components/auth/signIn/SignInForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function SignInContent() {
  const { isAuthenticated, isCheckingAuth, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const callbackUrl = searchParams.get('callback');

  // Only redirect if user is already authenticated (e.g., page refresh)
  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated && user) {
      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        if (user.role === 'ADMIN') {
          router.push(`/${locale}/admin`);
        } else {
          router.push(`/${locale}/user`);
        }
      }
    }
  }, [isAuthenticated, isCheckingAuth, user, router, locale, callbackUrl]);

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
      <SignInForm callbackUrl={callbackUrl} />
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-norwegian-blue"></div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
