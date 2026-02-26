'use client';

import { useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { availableColors } from '@/constants/colors';

interface FilterOption {
  value: string;
  label: string;
}

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  categories: string[];
  colors: string[];
  categoryOptions: FilterOption[];
  onCategoriesChange: (values: string[]) => void;
  onColorsChange: (values: string[]) => void;
  onClear: () => void;
  resultCount: number;
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
  categories,
  colors,
  categoryOptions,
  onCategoriesChange,
  onColorsChange,
  onClear,
  resultCount,
}: MobileFilterDrawerProps) {
  const t = useTranslations('shop.filters');
  const tc = useTranslations('shop.filters.colors');

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

  function toggleColor(key: string) {
    if (colors.includes(key)) {
      onColorsChange(colors.filter((v) => v !== key));
    } else {
      onColorsChange([...colors, key]);
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
                <span className={checked ? 'text-olive font-medium' : ''}>{option.label}</span>
              </button>
            );
          })}

          {/* Colors */}
          <p className="text-xs uppercase tracking-widest font-semibold text-warm-gray mb-2 mt-6">
            {t('color')}
          </p>
          {availableColors.map((color) => {
            const checked = colors.includes(color.key);
            return (
              <button
                key={color.key}
                type="button"
                onClick={() => toggleColor(color.key)}
                className="w-full flex items-center gap-3 py-3 text-sm text-charcoal"
              >
                <CheckboxIcon checked={checked} />
                <span
                  className="w-4 h-4 rounded-full shrink-0 border border-black/10"
                  style={{ backgroundColor: color.hex }}
                />
                <span className={checked ? 'text-olive font-medium' : ''}>{tc(color.key)}</span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-sand px-6 py-4 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-warm-gray hover:text-olive transition-colors duration-150"
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
