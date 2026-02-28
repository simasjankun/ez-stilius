'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations, useLocale } from 'next-intl';
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  Plus,
  Minus,
  Phone,
  Mail,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import SearchOverlay from './SearchOverlay';
import { useRouter, usePathname } from '@/i18n/routing';
import { useCart } from '@/context/CartContext';
import { CONTACT } from '@/constants/contact';
import type { Locale } from '@/types';
import type { MedusaCategory } from '@/lib/categories';

interface MobileMenuProps {
  categories: MedusaCategory[];
}

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

function CartButton({ onClick, label }: { onClick: () => void; label: string }) {
  const { cartCount } = useCart();

  return (
    <button
      onClick={onClick}
      className="relative cursor-pointer text-charcoal p-1"
      aria-label={label}
    >
      <ShoppingBag className="h-5 w-5" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-olive text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
          {cartCount}
        </span>
      )}
    </button>
  );
}

function AccordionRow({
  trigger,
  isOpen,
  onToggle,
  children,
}: {
  trigger: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        {trigger}
        <button
          onClick={onToggle}
          className="cursor-pointer p-2 text-warm-gray hover:text-charcoal transition-colors flex-shrink-0"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <Minus className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </button>
      </div>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export default function MobileMenu({ categories }: MobileMenuProps) {
  const t = useTranslations('header');
  const locale = useLocale() as Locale;
  const { openCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setShopOpen(false);
      setOpenCategory(null);
      setAnimateItems(false);
    }, 300);
  }, []);

  function handleCartClick() {
    close();
    setTimeout(() => openCart(), 350);
  }

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
      className={`fixed inset-0 z-50 bg-cream md:hidden transition-transform duration-300 ease-out flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ width: '100vw', height: '100dvh' }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sand/50 flex-shrink-0">
        <Link href="/" onClick={close} className="flex-shrink-0">
          <span className="font-serif text-xl text-charcoal tracking-wide">
            EŽ Stilius
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <CartButton onClick={handleCartClick} label={t('cart')} />
          <button
            onClick={close}
            aria-label={t('closeMenu')}
            className="cursor-pointer text-charcoal p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Scrollable nav content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <nav>
          <ul className="space-y-0">
            {/* Home */}
            <li
              className="transition-all duration-500 ease-out"
              style={{
                opacity: animateItems ? 1 : 0,
                transform: animateItems ? 'translateY(0)' : 'translateY(12px)',
                transitionDelay: '0ms',
              }}
            >
              <Link
                href="/"
                onClick={close}
                className="block font-serif text-2xl text-charcoal tracking-wide active:text-olive transition-colors py-3"
              >
                {t('home')}
              </Link>
            </li>

            {/* Shop — accordion */}
            <li
              className="transition-all duration-500 ease-out"
              style={{
                opacity: animateItems ? 1 : 0,
                transform: animateItems ? 'translateY(0)' : 'translateY(12px)',
                transitionDelay: '60ms',
              }}
            >
              <AccordionRow
                trigger={
                  <Link
                    href="/shop"
                    onClick={close}
                    className="font-serif text-2xl text-charcoal tracking-wide active:text-olive transition-colors py-3 block flex-1"
                  >
                    {t('shop')}
                  </Link>
                }
                isOpen={shopOpen}
                onToggle={() => setShopOpen((v) => !v)}
              >
                <div className="pl-2 pb-4 pt-1 space-y-0.5">
                  {/* Root categories */}
                  {categories.map((cat) =>
                    cat.category_children && cat.category_children.length > 0 ? (
                      <AccordionRow
                        key={cat.handle}
                        trigger={
                          <Link
                            href={`/shop/${cat.handle}`}
                            onClick={close}
                            className="text-lg text-charcoal active:text-olive transition-colors py-2 block flex-1"
                          >
                            {cat.name}
                          </Link>
                        }
                        isOpen={openCategory === cat.handle}
                        onToggle={() =>
                          setOpenCategory((prev) =>
                            prev === cat.handle ? null : cat.handle,
                          )
                        }
                      >
                        <div className="pl-4 pb-2 pt-1 space-y-0.5">
                          {cat.category_children.map((child) => (
                            <Link
                              key={child.handle}
                              href={`/shop/${cat.handle}/${child.handle}`}
                              onClick={close}
                              className="block text-base text-warm-gray hover:text-olive py-1.5 transition-colors"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </AccordionRow>
                    ) : (
                      <div key={cat.handle} className="py-2">
                        <Link
                          href={`/shop/${cat.handle}`}
                          onClick={close}
                          className="text-lg text-charcoal active:text-olive transition-colors"
                        >
                          {cat.name}
                        </Link>
                      </div>
                    ),
                  )}
                </div>
              </AccordionRow>
            </li>

            {/* About */}
            <li
              className="transition-all duration-500 ease-out"
              style={{
                opacity: animateItems ? 1 : 0,
                transform: animateItems ? 'translateY(0)' : 'translateY(12px)',
                transitionDelay: '120ms',
              }}
            >
              <Link
                href="/about"
                onClick={close}
                className="block font-serif text-2xl text-charcoal tracking-wide active:text-olive transition-colors py-3"
              >
                {t('about')}
              </Link>
            </li>

            {/* Contacts */}
            <li
              className="transition-all duration-500 ease-out"
              style={{
                opacity: animateItems ? 1 : 0,
                transform: animateItems ? 'translateY(0)' : 'translateY(12px)',
                transitionDelay: '180ms',
              }}
            >
              <Link
                href="/contacts"
                onClick={close}
                className="block font-serif text-2xl text-charcoal tracking-wide active:text-olive transition-colors py-3"
              >
                {t('contacts')}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Sticky footer */}
      <MobileFooter locale={locale} />
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
        <button
          onClick={() => setSearchOpen(true)}
          aria-label={t('search')}
          className="cursor-pointer text-charcoal hover:text-olive transition-colors p-1"
        >
          <Search className="h-5 w-5" />
        </button>
        <CartButton onClick={openCart} label={t('cart')} />
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? t('closeMenu') : t('openMenu')}
          className="cursor-pointer text-charcoal p-1"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mounted && createPortal(overlay, document.body)}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
