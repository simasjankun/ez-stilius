'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import { CONTACT } from '@/constants/contact';

export default function ContactInfo() {
  const t = useTranslations('contacts');
  const locale = useLocale();
  const email = CONTACT.email[locale as 'lt' | 'en'] ?? CONTACT.email.lt;

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-olive mb-6">{t('getInTouch')}</p>

      {/* Contact details */}
      <div className="space-y-4">
        <a href={CONTACT.phoneHref} className="flex items-start gap-3 group">
          <Phone className="w-5 h-5 text-olive shrink-0 mt-0.5" strokeWidth={1.5} />
          <span className="text-base text-charcoal group-hover:text-olive transition-colors duration-150">
            {CONTACT.phone}
          </span>
        </a>

        <a href={`mailto:${email}`} className="flex items-start gap-3 group">
          <Mail className="w-5 h-5 text-olive shrink-0 mt-0.5" strokeWidth={1.5} />
          <span className="text-base text-charcoal group-hover:text-olive transition-colors duration-150">
            {email}
          </span>
        </a>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-olive shrink-0 mt-0.5" strokeWidth={1.5} />
          <span className="text-base text-charcoal">{CONTACT.address}</span>
        </div>
      </div>

      {/* Working hours */}
      <p className="text-xs uppercase tracking-widest text-olive mt-8 mb-3">
        {t('workingHours.title')}
      </p>
      <div className="space-y-2">
        <div className="flex justify-between text-sm gap-4">
          <span className="text-warm-gray">{t('workingHours.weekdays')}</span>
          <span className="text-charcoal shrink-0">{CONTACT.workingHours.weekdays}</span>
        </div>
        <div className="flex justify-between text-sm gap-4">
          <span className="text-warm-gray">{t('workingHours.saturday')}</span>
          <span className="text-charcoal shrink-0">{CONTACT.workingHours.saturday}</span>
        </div>
        <div className="flex justify-between text-sm gap-4">
          <span className="text-warm-gray">{t('workingHours.sunday')}</span>
          <span className="text-warm-gray italic">{t('workingHours.closed')}</span>
        </div>
      </div>

      {/* Company details */}
      <p className="text-xs uppercase tracking-widest text-olive mt-8 mb-3">
        {t('company.title')}
      </p>
      <div className="space-y-1.5 text-sm text-warm-gray">
        <p>{CONTACT.company.name}</p>
        <p>
          {t('company.companyCode')}: {CONTACT.company.companyCode}
        </p>
        <p>
          {t('company.vatCode')}: {CONTACT.company.vatCode}
        </p>
      </div>

      {/* Social links */}
      <p className="text-xs uppercase tracking-widest text-olive mt-8 mb-3">{t('social')}</p>
      <div className="flex gap-4">
        <a
          href={CONTACT.social.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="text-warm-gray hover:text-olive transition-colors duration-150"
          aria-label="Facebook"
        >
          <Facebook className="w-5 h-5" strokeWidth={1.5} />
        </a>
        <a
          href={CONTACT.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-warm-gray hover:text-olive transition-colors duration-150"
          aria-label="Instagram"
        >
          <Instagram className="w-5 h-5" strokeWidth={1.5} />
        </a>
        <a
          href={CONTACT.social.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className="text-warm-gray hover:text-olive transition-colors duration-150"
          aria-label="TikTok"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.15a8.14 8.14 0 004.77 1.52V7.22a4.85 4.85 0 01-1-.53z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
