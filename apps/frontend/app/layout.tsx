import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reiseklar - Smart Commute Planner for Norway',
  description: 'Plan your daily commute with real-time transit data and weather insights',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
