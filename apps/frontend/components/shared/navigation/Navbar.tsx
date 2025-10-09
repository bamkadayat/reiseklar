"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations("nav");

  return (
    <nav className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 py-1">
            <Image
              src="/images/logo.png"
              alt="Reiseklar Logo"
              width={40}
              height={50}
              priority
              className="object-contain"
            />
            <span className="text-2xl md:text-3xl font-bold text-norwegian-blue">Reiseklar</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Sign In Link */}
            <Link
              href="/signIn"
              className="flex items-center gap-2 text-norwegian-blue hover:text-norwegian-blue-600 font-medium text-base transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {t("login")}
            </Link>

            {/* Sign Up Button */}
            <Link
              href="/signUp"
              className="flex items-center gap-2 text-norwegian-blue px-4 py-2 rounded-lg hover:bg-neutral-light font-medium text-base transition-colors"
            >
              <FiUserPlus className="w-5 h-5" />
              {t("register")}
            </Link>

            {/* About Link */}
            <Link
              href="/about"
              className="text-norwegian-blue hover:text-norwegian-blue-600 font-medium text-base transition-colors"
            >
              {t("about")}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col items-center gap-1.5 text-norwegian-blue p-3"
            aria-label="Toggle menu"
          >
            <span className="text-sm font-semibold transition-opacity duration-200">
              {isMobileMenuOpen ? "Close" : "Menu"}
            </span>
            <div className="relative w-8 h-4 flex items-center justify-center">
              <span
                className={`absolute w-8 h-0.5 bg-norwegian-blue rounded-full transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? "rotate-45" : "rotate-0 -translate-y-1.5"
                }`}
              ></span>
              <span
                className={`absolute w-8 h-0.5 bg-norwegian-blue rounded-full transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? "-rotate-45" : "rotate-0 translate-y-1.5"
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 top-16 bg-white z-40 md:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6 space-y-4">
          {/* Language Switcher */}
          <div className="pb-4 border-b border-gray-200">
            <LanguageSwitcher />
          </div>

          {/* Sign In Link */}
          <Link
            href="/signIn"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 text-norwegian-blue hover:text-norwegian-blue-600 font-medium text-lg py-2 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {t("signIn")}
          </Link>

          {/* Sign Up Button */}
          <Link
            href="/signUp"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 text-norwegian-blue hover:text-norwegian-blue-600 font-medium text-lg py-2 transition-colors"
          >
            <FiUserPlus className="w-6 h-6" />
            {t("signUp")}
          </Link>

          {/* About Link */}
          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center text-norwegian-blue hover:text-norwegian-blue-600 font-medium text-lg py-2 transition-colors"
          >
            {t("about")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
