'use client';

import { useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import type { FilterOption } from '@/lib/products';
import { getSwatchColor } from '@/constants/colorMap';
import { translateOptionTitle, translateOptionValue } from '@/constants/optionTranslations';

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  categories?: string[];
  productOptions?: { title: string; values: string[] }[];
  selectedOptions?: Record<string, string[]>;
  categoryOptions?: FilterOption[];
  onCategoriesChange?: (values: string[]) => void;
  onOptionsChange?: (title: string, values: string[]) => void;
  onClear: () => void;
  resultCount: number;
  showCategoryFilter?: boolean;
}

function CheckboxIcon({ checked }: { checked: boolean }) {
  return (
    <span
      className={`w-5 h-5 rounded-sm border shrink-0 flex items-center justify-center transition-colors duration-150 ${
        checked ? 'bg-olive border-olive' : 'border-warm-gray/50 bg-cream'
      }`}
    >
      {checked && <Check size={11} className="text-cream" strokeWidth={2.5} />}
    </span>
  );
}

export default function MobileFilterDrawer({
  open,
  onClose,
  categories = [],
  productOptions = [],
  selectedOptions = {},
  categoryOptions = [],
  onCategoriesChange = () => {},
  onOptionsChange = () => {},
  onClear,
  resultCount,
  showCategoryFilter = true,
}: MobileFilterDrawerProps) {
  const t = useTranslations('shop.filters');
  const locale = useLocale();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  function toggleCategory(value: string) {
    if (categories.includes(value)) {
      onCategoriesChange(categories.filter((v) => v !== value));
    } else {
      onCategoriesChange([...categories, value]);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-cream rounded-t-2xl max-h-[80vh] flex flex-col animate-slideUp">
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full bg-sand mx-auto mt-3 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand shrink-0">
          <h3 className="text-base font-medium text-charcoal">{t('filtersButton')}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-warm-gray hover:text-charcoal transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 pb-4">
          {/* Categories */}
          {showCategoryFilter && categoryOptions.length > 0 && (
            <>
              <p className="text-xs uppercase tracking-widest font-semibold text-warm-gray mb-2 mt-6">
                {t('categoriesLabel')}
              </p>
              {categoryOptions.map((option) => {
                const checked = categories.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleCategory(option.value)}
                    className="w-full flex items-center gap-3 py-3 text-sm text-charcoal"
                  >
                    <CheckboxIcon checked={checked} />
                    <span className={checked ? 'text-olive font-medium' : ''}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </>
          )}

          {/* Dynamic product options (Color, Size, Material, etc.) */}
          {productOptions.map((opt) => {
            const selected = selectedOptions[opt.title] ?? [];
            return (
              <div key={opt.title}>
                <p className="text-xs uppercase tracking-widest font-semibold text-warm-gray mb-2 mt-6">
                  {translateOptionTitle(opt.title, locale)}
                </p>
                {opt.values.map((value) => {
                  const checked = selected.includes(value);
                  const swatchColor = getSwatchColor(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        const newVals = checked
                          ? selected.filter((v) => v !== value)
                          : [...selected, value];
                        onOptionsChange(opt.title, newVals);
                      }}
                      className="w-full flex items-center gap-3 py-3 text-sm text-charcoal"
                    >
                      <CheckboxIcon checked={checked} />
                      {swatchColor && (
                        swatchColor === 'multicolor' ? (
                          <span
                            className="w-4 h-4 rounded-full shrink-0 border border-black/10"
                            style={{
                              background:
                                'conic-gradient(red 0deg, orange 51deg, yellow 102deg, green 154deg, cyan 205deg, blue 257deg, violet 308deg, red 360deg)',
                            }}
                          />
                        ) : (
                          <span
                            className="w-4 h-4 rounded-full shrink-0 border border-black/10"
                            style={{ backgroundColor: swatchColor }}
                          />
                        )
                      )}
                      <span className={checked ? 'text-olive font-medium' : ''}>
                        {translateOptionValue(value, locale)}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-sand px-6 py-4 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClear}
            className="cursor-pointer text-sm text-warm-gray hover:text-olive transition-colors duration-150"
          >
            {t('clear')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-olive text-cream text-sm px-6 py-2.5 rounded hover:bg-olive-dark transition-colors duration-150"
          >
            {t('showResults')} ({resultCount})
          </button>
        </div>
      </div>
    </>
  );
}
