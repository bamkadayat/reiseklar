import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center py-12">
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
