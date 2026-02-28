'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Search, ShoppingBag } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useCart } from '@/context/CartContext';
import MegaMenu from './MegaMenu';
import SearchOverlay from './SearchOverlay';
import type { MedusaCategory } from '@/lib/categories';

interface NavigationProps {
  categories: MedusaCategory[];
}

export default function Navigation({ categories }: NavigationProps) {
  const t = useTranslations('header');
  const { openCart, cartCount } = useCart();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
    <div
      className="hidden md:flex items-center justify-between w-full relative"
      onMouseLeave={closeMenu}
    >
      <Link href="/" className="flex-shrink-0">
        <span className="font-serif text-2xl text-charcoal tracking-wide">
          EŽ Stilius
        </span>
      </Link>

      <nav>
        <ul className="flex items-center gap-8">
          {navItems.map((item) =>
            item.hasMegaMenu ? (
              <li key={item.href} onMouseEnter={openMenu}>
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
              </li>
            ) : (
              <li key={item.href} onMouseEnter={closeMenu}>
                <Link
                  href={item.href}
                  className="block py-5 text-charcoal hover:text-olive transition-colors text-sm font-medium tracking-wide uppercase"
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>

      <div
        className="flex items-center gap-4"
        onMouseEnter={closeMenu}
      >
        <button
          onClick={() => setSearchOpen(true)}
          aria-label={t('search')}
          className="cursor-pointer text-charcoal hover:text-olive transition-colors p-1"
        >
          <Search className="h-5 w-5" />
        </button>
        <button
          onClick={openCart}
          className="relative cursor-pointer text-charcoal hover:text-olive transition-colors p-1"
          aria-label={t('cart')}
        >
          <ShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-olive text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* MegaMenu lives here — positioned relative to this full-width container */}
      <MegaMenu
        isOpen={megaMenuOpen}
        categories={categories}
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
      />

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
