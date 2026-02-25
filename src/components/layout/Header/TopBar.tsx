'use client';

import { Phone, Mail } from 'lucide-react';
import { useLocale } from 'next-intl';
import { CONTACT } from '@/constants/contact';
import type { Locale } from '@/types';
import LanguageSwitcher from './LanguageSwitcher';

export default function TopBar() {
  const locale = useLocale() as Locale;
  const email = CONTACT.email[locale];

  return (
    <div className="hidden md:block bg-sand border-b border-sand/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10 text-sm">
          <div className="flex items-center gap-4 text-warm-gray">
            <a
              href={CONTACT.phoneHref}
              className="flex items-center gap-1.5 hover:text-charcoal transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{CONTACT.phone}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 hover:text-charcoal transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{email}</span>
            </a>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
