'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme | null;
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>('system');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  // Check if current page is a dashboard page
  const isDashboardPage = pathname?.includes('/user') || pathname?.includes('/admin');

  useEffect(() => {
    // Priority: initialTheme (from user db) > localStorage > 'system' (default)
    if (initialTheme && ['light', 'dark', 'system'].includes(initialTheme)) {
      setTheme(initialTheme);
    } else {
      const storedTheme = localStorage.getItem('dashboard-theme') as Theme;
      if (storedTheme) {
        setTheme(storedTheme);
      }
    }
  }, [initialTheme]);

  useEffect(() => {
    const root = document.documentElement;

    // Only apply theme on dashboard pages
    if (!isDashboardPage) {
      // Always use light mode on public pages
      root.classList.remove('dark');
      setEffectiveTheme('light');
      return;
    }

    // Determine the effective theme for dashboard pages
    let newEffectiveTheme: 'light' | 'dark' = 'light';

    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      newEffectiveTheme = systemPrefersDark ? 'dark' : 'light';
    } else {
      newEffectiveTheme = theme;
    }

    setEffectiveTheme(newEffectiveTheme);

    // Apply or remove dark class
    if (newEffectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save to localStorage
    localStorage.setItem('dashboard-theme', theme);
  }, [theme, isDashboardPage]);

  // Listen for system theme changes (only on dashboard pages)
  useEffect(() => {
    if (theme === 'system' && isDashboardPage) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e: MediaQueryListEvent) => {
        const root = document.documentElement;
        if (e.matches) {
          root.classList.add('dark');
          setEffectiveTheme('dark');
        } else {
          root.classList.remove('dark');
          setEffectiveTheme('light');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, isDashboardPage]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
