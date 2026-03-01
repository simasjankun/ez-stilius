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

  // API-paginated products (for newest / name-az)
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [count, setCount] = useState(initialCount);

  // Full product list fetched at once for price sorts
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [clientOffset, setClientOffset] = useState(BATCH_SIZE);

  // If URL already has price sort on mount → start in loading state
  const [isFetching, setIsFetching] = useState(isPriceSortValue(initSort));
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [categories, setCategories] = useState<string[]>(() =>
    lockedCategory ? [] : parseParam(searchParams.get('category')),
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [sort, setSort] = useState(initSort);

  const isPriceSort = isPriceSortValue(sort);

  // On mount: if URL already has price sort, fetch full catalog immediately
  useEffect(() => {
    if (isPriceSortValue(initSort)) {
      const initCats = lockedCategory ? [] : parseParam(searchParams.get('category'));
      applyPriceSort(initCats);
    }
    // runs once on mount — stable props used inside
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── URL helpers ────────────────────────────────────────────────────────────

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

  // ─── Data fetching ──────────────────────────────────────────────────────────

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

  /**
   * Fetch ALL products (limit 200) for price sorts so that sorting covers
   * the entire catalog, not just the currently loaded page.
   */
  async function applyPriceSort(cats: string[]) {
    setIsFetching(true);
    setAllProducts([]);
    setClientOffset(BATCH_SIZE);
    const { products: all } = await fetchProducts({
      locale,
      regionId,
      categoryIds: getCategoryIds(cats),
      limit: 200,
      offset: 0,
    });
    setAllProducts(all);
    setIsFetching(false);
  }

  // ─── Event handlers ──────────────────────────────────────────────────────────

  function handleCategoriesChange(values: string[]) {
    setCategories(values);
    setSelectedOptions({});
    updateUrl(values, sort);
    if (isPriceSort) {
      applyPriceSort(values);
    } else {
      applyFilters(values, sort);
    }
  }

  function handleSortChange(value: string) {
    setSort(value);
    updateUrl(categories, value);

    if (isPriceSortValue(value)) {
      // Switching to price sort: fetch full catalog once, paginate client-side
      applyPriceSort(categories);
    } else if (isPriceSort) {
      // Switching away from price sort: back to normal API pagination
      setAllProducts([]);
      applyFilters(categories, value);
    } else if (sortToApiOrder(value) !== sortToApiOrder(sort)) {
      // Switching between API-ordered sorts
      applyFilters(categories, value);
    }
  }

  function handleOptionsChange(optionTitle: string, values: string[]) {
    setSelectedOptions((prev) => ({ ...prev, [optionTitle]: values }));
    // Reset visible slice so newly filtered products start from the top
    if (isPriceSort) setClientOffset(BATCH_SIZE);
  }

  function handleClearFilters() {
    if (!lockedCategory) setCategories([]);
    setSelectedOptions({});
    setSort('');
    setAllProducts([]);
    setClientOffset(BATCH_SIZE);
    router.push(pathname as '/shop', { scroll: false });
    applyFilters([], '');
  }

  async function loadMore() {
    if (isPriceSort) {
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

  // ─── Derived data ────────────────────────────────────────────────────────────

  // Extract available filter options from whichever product set is in use
  const productOptions = useMemo(
    () => extractProductOptions(isPriceSort ? allProducts : products),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPriceSort, allProducts, products],
  );

  /**
   * For price sorts: sort the FULL catalog client-side, then slice for display.
   * For other sorts: apply option filters only (API handles ordering).
   */
  const sortedAllProducts = useMemo(() => {
    if (!isPriceSort) return [];
    const filtered = applyOptionFilters(allProducts, selectedOptions);
    return [...filtered].sort((a, b) => {
      const pa = getProductPrice(a).amount ?? (sort === 'price-asc' ? Infinity : -Infinity);
      const pb = getProductPrice(b).amount ?? (sort === 'price-asc' ? Infinity : -Infinity);
      return sort === 'price-asc' ? pa - pb : pb - pa;
    });
  }, [isPriceSort, allProducts, selectedOptions, sort]);

  const displayedProducts = useMemo(() => {
    if (isPriceSort) return sortedAllProducts.slice(0, clientOffset);
    return applyOptionFilters(products, selectedOptions);
  }, [isPriceSort, sortedAllProducts, clientOffset, products, selectedOptions]);

  // Total count for the "Rasta: X" label
  const resultCount = isPriceSort ? sortedAllProducts.length : displayedProducts.length;

  const hasMore = isPriceSort
    ? clientOffset < sortedAllProducts.length
    : products.length < count;

  const hasActiveFilters =
    (!lockedCategory && categories.length > 0) ||
    Object.values(selectedOptions).some((v) => v.length > 0) ||
    !!sort;

  // ─── Render ──────────────────────────────────────────────────────────────────

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
                  className="border-2 border-olive text-olive text-sm uppercase tracking-widest px-8 py-3 rounded hover:bg-olive hover:text-cream transition-colors duration-200 disabled:opacity-50"
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
