'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FiUserPlus } from 'react-icons/fi';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.svg"
              alt="Reiseklar Logo"
              width={190}
              height={50}
              priority
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Login Link */}
            <Link
              href="/login"
              className="flex items-center gap-2 text-norwegian-blue hover:text-norwegian-blue-600 font-medium text-base transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Log in
            </Link>

            {/* Register Button */}
            <Link
              href="/register"
              className="flex items-center gap-2 text-norwegian-blue px-4 py-2 rounded-lg hover:bg-neutral-light font-medium text-base transition-colors"
            >
              <FiUserPlus className="w-5 h-5" />
              Register
            </Link>

            {/* About Link */}
            <Link
              href="/about"
              className="text-norwegian-blue hover:text-norwegian-blue-600 font-medium text-base transition-colors"
            >
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col items-center gap-1.5 text-norwegian-blue p-3"
            aria-label="Toggle menu"
          >
            <span className="text-sm font-semibold transition-opacity duration-200">
              {isMobileMenuOpen ? 'Close' : 'Menu'}
            </span>
            <div className="relative w-8 h-4 flex items-center justify-center">
              <span
                className={`absolute w-8 h-1 bg-norwegian-blue rounded-full transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? 'rotate-45' : 'rotate-0 -translate-y-1.5'
                }`}
              ></span>
              <span
                className={`absolute w-8 h-1 bg-norwegian-blue rounded-full transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? '-rotate-45' : 'rotate-0 translate-y-1.5'
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 top-16 bg-white z-40 md:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6 space-y-4">
            {/* Language Switcher */}
            <div className="pb-4 border-b border-gray-200">
              <LanguageSwitcher />
            </div>

            {/* Login Link */}
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 text-norwegian-blue hover:text-norwegian-blue-600 font-medium text-lg py-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Log in
            </Link>

            {/* Register Button */}
            <Link
              href="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 text-norwegian-blue hover:text-norwegian-blue-600 font-medium text-lg py-2 transition-colors"
            >
              <FiUserPlus className="w-6 h-6" />
              Register
            </Link>

            {/* About Link */}
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center text-norwegian-blue hover:text-norwegian-blue-600 font-medium text-lg py-2 transition-colors"
            >
              About
            </Link>
        </div>
      </div>
    </nav>
  );
}
