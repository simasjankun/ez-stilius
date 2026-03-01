'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Package, Loader2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import Fuse from 'fuse.js';

const MEDUSA_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://api.ezstilius.lt';
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

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

// ── Module-level cache (persists across modal open/close, per locale) ────────
const productCache: Record<string, { products: MedusaProduct[]; ts: number }> = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached(locale: string): MedusaProduct[] | null {
  const entry = productCache[locale];
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) return null;
  return entry.products;
}

function setCached(locale: string, products: MedusaProduct[]) {
  productCache[locale] = { products, ts: Date.now() };
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function getProductPrice(product: MedusaProduct): string | null {
  const variant = product.variants?.[0];
  if (!variant) return null;

  if (variant.calculated_price?.calculated_amount != null) {
    return `€${Number(variant.calculated_price.calculated_amount).toFixed(2)}`;
  }

  const price =
    variant.prices?.find((p) => p.currency_code === 'eur') ||
    variant.prices?.[0];
  if (price) return `€${Number(price.amount).toFixed(2)}`;

  return null;
}

function getImageUrl(product: MedusaProduct): string | null {
  return product.thumbnail || product.images?.[0]?.url || null;
}

// ── Debounce hook ────────────────────────────────────────────────────────────
function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
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
  const [allProducts, setAllProducts] = useState<MedusaProduct[]>([]);
  const [results, setResults] = useState<MedusaProduct[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [regionId, setRegionId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const fuseRef = useRef<Fuse<MedusaProduct> | null>(null);

  const popularSearches = t.raw('popularSearches') as string[];
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => { setMounted(true); }, []);

  // ── Fetch region_id once ──────────────────────────────────────────────────
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

  // ── Fetch ALL products when modal opens (or locale/region changes) ────────
  // Runs once per locale per session (cached for 5 min).
  useEffect(() => {
    if (!isOpen) return;

    const cached = getCached(medusaLocale);
    if (cached) {
      setAllProducts(cached);
      buildFuse(cached);
      return;
    }

    setIsFetching(true);
    setHasError(false);

    const params = new URLSearchParams({ limit: '200', locale: medusaLocale });
    if (regionId) params.set('region_id', regionId);

    fetch(`${MEDUSA_URL}/store/products?${params}`, {
      headers: {
        'x-publishable-api-key': API_KEY,
        'Content-Type': 'application/json',
        'x-medusa-locale': medusaLocale,
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((data) => {
        const products: MedusaProduct[] = data.products || [];
        setCached(medusaLocale, products);
        setAllProducts(products);
        buildFuse(products);
        setIsFetching(false);
      })
      .catch((e) => {
        console.error('Failed to fetch products:', e);
        setHasError(true);
        setIsFetching(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, medusaLocale, regionId]);

  function buildFuse(products: MedusaProduct[]) {
    fuseRef.current = new Fuse(products, {
      keys: [
        { name: 'title', weight: 2 },
        { name: 'categories.name', weight: 1 },
      ],
      threshold: 0.35,   // typo tolerance: 0=exact, 1=anything
      minMatchCharLength: 2,
      includeScore: true,
    });
  }

  // ── Run Fuse search when query changes ────────────────────────────────────
  useEffect(() => {
    if (debouncedQuery.length < 2 || !fuseRef.current) {
      setResults([]);
      return;
    }
    const hits = fuseRef.current.search(debouncedQuery, { limit: 6 });
    setResults(hits.map((h) => h.item));
  }, [debouncedQuery]);

  // ── Open / close effects ──────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        desktopInputRef.current?.focus();
        mobileInputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ── Escape key ────────────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); },
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

  // ── Content (plain function call — no component boundary, no focus loss) ──
  function contentArea() {
    // Still fetching AND user already typed — show spinner
    if (isFetching && debouncedQuery.length >= 2) {
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

    // No query yet — show popular
    if (debouncedQuery.length < 2) {
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

    // Query typed but no results
    if (results.length === 0) {
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

    // Results
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
                      <Package className="w-5 h-5 text-warm-gray/40" strokeWidth={1} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">
                      {product.title}
                    </p>
                    <div className="flex items-center justify-between mt-0.5">
                      {price && (
                        <span className="text-sm font-medium text-olive">{price}</span>
                      )}
                      {category && (
                        <span className="text-xs text-warm-gray">{category}</span>
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
          {t('viewAll')} ({results.length}) →
        </Link>
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
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5 pointer-events-none'
        }`}
      >
        <div
          className="w-full max-w-2xl mx-4 bg-cream rounded-xl shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 md:p-8">
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
            <div className="mt-5 max-h-[60vh] overflow-y-auto">
              {contentArea()}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile full-screen ── */}
      <div
        className={`fixed inset-0 z-[70] md:hidden bg-cream flex flex-col transition-all duration-300 ease-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="px-4 pt-5 pb-4">
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
