'use client';

import { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const t = useTranslations('cart');
  const { isCartOpen, closeCart, cartItems, cartCount } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    },
    [closeCart]
  );

  useEffect(() => {
    if (isCartOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isCartOpen, handleKeyDown]);

  if (!mounted) return null;

  const drawer = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-cream shadow-xl flex flex-col transition-transform duration-300 ease-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-sand/50 flex-shrink-0">
          <h2 className="font-serif text-xl text-charcoal">
            {t('title')}
            {cartCount > 0 && (
              <span className="text-warm-gray font-sans text-base ml-1.5">
                ({cartCount})
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="cursor-pointer text-charcoal hover:text-olive transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <ShoppingBag className="h-16 w-16 text-sand mb-6" strokeWidth={1} />
            <h3 className="font-serif text-2xl text-charcoal mb-3">
              {t('empty.title')}
            </h3>
            <p className="text-warm-gray text-sm leading-relaxed max-w-xs mb-8">
              {t('empty.subtitle')}
            </p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="inline-block cursor-pointer bg-olive text-cream px-8 py-3.5 rounded-sm text-sm tracking-widest uppercase font-medium hover:bg-olive-dark transition-colors duration-300"
            >
              {t('empty.cta')}
            </Link>
          </div>
        ) : (
          <>
            {/* Cart items - scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Items will be rendered here when Medusa is integrated */}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-sand/50 px-6 py-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-charcoal font-medium">{t('total')}:</span>
                <span className="text-charcoal font-serif text-xl">€0.00</span>
              </div>
              <button className="cursor-pointer w-full bg-olive text-cream py-3.5 rounded-sm text-sm tracking-widest uppercase font-medium hover:bg-olive-dark transition-colors duration-300">
                {t('checkout')}
              </button>
              <button
                onClick={closeCart}
                className="cursor-pointer w-full text-center text-sm text-warm-gray hover:text-olive transition-colors"
              >
                {t('continueShopping')}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );

  return createPortal(drawer, document.body);
}
