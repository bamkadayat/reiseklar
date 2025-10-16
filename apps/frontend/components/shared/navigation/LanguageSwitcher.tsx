'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { locales } from '@/i18n';

export function LanguageSwitcher() {
  const t = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const languages = {
    en: { label: t('en'), flag: '🇬🇧' },
    nb: { label: t('nb'), flag: '🇳🇴' },
  };

  const handleLanguageChange = (newLocale: string) => {
    // Remove the current locale from the pathname
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, '');
    // Navigate to the new locale
    router.push(`/${newLocale}${pathnameWithoutLocale}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 text-norwegian-blue hover:bg-neutral-light rounded transition-colors outline-none">
        <span className="text-lg">{languages[locale as keyof typeof languages]?.flag || '🇳🇴'}</span>
        <span className="text-sm font-medium">{languages[locale as keyof typeof languages]?.label || 'Bokmål'}</span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
  <DropdownMenuContent align={isMobile ? 'start' : 'end'} sideOffset={6} className="w-44">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span className="text-lg">{languages[loc as keyof typeof languages]?.flag}</span>
            <span className="text-sm font-medium flex-1">{languages[loc as keyof typeof languages]?.label}</span>
            {locale === loc && <Check className="h-4 w-4 text-norwegian-blue" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
