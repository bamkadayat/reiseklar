import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#012B6A',
};

export const metadata: Metadata = {
  title: {
    default: 'Reiseklar - Smart Commute Planner for Norway',
    template: '%s | Reiseklar',
  },
  description: 'Plan your daily commute with real-time transit data, weather insights, and news updates. Your smart travel companion for Norway.',
  keywords: ['travel', 'commute', 'transit', 'weather', 'norway', 'reiseklar', 'journey planner', 'public transport'],
  authors: [{ name: 'Reiseklar Team' }],
  creator: 'Reiseklar',
  publisher: 'Reiseklar',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['nb_NO'],
    url: '/',
    title: 'Reiseklar - Smart Commute Planner for Norway',
    description: 'Plan your daily commute with real-time transit data, weather insights, and news updates.',
    siteName: 'Reiseklar',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reiseklar - Smart Commute Planner for Norway',
    description: 'Plan your daily commute with real-time transit data, weather insights, and news updates.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
