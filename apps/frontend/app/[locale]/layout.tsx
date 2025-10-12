import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ConditionalNavbar } from '@/components/shared/navigation/ConditionalNavbar';
import { AuthProvider } from '@/contexts/AuthContext';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
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
    <html lang={locale}>
      <body>
        <ReduxProvider>
          <NextIntlClientProvider messages={messages}>
            <AuthProvider>
              <ConditionalNavbar />
              {children}
            </AuthProvider>
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
