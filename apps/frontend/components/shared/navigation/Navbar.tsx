"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useState, useEffect } from "react";
import { BiLogIn, BiUserPlus } from "react-icons/bi";
import { LogOut, User, X } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const t = useTranslations("nav");
  const { logout } = useAuth();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setIsMobileMenuOpen(false);
      router.push('/signIn');
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
  <nav className="sticky top-0 z-40 bg-white backdrop-blur-sm bg-opacity-95 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 py-2 group">
            <div className="relative">
              <Image
                src="/images/logo.webp"
                alt="Reiseklar Logo"
                width={40}
                height={50}
                loading="eager"
                className="object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="text-2xl md:text-3xl font-bold text-norwegian-blue transition-all duration-300 group-hover:tracking-wide">
              Reise<span className="text-klar-red">klar</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language Switcher */}
            <div className="mr-2">
              <LanguageSwitcher />
            </div>

            {/* About Link */}
            <Link
              href="/about"
              className="text-norwegian-blue hover:text-norwegian-blue-600 font-medium text-base px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              {t("about")}
            </Link>

            {isAuthenticated ? (
              <>
                {/* User Profile */}
                <Link
                  href="/user"
                  className="flex items-center gap-2 text-norwegian-blue hover:text-norwegian-blue-600 font-medium text-base px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 font-medium text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  <LogOut className={`w-5 h-5 ${isLoggingOut ? 'animate-pulse' : ''}`} />
                  <span className="hidden lg:inline">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                </button>
              </>
            ) : (
              <>
                {/* Sign In Link */}
                <Link
                  href="/signIn"
                  className="flex items-center gap-2 text-norwegian-blue hover:text-norwegian-blue-600 font-medium text-base px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <BiLogIn className="w-5 h-5" />
                  <span className="hidden lg:inline">{t("login")}</span>
                </Link>

                {/* Sign Up Button */}
                <Link
                  href="/signUp"
                  className="flex items-center gap-2 text-norwegian-blue px-4 py-2 rounded-lg hover:bg-neutral-light font-medium text-base transition-all duration-200 border border-norwegian-blue/20 hover:border-norwegian-blue/40 shadow-sm hover:shadow-md"
                >
                  <BiUserPlus className="w-5 h-5" />
                  <span className="hidden lg:inline">{t("register")}</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col items-center gap-1.5 text-norwegian-blue p-3 hover:bg-gray-50 rounded-lg transition-all duration-200"
            aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
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
    </nav>

    {/* Backdrop & Mobile Menu moved outside <nav> to escape stacking context */}
    {/* Mobile Menu Backdrop */}
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 ${
        isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setIsMobileMenuOpen(false)}
      aria-hidden="true"
    />

    {/* Mobile Menu Overlay */}
    <div
      id="mobile-menu"
      className={`fixed right-0 top-0 bottom-0 w-96 max-w-[90vw] bg-white z-[60] md:hidden transition-transform duration-300 ease-in-out shadow-2xl border-l border-gray-100 ${
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-menu-title"
    >
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Menu Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex-shrink-0 flex items-center justify-between">
          <h3 id="mobile-menu-title" className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Menu</h3>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-norwegian-blue/50 transition"
            aria-label="Close mobile menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-4 py-6 space-y-1">
          {/* Language Switcher */}
            <div className="mb-6 px-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Language</p>
              <LanguageSwitcher />
            </div>

            {/* Navigation Section */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Navigation</p>

              {/* About Link */}
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center text-norwegian-blue hover:text-norwegian-blue-600 font-medium text-base px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 active:scale-95"
              >
                {t("about")}
              </Link>
            </div>

            {/* Account Section */}
            <div className="pt-6 space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Account</p>

              {isAuthenticated ? (
                <>
                  {/* User Profile */}
                  <Link
                    href="/user"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-norwegian-blue hover:text-norwegian-blue-600 font-medium text-base px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 active:scale-95"
                  >
                    <User className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-3 text-red-600 hover:text-red-700 font-medium text-base px-4 py-3 rounded-xl hover:bg-red-50 transition-all duration-200 disabled:opacity-50 w-full text-left active:scale-95"
                  >
                    <LogOut className={`w-5 h-5 ${isLoggingOut ? 'animate-pulse' : ''}`} />
                    <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Sign In Link */}
                  <Link
                    href="/signIn"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-norwegian-blue hover:text-norwegian-blue-600 font-medium text-base px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 active:scale-95"
                  >
                    <BiLogIn className="w-5 h-5" />
                    <span>{t("signIn")}</span>
                  </Link>

                  {/* Sign Up Button */}
                  <Link
                    href="/signUp"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 text-white bg-norwegian-blue hover:bg-norwegian-blue-600 font-medium text-base px-4 py-3 rounded-xl transition-all duration-200 mt-4 shadow-md hover:shadow-lg active:scale-95"
                  >
                    <BiUserPlus className="w-5 h-5" />
                    <span>{t("signUp")}</span>
                  </Link>
                </>
              )}
            </div>
        </div>
      </div>
    </div>
    </>
  );
}
