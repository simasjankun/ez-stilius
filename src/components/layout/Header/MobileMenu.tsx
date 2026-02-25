'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations, useLocale } from 'next-intl';
import {
  Menu,
  X,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
  Phone,
  Mail,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useRouter, usePathname } from '@/i18n/routing';
import { CONTACT } from '@/constants/contact';
import type { Locale } from '@/types';

const CATEGORY_SLUGS = [
  'clothing',
  'sewing-supplies',
  'accessories',
  'interior-gifts',
] as const;

const NAV_ITEMS = ['home', 'shop', 'about', 'contacts'] as const;
const NAV_HREFS: Record<string, string> = {
  home: '/',
  shop: '/shop',
  about: '/about',
  contacts: '/contacts',
};

function MobileFooter({ locale }: { locale: Locale }) {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div
      className="flex-shrink-0 border-t border-sand/50 px-6 pt-6 space-y-5"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 2rem), 2rem)' }}
    >
      <div className="flex flex-col items-center gap-1.5 text-sm text-warm-gray">
        <a
          href={CONTACT.phoneHref}
          className="flex items-center gap-2 hover:text-charcoal transition-colors"
        >
          <Phone className="h-3.5 w-3.5" />
          {CONTACT.phone}
        </a>
        <a
          href={`mailto:${CONTACT.email[locale]}`}
          className="flex items-center gap-2 hover:text-charcoal transition-colors"
        >
          <Mail className="h-3.5 w-3.5" />
          {CONTACT.email[locale]}
        </a>
      </div>
      <div className="flex items-center justify-center gap-3 text-sm">
        <button
          onClick={() => switchLocale('lt')}
          className={`cursor-pointer transition-colors ${
            currentLocale === 'lt'
              ? 'text-olive font-semibold'
              : 'text-warm-gray hover:text-charcoal'
          }`}
        >
          LT
        </button>
        <span className="text-sand">·</span>
        <button
          onClick={() => switchLocale('en')}
          className={`cursor-pointer transition-colors ${
            currentLocale === 'en'
              ? 'text-olive font-semibold'
              : 'text-warm-gray hover:text-charcoal'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
}

export default function MobileMenu() {
  const t = useTranslations('header');
  const tc = useTranslations('categories');
  const locale = useLocale() as Locale;
  const [isOpen, setIsOpen] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setShowShop(false);
      setAnimateItems(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => setAnimateItems(true), 50);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const overlay = (
    <div
      className={`fixed inset-0 z-50 bg-cream md:hidden transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ width: '100vw', height: '100dvh' }}
    >
      <div className="relative w-full h-full overflow-hidden">
        {/* ═══ PANEL 1: Main Navigation ═══ */}
        <div
          className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-out ${
            showShop ? '-translate-x-full' : 'translate-x-0'
          }`}
        >
          {/* Zone 1: Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sand/50 flex-shrink-0">
            <Link href="/" onClick={close} className="flex-shrink-0">
              <span className="font-serif text-xl text-charcoal tracking-wide">
                EŽ Stilius
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/cart"
                onClick={close}
                className="relative cursor-pointer text-charcoal p-1"
                aria-label={t('cart')}
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-olive text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  0
                </span>
              </Link>
              <button
                onClick={close}
                aria-label={t('closeMenu')}
                className="cursor-pointer text-charcoal p-1"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Zone 2: Navigation */}
          <div className="flex-1 flex items-center justify-center">
            <nav>
              <ul className="flex flex-col items-center gap-6">
                {NAV_ITEMS.map((key, i) => (
                  <li
                    key={key}
                    className="transition-all duration-500 ease-out"
                    style={{
                      opacity: animateItems ? 1 : 0,
                      transform: animateItems
                        ? 'translateY(0)'
                        : 'translateY(12px)',
                      transitionDelay: `${i * 60}ms`,
                    }}
                  >
                    {key === 'shop' ? (
                      <button
                        onClick={() => setShowShop(true)}
                        className="cursor-pointer flex items-center gap-2.5 text-charcoal active:text-olive transition-colors"
                      >
                        <span className="font-serif text-2xl tracking-wide">
                          {t(key)}
                        </span>
                        <ChevronRight className="h-4.5 w-4.5 text-warm-gray" />
                      </button>
                    ) : (
                      <Link
                        href={NAV_HREFS[key]}
                        onClick={close}
                        className="block font-serif text-2xl text-charcoal tracking-wide active:text-olive transition-colors"
                      >
                        {t(key)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Zone 3: Footer */}
          <MobileFooter locale={locale} />
        </div>

        {/* ═══ PANEL 2: Shop Categories ═══ */}
        <div
          className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-out ${
            showShop ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Zone 1: Header with Back */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sand/50 flex-shrink-0">
            <button
              onClick={() => setShowShop(false)}
              className="cursor-pointer flex items-center gap-1.5 text-charcoal"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm font-medium">{t('back')}</span>
            </button>
            <div className="flex items-center gap-3">
              <Link
                href="/cart"
                onClick={close}
                className="relative cursor-pointer text-charcoal p-1"
                aria-label={t('cart')}
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-olive text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  0
                </span>
              </Link>
              <button
                onClick={close}
                aria-label={t('closeMenu')}
                className="cursor-pointer text-charcoal p-1"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Zone 2: Categories */}
          <div className="flex-1 flex items-center justify-center">
            <nav>
              <ul className="flex flex-col items-center gap-6">
                {CATEGORY_SLUGS.map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`/shop/${slug}`}
                      onClick={close}
                      className="block font-serif text-2xl text-charcoal tracking-wide active:text-olive transition-colors text-center"
                    >
                      {tc(`${slug}.label`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Zone 3: Footer */}
          <MobileFooter locale={locale} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex md:hidden items-center justify-between w-full">
      <Link href="/" className="flex-shrink-0">
        <span className="font-serif text-xl text-charcoal tracking-wide">
          EŽ Stilius
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <Link
          href="/cart"
          className="relative cursor-pointer text-charcoal hover:text-olive transition-colors p-1"
          aria-label={t('cart')}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-olive text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
            0
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? t('closeMenu') : t('openMenu')}
          className="cursor-pointer text-charcoal p-1"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mounted && createPortal(overlay, document.body)}
    </div>
  );
}
