'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { SlidersHorizontal, X } from 'lucide-react';
import MultiSelectDropdown from '@/components/ui/MultiSelectDropdown';
import CustomDropdown from '@/components/ui/CustomDropdown';
import MobileFilterDrawer from '@/components/shop/MobileFilterDrawer';
import type { FilterOption } from '@/lib/products';
import { getSwatchColor } from '@/constants/colorMap';
import { translateOptionTitle, translateOptionValue } from '@/constants/optionTranslations';

interface FilterBarProps {
  categories?: string[];
  /** Dynamic product options extracted from loaded products (e.g. Spalva, Dydis). */
  productOptions?: { title: string; values: string[] }[];
  selectedOptions?: Record<string, string[]>;
  sort: string;
  onCategoriesChange?: (values: string[]) => void;
  onOptionsChange?: (title: string, values: string[]) => void;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  resultCount: number;
  showCategoryFilter?: boolean;
  categoryOptions?: FilterOption[];
}

export default function FilterBar({
  categories = [],
  productOptions = [],
  selectedOptions = {},
  sort,
  onCategoriesChange = () => {},
  onOptionsChange = () => {},
  onSortChange,
  onClearFilters,
  hasActiveFilters,
  resultCount,
  showCategoryFilter = true,
  categoryOptions = [],
}: FilterBarProps) {
  const t = useTranslations('shop.filters');
  const locale = useLocale();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sortOptions = [
    { value: 'newest', label: t('newest') },
    { value: 'price-asc', label: t('priceLow') },
    { value: 'price-desc', label: t('priceHigh') },
    { value: 'name-az', label: t('nameAZ') },
  ];

  function getCategoryLabel(): string {
    if (categories.length === 0) return t('allCategories');
    if (categories.length === 1) {
      return (
        categoryOptions.find((o) => o.value === categories[0])?.label ??
        t('allCategories')
      );
    }
    return t('categoriesCount', { count: categories.length });
  }

  const activeFilterCount =
    (showCategoryFilter ? categories.length : 0) +
    Object.values(selectedOptions).reduce((sum, v) => sum + v.length, 0);

  return (
    <>
      {/* ── Desktop bar (md+) ── */}
      <div className="hidden md:block border-b border-sand">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {showCategoryFilter && categoryOptions.length > 0 && (
                <MultiSelectDropdown
                  options={categoryOptions}
                  values={categories}
                  onChange={onCategoriesChange}
                  buttonLabel={getCategoryLabel()}
                  hasClear={categories.length > 0}
                  onClear={() => onCategoriesChange([])}
                  className="min-w-[180px]"
                />
              )}
              {productOptions.map((opt) => {
                const selected = selectedOptions[opt.title] ?? [];
                const translatedTitle = translateOptionTitle(opt.title, locale);
                const btnLabel =
                  selected.length === 0
                    ? translatedTitle
                    : selected.length === 1
                    ? translateOptionValue(selected[0], locale)
                    : `${translatedTitle} (${selected.length})`;
                return (
                  <MultiSelectDropdown
                    key={opt.title}
                    options={opt.values.map((v) => ({
                      value: v,
                      label: translateOptionValue(v, locale),
                      color: getSwatchColor(v) ?? undefined,
                    }))}
                    values={selected}
                    onChange={(values) => onOptionsChange(opt.title, values)}
                    buttonLabel={btnLabel}
                    hasClear={selected.length > 0}
                    onClear={() => onOptionsChange(opt.title, [])}
                    className="min-w-[140px]"
                  />
                );
              })}
              <CustomDropdown
                options={sortOptions}
                value={sort}
                onChange={onSortChange}
                placeholder={t('sortBy')}
                className="min-w-[200px]"
              />
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="cursor-pointer flex items-center gap-1.5 text-sm text-warm-gray hover:text-olive transition-colors duration-150"
                >
                  <X size={13} />
                  <span>{t('clearFilters')}</span>
                </button>
              )}
            </div>
            <p className="text-sm text-warm-gray shrink-0">
              {t('found')}:{' '}
              <span className="text-charcoal font-medium">{resultCount}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Mobile bar (below md) ── */}
      <div className="md:hidden border-b border-sand">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="w-1/2 flex items-center justify-center gap-2 bg-sand/50 rounded px-4 py-2.5 text-sm text-charcoal hover:bg-sand/70 transition-colors duration-150"
            >
              <SlidersHorizontal size={14} className="shrink-0" />
              <span>{t('filtersButton')}</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-olive text-cream text-xs flex items-center justify-center shrink-0 font-medium">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <CustomDropdown
              options={sortOptions}
              value={sort}
              onChange={onSortChange}
              placeholder={t('sortBy')}
              className="w-1/2"
            />
          </div>
          <p className="text-xs text-warm-gray text-center mt-2">
            {t('found')}:{' '}
            <span className="text-charcoal font-medium">{resultCount}</span>
          </p>
        </div>
      </div>

      {/* Mobile drawer */}
      <MobileFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        categories={categories}
        productOptions={productOptions}
        selectedOptions={selectedOptions}
        categoryOptions={categoryOptions}
        onCategoriesChange={onCategoriesChange}
        onOptionsChange={onOptionsChange}
        onClear={() => {
          onClearFilters();
          setDrawerOpen(false);
        }}
        resultCount={resultCount}
        showCategoryFilter={showCategoryFilter}
      />
    </>
  );
}
