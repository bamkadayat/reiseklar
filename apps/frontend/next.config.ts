import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@reiseklar/shared'],

  // Environment variables available in the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  },

  // Image optimization
  images: {
    domains: ['api.reiseklar.dev'],
  },

  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['leaflet', 'date-fns'],
  },
};

export default withNextIntl(nextConfig);
