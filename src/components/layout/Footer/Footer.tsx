'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Facebook, Instagram } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { CONTACT } from '@/constants/contact';
import type { Locale } from '@/types';

const CATEGORY_LINKS = [
  { slug: 'clothing', key: 'clothing' },
  { slug: 'sewing-supplies', key: 'sewing-supplies' },
  { slug: 'accessories', key: 'accessories' },
  { slug: 'interior-gifts', key: 'interior-gifts' },
] as const;

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

export default function Footer() {
  const t = useTranslations('footer');
  const th = useTranslations('header');
  const tc = useTranslations('categories');
  const locale = useLocale() as Locale;
  const email = CONTACT.email[locale];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="border-t border-olive/20 pt-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {/* Column 1 — Brand */}
          <div className="text-center md:text-left">
            <Link href="/">
              <span className="font-serif text-2xl text-cream tracking-wide">
                EŽ Stilius
              </span>
            </Link>
            <p className="text-[#A09A90] text-sm mt-3">
              {t('tagline')}
            </p>
            <div className="flex items-center gap-4 mt-6 justify-center md:justify-start">
              <a
                href={CONTACT.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-[#A09A90] hover:text-olive transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={CONTACT.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-[#A09A90] hover:text-olive transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={CONTACT.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-[#A09A90] hover:text-olive transition-colors"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2 — Navigation */}
          <div>
            <h3 className="text-cream text-sm uppercase tracking-widest font-semibold mb-4">
              {t('navigation')}
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: th('home'), href: '/' },
                { label: th('shop'), href: '/shop' },
                { label: th('about'), href: '/about' },
                { label: th('contacts'), href: '/contacts' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[#A09A90] text-sm hover:text-olive transition-colors leading-relaxed"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Categories */}
          <div>
            <h3 className="text-cream text-sm uppercase tracking-widest font-semibold mb-4">
              {t('categories')}
            </h3>
            <ul className="space-y-2.5">
              {CATEGORY_LINKS.map(({ slug, key }) => (
                <li key={slug}>
                  <Link
                    href={`/shop/${slug}`}
                    className="text-[#A09A90] text-sm hover:text-olive transition-colors leading-relaxed"
                  >
                    {tc(`${key}.label`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contacts */}
          <div>
            <h3 className="text-cream text-sm uppercase tracking-widest font-semibold mb-4">
              {t('contacts')}
            </h3>
            <div className="space-y-2.5 text-sm text-[#A09A90]">
              <p className="leading-relaxed">{CONTACT.address}</p>
              <a
                href={CONTACT.phoneHref}
                className="block hover:text-olive transition-colors"
              >
                {CONTACT.phone}
              </a>
              <a
                href={`mailto:${email}`}
                className="block hover:text-olive transition-colors"
              >
                {email}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-sand/15 mt-12 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0 text-xs text-[#A09A90]">
            <span>&copy; {year} EŽ Stilius. {t('copyright')}</span>
            <span className="hidden md:inline md:mx-3">·</span>
            <div className="flex items-center gap-3">
              <Link href="/privacy" className="hover:text-olive transition-colors">
                {t('privacy')}
              </Link>
              <span>·</span>
              <Link href="/terms" className="hover:text-olive transition-colors">
                {t('terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
