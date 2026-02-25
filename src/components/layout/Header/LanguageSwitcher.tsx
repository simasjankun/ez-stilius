'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import type { Locale } from '@/types';

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        onClick={() => switchLocale('lt')}
        className={`px-1.5 py-0.5 cursor-pointer transition-colors ${
          locale === 'lt'
            ? 'text-charcoal font-semibold'
            : 'text-warm-gray hover:text-charcoal'
        }`}
      >
        LT
      </button>
      <span className="text-warm-gray">|</span>
      <button
        onClick={() => switchLocale('en')}
        className={`px-1.5 py-0.5 cursor-pointer transition-colors ${
          locale === 'en'
            ? 'text-charcoal font-semibold'
            : 'text-warm-gray hover:text-charcoal'
        }`}
      >
        EN
      </button>
    </div>
  );
}
