'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import ProductCard from '@/components/ui/ProductCard';
import FilterBar from '@/components/shop/FilterBar';
import EmptyState from '@/components/shop/EmptyState';
import {
  BATCH_SIZE,
  fetchProducts,
  getProductPrice,
  getProductImage,
  extractProductOptions,
  applyOptionFilters,
  type FilterOption,
} from '@/lib/products';

function parseParam(param: string | null): string[] {
  if (!param) return [];
  return param.split(',').filter(Boolean);
}

function sortToApiOrder(sort: string): string {
  if (sort === 'name-az') return 'title';
  return '-created_at';
}

function isPriceSortValue(sort: string): boolean {
  return sort === 'price-asc' || sort === 'price-desc';
}

interface ProductGridProps {
  /** Category handle — locks the category filter UI and hides the dropdown. */
  lockedCategory?: string;
  /** Medusa category ID — used for API queries. */
  lockedCategoryId?: string;
  /** Category options for the filter dropdown (value = handle, id = Medusa ID). */
  categoryOptions?: FilterOption[];
  initialProducts?: any[];
  initialCount?: number;
  regionId?: string | null;
}

export default function ProductGrid({
  lockedCategory,
  lockedCategoryId,
  categoryOptions = [],
  initialProducts = [],
  initialCount = 0,
  regionId = null,
}: ProductGridProps) {
  const t = useTranslations('shop');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initSort = searchParams.get('sort') ?? '';

  // API-paginated products (for newest / name-az without option filters)
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [count, setCount] = useState(initialCount);

  // Full product list — always fetched on mount; used for option extraction + client-side filtering
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [clientOffset, setClientOffset] = useState(BATCH_SIZE);

  // Show full-page spinner for foreground fetches (price sort switch)
  const [isFetching, setIsFetching] = useState(isPriceSortValue(initSort));
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [categories, setCategories] = useState<string[]>(() =>
    lockedCategory ? [] : parseParam(searchParams.get('category')),
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [sort, setSort] = useState(initSort);

  const isPriceSort = isPriceSortValue(sort);
  const hasActiveOptionFilters = Object.values(selectedOptions).some((v) => v.length > 0);
  // Use client-side pagination when price sort OR option filters are active
  const isClientSideMode = isPriceSort || hasActiveOptionFilters;

  // On mount: always fetch full catalog for option extraction + client-side filtering
  useEffect(() => {
    const initCats = lockedCategory ? [] : parseParam(searchParams.get('category'));
    if (isPriceSortValue(initSort)) {
      applyPriceSort(initCats);
    } else {
      fetchFullCatalog(initCats);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── URL helpers ─────────────────────────────────────────────────────────────

  function updateUrl(nextCategories: string[], nextSort: string) {
    const params = new URLSearchParams();
    if (!lockedCategory && nextCategories.length > 0)
      params.set('category', nextCategories.join(','));
    if (nextSort) params.set('sort', nextSort);
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ''}` as '/shop', {
      scroll: false,
    });
  }

  // ─── Category ID resolution ──────────────────────────────────────────────────

  function getCategoryIds(handles: string[]): string[] | undefined {
    if (lockedCategoryId) return [lockedCategoryId];
    if (!handles.length) return undefined;
    const ids = handles
      .map((h) => categoryOptions.find((o) => o.value === h)?.id)
      .filter((id): id is string => !!id);
    return ids.length ? ids : undefined;
  }

  // ─── Data fetching ───────────────────────────────────────────────────────────

  /** Silently fetch all products (up to 200) for option extraction + client-side filtering. */
  async function fetchFullCatalog(cats: string[]) {
    const { products: all } = await fetchProducts({
      locale,
      regionId,
      categoryIds: getCategoryIds(cats),
      limit: 200,
      offset: 0,
    });
    setAllProducts(all);
  }

  /** Fetch paginated products for newest / name-az sorts (normal API pagination). */
  async function applyFilters(newCategories: string[], newSort: string) {
    setIsFetching(true);
    const { products: newProducts, count: newCount } = await fetchProducts({
      locale,
      regionId,
      categoryIds: getCategoryIds(newCategories),
      order: sortToApiOrder(newSort),
      limit: BATCH_SIZE,
      offset: 0,
    });
    setProducts(newProducts);
    setCount(newCount);
    setIsFetching(false);
  }

  /** Fetch ALL products for price sort — foreground (shows full-page spinner). */
  async function applyPriceSort(cats: string[]) {
    setIsFetching(true);
    setClientOffset(BATCH_SIZE);
    await fetchFullCatalog(cats);
    setIsFetching(false);
  }

  // ─── Event handlers ──────────────────────────────────────────────────────────

  function handleCategoriesChange(values: string[]) {
    setCategories(values);
    setSelectedOptions({});
    setClientOffset(BATCH_SIZE);
    updateUrl(values, sort);
    if (isPriceSort) {
      applyPriceSort(values);
    } else {
      applyFilters(values, sort);
      fetchFullCatalog(values);
    }
  }

  function handleSortChange(value: string) {
    setSort(value);
    setClientOffset(BATCH_SIZE);
    updateUrl(categories, value);

    if (isPriceSortValue(value)) {
      applyPriceSort(categories);
    } else if (isPriceSort) {
      // Switching away from price sort → back to API pagination
      // allProducts stays populated for option extraction
      applyFilters(categories, value);
    } else if (sortToApiOrder(value) !== sortToApiOrder(sort)) {
      applyFilters(categories, value);
    }
  }

  function handleOptionsChange(optionTitle: string, values: string[]) {
    setSelectedOptions((prev) => ({ ...prev, [optionTitle]: values }));
    setClientOffset(BATCH_SIZE);
  }

  function handleClearFilters() {
    if (!lockedCategory) setCategories([]);
    setSelectedOptions({});
    setSort('');
    setClientOffset(BATCH_SIZE);
    router.push(pathname as '/shop', { scroll: false });
    applyFilters([], '');
    fetchFullCatalog([]);
  }

  async function loadMore() {
    if (isClientSideMode) {
      // No API call needed — just reveal the next slice of already-fetched data
      setClientOffset((prev) => prev + BATCH_SIZE);
      return;
    }
    setIsLoadingMore(true);
    const { products: moreProducts, count: newCount } = await fetchProducts({
      locale,
      regionId,
      categoryIds: getCategoryIds(categories),
      order: sortToApiOrder(sort),
      limit: BATCH_SIZE,
      offset: products.length,
    });
    setProducts((prev) => [...prev, ...moreProducts]);
    setCount(newCount);
    setIsLoadingMore(false);
  }

  // ─── Derived data ─────────────────────────────────────────────────────────────

  // Extract options from full catalog when available; fall back to loaded batch
  const productOptions = useMemo(
    () => extractProductOptions(allProducts.length > 0 ? allProducts : products),
    [allProducts, products],
  );

  /**
   * For client-side mode (price sort OR option filters):
   * filter from full catalog, sort by price if needed.
   * Falls back to filtering `products` if allProducts not yet loaded.
   */
  const clientFilteredProducts = useMemo(() => {
    if (!isClientSideMode) return [];
    const source = allProducts.length > 0 ? allProducts : products;
    const filtered = applyOptionFilters(source, selectedOptions);
    if (!isPriceSort) return filtered;
    return [...filtered].sort((a, b) => {
      const pa = getProductPrice(a).amount ?? (sort === 'price-asc' ? Infinity : -Infinity);
      const pb = getProductPrice(b).amount ?? (sort === 'price-asc' ? Infinity : -Infinity);
      return sort === 'price-asc' ? pa - pb : pb - pa;
    });
  }, [isClientSideMode, isPriceSort, allProducts, products, selectedOptions, sort]);

  const displayedProducts = useMemo(() => {
    if (isClientSideMode) return clientFilteredProducts.slice(0, clientOffset);
    return products;
  }, [isClientSideMode, clientFilteredProducts, clientOffset, products]);

  // Total count for "Rasta: X" label
  const resultCount = isClientSideMode ? clientFilteredProducts.length : count;

  const hasMore = isClientSideMode
    ? clientOffset < clientFilteredProducts.length
    : products.length < count;

  const hasActiveFilters =
    (!lockedCategory && categories.length > 0) ||
    hasActiveOptionFilters ||
    !!sort;

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      <FilterBar
        categories={categories}
        productOptions={productOptions}
        selectedOptions={selectedOptions}
        sort={sort}
        onCategoriesChange={handleCategoriesChange}
        onOptionsChange={handleOptionsChange}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        resultCount={resultCount}
        showCategoryFilter={!lockedCategory}
        categoryOptions={categoryOptions}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pb-24">
        {isFetching ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-olive border-t-transparent rounded-full animate-spin" />
          </div>
        ) : displayedProducts.length === 0 ? (
          <EmptyState onClear={handleClearFilters} />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {displayedProducts.map((product) => {
                const { amount, compareAtAmount } = getProductPrice(product);
                const image = getProductImage(product);
                const isNew =
                  new Date(product.created_at) >
                  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                return (
                  <ProductCard
                    key={product.id}
                    slug={product.handle}
                    name={product.title}
                    price={amount ?? 0}
                    originalPrice={compareAtAmount ?? undefined}
                    isNew={isNew}
                    image={image ?? undefined}
                  />
                );
              })}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="cursor-pointer border-2 border-olive text-olive text-sm uppercase tracking-widest px-8 py-3 rounded hover:bg-olive hover:text-cream transition-colors duration-200 disabled:opacity-50 disabled:cursor-default"
                >
                  {isLoadingMore ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-olive border-t-transparent rounded-full animate-spin inline-block" />
                      {t('loadMore')}
                    </span>
                  ) : (
                    t('loadMore')
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
