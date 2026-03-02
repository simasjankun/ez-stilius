'use client';

import { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const t = useTranslations('cart');
  const { isDrawerOpen, closeDrawer, items, itemCount, subtotal, removeItem, updateItemQuantity, isLoading } =
    useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    },
    [closeDrawer],
  );

  useEffect(() => {
    if (isDrawerOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isDrawerOpen, handleKeyDown]);

  if (!mounted) return null;

  const drawer = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-cream shadow-xl flex flex-col transition-transform duration-300 ease-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-sand/50 flex-shrink-0">
          <h2 className="font-serif text-xl text-charcoal">
            {t('title')}
            {itemCount > 0 && (
              <span className="text-warm-gray font-sans text-base ml-1.5">({itemCount})</span>
            )}
          </h2>
          <button
            onClick={closeDrawer}
            className="cursor-pointer text-charcoal hover:text-olive transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <ShoppingBag className="h-16 w-16 text-sand mb-6" strokeWidth={1} />
            <h3 className="font-serif text-2xl text-charcoal mb-3">{t('empty.title')}</h3>
            <p className="text-warm-gray text-sm leading-relaxed max-w-xs mb-8">
              {t('empty.subtitle')}
            </p>
            <Link
              href="/shop"
              onClick={closeDrawer}
              className="inline-block cursor-pointer bg-olive text-cream px-8 py-3.5 rounded-sm text-sm tracking-widest uppercase font-medium hover:bg-olive-dark transition-colors duration-300"
            >
              {t('empty.cta')}
            </Link>
          </div>
        ) : (
          <>
            {/* Items — scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  {/* Thumbnail */}
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg shrink-0 bg-sand/30"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-sand/30 shrink-0 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-warm-gray/40" strokeWidth={1} />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-charcoal truncate">{item.title}</p>
                        {item.variant_title && (
                          <p className="text-xs text-warm-gray mt-0.5">{item.variant_title}</p>
                        )}
                        <p className="text-sm text-olive font-medium mt-1">
                          €{item.unit_price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={isLoading}
                        aria-label={t('remove')}
                        className="cursor-pointer shrink-0 text-warm-gray hover:text-olive transition-colors disabled:opacity-40"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1 mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          item.quantity <= 1
                            ? removeItem(item.id)
                            : updateItemQuantity(item.id, item.quantity - 1)
                        }
                        disabled={isLoading}
                        className="w-7 h-7 rounded border border-sand flex items-center justify-center text-xs text-charcoal hover:border-olive disabled:opacity-40 cursor-pointer transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-charcoal">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        disabled={isLoading}
                        className="w-7 h-7 rounded border border-sand flex items-center justify-center text-xs text-charcoal hover:border-olive disabled:opacity-40 cursor-pointer transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-sand/50 px-6 py-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-charcoal font-medium">{t('total')}:</span>
                <span className="text-charcoal font-serif text-xl">€{subtotal.toFixed(2)}</span>
              </div>
              <button
                type="button"
                onClick={() => alert(t('checkoutSoon'))}
                className="cursor-pointer w-full bg-olive text-cream py-3.5 rounded-sm text-sm tracking-widest uppercase font-medium hover:bg-olive-dark transition-colors duration-300"
              >
                {t('checkout')}
              </button>
              <button
                type="button"
                onClick={closeDrawer}
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
