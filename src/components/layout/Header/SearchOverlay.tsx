'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Package, Loader2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

const MEDUSA_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://api.ezstilius.lt';
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

// ── Debounce hook ────────────────────────────────────────────────────────────
function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ── Types ────────────────────────────────────────────────────────────────────
interface MedusaProduct {
  id: string;
  title: string;
  handle: string;
  thumbnail: string | null;
  images: { url: string }[];
  variants: {
    calculated_price?: { calculated_amount: number; currency_code: string };
    prices: { amount: number; currency_code: string }[];
  }[];
  categories: { name: string; handle: string }[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function getProductPrice(product: MedusaProduct): string | null {
  const variant = product.variants?.[0];
  if (!variant) return null;

  // calculated_price is available when region_id is passed to the API
  if (variant.calculated_price?.calculated_amount != null) {
    return `€${Number(variant.calculated_price.calculated_amount).toFixed(2)}`;
  }

  // Fallback: prices array — Medusa v2 stores values in major units (25 = €25.00)
  const price =
    variant.prices?.find((p) => p.currency_code === 'eur') ||
    variant.prices?.[0];
  if (price) {
    return `€${Number(price.amount).toFixed(2)}`;
  }

  return null;
}

function getImageUrl(product: MedusaProduct): string | null {
  return product.thumbnail || product.images?.[0]?.url || null;
}

// ── Component ────────────────────────────────────────────────────────────────
interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const t = useTranslations('search');
  const locale = useLocale();
  const medusaLocale = locale === 'lt' ? 'lt-LT' : 'en-GB';

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MedusaProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [regionId, setRegionId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Two refs: desktop input is display:none on mobile and vice versa.
  // Calling focus() on both is safe — browsers ignore display:none elements.
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const popularSearches = t.raw('popularSearches') as string[];
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch region_id once on mount (needed for calculated prices)
  useEffect(() => {
    fetch(`${MEDUSA_URL}/store/regions`, {
      headers: { 'x-publishable-api-key': API_KEY },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.regions?.[0]?.id) setRegionId(data.regions[0].id);
      })
      .catch((e) => console.error('Failed to fetch region:', e));
  }, []);

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setTotalCount(0);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setIsLoading(true);
    setHasError(false);

    const params = new URLSearchParams({ q: debouncedQuery, limit: '6' });
    if (regionId) params.set('region_id', regionId);
    params.set('locale', medusaLocale);

    fetch(`${MEDUSA_URL}/store/products?${params}`, {
      headers: {
        'x-publishable-api-key': API_KEY,
        'Content-Type': 'application/json',
        'x-medusa-locale': medusaLocale,
      },
      signal: abortRef.current.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((data) => {
        setResults(data.products || []);
        setTotalCount(data.count || 0);
        setIsLoading(false);
      })
      .catch((e) => {
        if (e.name === 'AbortError') return;
        console.error('Search error:', e);
        setHasError(true);
        setIsLoading(false);
      });
  }, [debouncedQuery, regionId, medusaLocale]);

  // Open / close effects
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus whichever input is visible. Browsers ignore focus() on display:none.
      setTimeout(() => {
        desktopInputRef.current?.focus();
        mobileInputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
      setTotalCount(0);
      setIsLoading(false);
      setHasError(false);
      abortRef.current?.abort();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  function handlePopularClick(term: string) {
    setQuery(term);
    desktopInputRef.current?.focus();
    mobileInputRef.current?.focus();
  }

  // ── Content area (plain function call, NOT a React component).
  // This prevents React from creating a component boundary here, which would
  // cause remounting and input focus loss on every state change.
  function contentArea() {
    if (isLoading) {
      return (
        <div className="flex items-center gap-3 py-8 text-warm-gray">
          <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
          <span className="text-sm">{t('searching')}</span>
        </div>
      );
    }

    if (hasError) {
      return (
        <p className="text-sm text-warm-gray py-8 text-center">{t('error')}</p>
      );
    }

    if (debouncedQuery.length >= 2 && results.length === 0) {
      return (
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-2 py-6">
            <Search className="h-8 w-8 text-sand" />
            <p className="text-sm font-medium text-charcoal">{t('noResults')}</p>
            <p className="text-xs text-warm-gray">{t('noResultsHint')}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-warm-gray mb-3">
              {t('popular')}
            </p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handlePopularClick(term)}
                  className="cursor-pointer px-4 py-2 bg-sand/60 text-charcoal text-sm rounded-full hover:bg-sand transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (results.length > 0) {
      return (
        <div>
          <ul className="divide-y divide-sand/40">
            {results.map((product) => {
              const imageUrl = getImageUrl(product);
              const price = getProductPrice(product);
              const category = product.categories?.[0]?.name;
              return (
                <li key={product.id}>
                  <Link
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    href={`/shop/product/${product.handle}` as any}
                    onClick={onClose}
                    className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-sand/40 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-sand/50 flex-shrink-0 flex items-center justify-center">
                      {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package
                          className="w-5 h-5 text-warm-gray/40"
                          strokeWidth={1}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate">
                        {product.title}
                      </p>
                      <div className="flex items-center justify-between mt-0.5">
                        {price && (
                          <span className="text-sm font-medium text-olive">
                            {price}
                          </span>
                        )}
                        {category && (
                          <span className="text-xs text-warm-gray">
                            {category}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            href={`/shop?q=${encodeURIComponent(query)}` as any}
            onClick={onClose}
            className="block text-center text-sm font-medium text-olive hover:text-olive-dark hover:underline py-3 mt-2 border-t border-sand/60 transition-colors"
          >
            {t('viewAll')} ({totalCount}) →
          </Link>
        </div>
      );
    }

    // Default: popular searches (query empty or < 2 chars)
    return (
      <div>
        <p className="text-xs uppercase tracking-widest text-warm-gray mb-3">
          {t('popular')}
        </p>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handlePopularClick(term)}
              className="cursor-pointer px-4 py-2 bg-sand/60 text-charcoal text-sm rounded-full hover:bg-sand transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!mounted) return null;

  const inputBarCls =
    'flex items-center gap-3 pb-3 border-b-2 border-olive/30 focus-within:border-olive transition-colors';
  const inputCls =
    'flex-1 bg-transparent text-xl md:text-2xl text-charcoal placeholder:text-warm-gray/60 outline-none font-light';

  const overlay = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* ── Desktop panel ── */}
      <div
        className={`fixed inset-x-0 top-0 z-[70] hidden md:flex items-start justify-center pt-24 transition-all duration-200 ease-out ${
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-5 pointer-events-none'
        }`}
      >
        <div
          className="w-full max-w-2xl mx-4 bg-cream rounded-xl shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 md:p-8">
            {/* Input — always mounted, never inside a conditional block */}
            <div className={inputBarCls}>
              <Search className="h-5 w-5 text-warm-gray flex-shrink-0" />
              <input
                ref={desktopInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('placeholder')}
                className={inputCls}
              />
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer text-warm-gray hover:text-charcoal transition-colors p-1 flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Content — state changes here; input above is never re-mounted */}
            <div className="mt-5 max-h-[60vh] overflow-y-auto">
              {contentArea()}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile full-screen ── */}
      <div
        className={`fixed inset-0 z-[70] md:hidden bg-cream flex flex-col transition-all duration-300 ease-out ${
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="px-4 pt-5 pb-4">
          {/* Input — always mounted */}
          <div className={inputBarCls}>
            <Search className="h-5 w-5 text-warm-gray flex-shrink-0" />
            <input
              ref={mobileInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('placeholder')}
              className={inputCls}
            />
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-warm-gray hover:text-charcoal transition-colors p-1 flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 px-4 pt-4 overflow-y-auto">
          {contentArea()}
        </div>
      </div>
    </>
  );

  return createPortal(overlay, document.body);
}
