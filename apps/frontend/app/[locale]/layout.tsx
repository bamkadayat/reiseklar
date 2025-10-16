import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ConditionalNavbar } from '@/components/shared/navigation/ConditionalNavbar';
import { Footer } from '@/components/shared/layout/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { AppInitializer } from '@/components/AppInitializer';
import { locales } from '@/i18n';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ReduxProvider>
          <NextIntlClientProvider messages={messages}>
            <AppInitializer>
              <AuthProvider>
                <div className="flex flex-col min-h-screen">
                  <ConditionalNavbar />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
              </AuthProvider>
            </AppInitializer>
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
