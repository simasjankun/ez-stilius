'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Search, ShoppingBag } from 'lucide-react';
import { Link } from '@/i18n/routing';
import MegaMenu from './MegaMenu';

export default function Navigation() {
  const t = useTranslations('header');
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navItems = [
    { label: t('home'), href: '/' },
    { label: t('shop'), href: '/shop', hasMegaMenu: true },
    { label: t('about'), href: '/about' },
    { label: t('contacts'), href: '/contacts' },
  ];

  const openMenu = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMegaMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    timeoutRef.current = setTimeout(() => setMegaMenuOpen(false), 200);
  }, []);

  return (
    <div className="hidden md:flex items-center justify-between w-full">
      <Link href="/" className="flex-shrink-0">
        <span className="font-serif text-2xl text-charcoal tracking-wide">
          EŽ Stilius
        </span>
      </Link>

      <nav>
        <ul className="flex items-center gap-8">
          {navItems.map((item) =>
            item.hasMegaMenu ? (
              <li
                key={item.href}
                className="relative"
                onMouseEnter={openMenu}
                onMouseLeave={closeMenu}
              >
                <Link
                  href={item.href}
                  className={`block py-5 text-sm font-medium tracking-wide uppercase transition-colors ${
                    megaMenuOpen
                      ? 'text-olive'
                      : 'text-charcoal hover:text-olive'
                  }`}
                >
                  {item.label}
                </Link>
                <MegaMenu isOpen={megaMenuOpen} />
              </li>
            ) : (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-5 text-charcoal hover:text-olive transition-colors text-sm font-medium tracking-wide uppercase"
                >
                  {item.label}
                </Link>
              </li>
            )
          )}
        </ul>
      </nav>

      <div className="flex items-center gap-4">
        <button
          aria-label={t('search')}
          className="cursor-pointer text-charcoal hover:text-olive transition-colors p-1"
        >
          <Search className="h-5 w-5" />
        </button>
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
      </div>
    </div>
  );
}
