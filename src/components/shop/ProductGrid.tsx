'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { placeholderProducts } from '@/constants/placeholderProducts';
import ProductCard from '@/components/ui/ProductCard';
import FilterBar from '@/components/shop/FilterBar';
import EmptyState from '@/components/shop/EmptyState';

const INITIAL_VISIBLE = 12;
const BATCH_SIZE = 4;

function parseParam(param: string | null): string[] {
  if (!param) return [];
  return param.split(',').filter(Boolean);
}

interface FilterOption {
  value: string;
  label: string;
}

interface ProductGridProps {
  /** When set, products are pre-filtered by this category and the category filter is hidden. */
  lockedCategory?: string;
  /** Category options for the filter dropdown (from Medusa API, passed by parent server component). */
  categoryOptions?: FilterOption[];
}

export default function ProductGrid({
  lockedCategory,
  categoryOptions = [],
}: ProductGridProps) {
  const t = useTranslations('shop');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [categories, setCategories] = useState<string[]>(() =>
    lockedCategory ? [] : parseParam(searchParams.get('category')),
  );
  const [colors, setColors] = useState<string[]>(() =>
    parseParam(searchParams.get('color')),
  );
  const [sort, setSort] = useState(searchParams.get('sort') ?? '');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  useEffect(() => {
    if (!lockedCategory) setCategories(parseParam(searchParams.get('category')));
    setColors(parseParam(searchParams.get('color')));
    setSort(searchParams.get('sort') ?? '');
    setVisibleCount(INITIAL_VISIBLE);
  }, [searchParams, lockedCategory]);

  function updateUrl(
    nextCategories: string[],
    nextColors: string[],
    nextSort: string,
  ) {
    const params = new URLSearchParams();
    if (!lockedCategory && nextCategories.length > 0)
      params.set('category', nextCategories.join(','));
    if (nextColors.length > 0) params.set('color', nextColors.join(','));
    if (nextSort) params.set('sort', nextSort);
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ''}` as '/shop', {
      scroll: false,
    });
  }

  function handleCategoriesChange(values: string[]) {
    setCategories(values);
    setVisibleCount(INITIAL_VISIBLE);
    updateUrl(values, colors, sort);
  }

  function handleColorsChange(values: string[]) {
    setColors(values);
    setVisibleCount(INITIAL_VISIBLE);
    updateUrl(categories, values, sort);
  }

  function handleSortChange(value: string) {
    setSort(value);
    updateUrl(categories, colors, value);
  }

  function handleClearFilters() {
    if (!lockedCategory) setCategories([]);
    setColors([]);
    setSort('');
    setVisibleCount(INITIAL_VISIBLE);
    router.push(pathname as '/shop', { scroll: false });
  }

  const hasActiveFilters =
    (!lockedCategory && categories.length > 0) || colors.length > 0 || !!sort;

  const filtered = useMemo(() => {
    let result = [...placeholderProducts];

    if (lockedCategory) {
      result = result.filter((p) => p.category === lockedCategory);
    } else if (categories.length > 0) {
      result = result.filter((p) => categories.includes(p.category));
    }

    if (colors.length > 0) {
      result = result.filter(
        (p) => p.colors && p.colors.some((c) => colors.includes(c)),
      );
    }

    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return result;
  }, [lockedCategory, categories, colors, sort]);

  const visible = filtered.slice(0, visibleCount);
  const remaining = Math.max(filtered.length - visibleCount, 0);
  const hasMore = remaining > 0;
  const nextBatch = Math.min(remaining, BATCH_SIZE);

  return (
    <>
      <FilterBar
        categories={categories}
        colors={colors}
        sort={sort}
        onCategoriesChange={handleCategoriesChange}
        onColorsChange={handleColorsChange}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        resultCount={filtered.length}
        showCategoryFilter={!lockedCategory}
        categoryOptions={categoryOptions}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pb-24">
        {filtered.length === 0 ? (
          <EmptyState onClear={handleClearFilters} />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {visible.map((product, index) => (
                <div
                  key={product.id}
                  className={index >= INITIAL_VISIBLE ? 'animate-fadeIn' : undefined}
                >
                  <ProductCard
                    slug={product.slug}
                    nameKey={product.nameKey}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    isNew={product.isNew}
                  />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((v) => v + BATCH_SIZE)}
                  className="border-2 border-olive text-olive text-sm uppercase tracking-widest px-8 py-3 rounded hover:bg-olive hover:text-cream transition-colors duration-200"
                >
                  {t('loadMore')} ({nextBatch})
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
