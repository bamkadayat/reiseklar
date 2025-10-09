'use client';

import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Language = 'en' | 'no';

export function LanguageSwitcher() {
  const [language, setLanguage] = useState<Language>('no');

  const languages = {
    en: { label: 'English', flag: '🇬🇧' },
    no: { label: 'Bokmål', flag: '🇳🇴' },
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 text-norwegian-blue hover:bg-neutral-light rounded transition-colors outline-none">
        <span className="text-lg">{languages[language].flag}</span>
        <span className="text-sm font-medium">{languages[language].label}</span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {Object.entries(languages).map(([key, { label, flag }]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setLanguage(key as Language)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span className="text-lg">{flag}</span>
            <span className="text-sm font-medium flex-1">{label}</span>
            {language === key && <Check className="h-4 w-4 text-norwegian-blue" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
