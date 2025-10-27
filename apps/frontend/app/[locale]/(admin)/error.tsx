'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin dashboard error:', error);
  }, [error]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="max-w-md rounded-lg bg-card p-8 shadow-lg border border-border">
        <div className="mb-4 flex items-center justify-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <svg
              className="h-8 w-8 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        <h2 className="mb-2 text-center text-xl font-semibold text-foreground">
          Something went wrong!
        </h2>
        <p className="mb-6 text-center text-muted-foreground">
          An error occurred while loading the admin dashboard.
        </p>
        <button
          onClick={reset}
          className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
