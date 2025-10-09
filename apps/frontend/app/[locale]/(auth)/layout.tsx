import { ReactNode } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center py-12">
        <div className="w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Auth Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>

          {/* Right Side - Branding */}
          <div className="hidden lg:flex bg-gradient-to-br from-norwegian-blue to-blue-700 rounded-2xl p-12 flex-col justify-between relative overflow-hidden min-h-[600px]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-norwegian-blue">R</span>
            </div>
            <span className="text-3xl font-bold text-white">Reiseklar</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Smart Commute Planning for Norway
          </h1>
          <p className="text-xl text-blue-100">
            Join thousands of commuters optimizing their daily journeys with real-time route planning and eco-friendly travel options.
          </p>

          {/* Features */}
          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg">Real-time route optimization</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg">Track your environmental impact</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg">Save time and money</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-blue-100 text-sm">
          © 2025 Reiseklar. All rights reserved.
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
