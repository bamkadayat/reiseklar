'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTransition } from 'react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(
        { pathname },
        { locale: newLocale }
      );
    });
  };

  return (
    <Tabs value={locale} onValueChange={handleLanguageChange}>
      <TabsList className="h-8 bg-muted/50 p-0.5">
        <TabsTrigger
          value="nb"
          disabled={isPending}
          className="text-xs font-semibold px-3 py-1 h-7 data-[state=active]:bg-background data-[state=active]:text-foreground disabled:opacity-50"
        >
          NO
        </TabsTrigger>
        <TabsTrigger
          value="en"
          disabled={isPending}
          className="text-xs font-semibold px-3 py-1 h-7 data-[state=active]:bg-background data-[state=active]:text-foreground disabled:opacity-50"
        >
          EN
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
