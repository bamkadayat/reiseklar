import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/header/Navbar';

export const metadata: Metadata = {
  title: 'Reiseklar - Smart Commute Planner for Norway',
  description: 'Plan your daily commute with real-time transit data and weather insights',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
