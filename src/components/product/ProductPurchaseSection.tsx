'use client';

import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ProductDescription from './ProductDescription';

interface ProductPurchaseSectionProps {
  product: any;
}

export default function ProductPurchaseSection({ product }: ProductPurchaseSectionProps) {
  const t = useTranslations();

  // Initialize selected options from first variant
  const firstVariant = product.variants?.[0];
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    if (!firstVariant?.options) return {};
    return Object.fromEntries(
      firstVariant.options.map((opt: any) => [opt.option_id, opt.value]),
    );
  });

  // Find the variant that matches current selection
  const selectedVariant =
    (product.variants ?? []).find((variant: any) =>
      variant.options?.every(
        (opt: any) => selectedOptions[opt.option_id] === opt.value,
      ),
    ) ?? firstVariant ?? null;

  // Compute whether variants span a price range
  const allPrices: number[] = (product.variants ?? []).flatMap((v: any) => {
    if (v.calculated_price?.calculated_amount != null)
      return [Number(v.calculated_price.calculated_amount)];
    const eurPrice =
      v.prices?.find((p: any) => p.currency_code === 'eur') || v.prices?.[0];
    return eurPrice ? [Number(eurPrice.amount)] : [];
  });
  const isRange =
    allPrices.length > 1 &&
    Math.min(...allPrices) !== Math.max(...allPrices);

  // Price for the currently selected variant
  let currentPrice: number | null = null;
  let compareAtPrice: number | null = null;
  if (selectedVariant) {
    if (selectedVariant.calculated_price?.calculated_amount != null) {
      currentPrice = Number(selectedVariant.calculated_price.calculated_amount);
      const orig = selectedVariant.calculated_price.original_amount;
      if (orig != null && Number(orig) !== currentPrice) {
        compareAtPrice = Number(orig);
      }
    } else {
      const eurPrice =
        selectedVariant.prices?.find((p: any) => p.currency_code === 'eur') ||
        selectedVariant.prices?.[0];
      if (eurPrice) currentPrice = Number(eurPrice.amount);
    }
  }

  // Show "Nuo" prefix only if range and no specific variant selected yet
  // (auto-initialised with first variant, so we always have a selection — show exact price)
  const displayPrice = currentPrice ?? (allPrices.length ? Math.min(...allPrices) : null);

  function handleOptionSelect(optionId: string, value: string) {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }));
  }

  const productOptions: any[] = product.options ?? [];

  return (
    <div>
      {/* Price */}
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        {compareAtPrice && (
          <span className="text-base text-warm-gray line-through">
            €{compareAtPrice.toFixed(2)}
          </span>
        )}
        <span className="text-xl font-medium text-olive">
          {displayPrice != null ? `€${displayPrice.toFixed(2)}` : '—'}
        </span>
        {compareAtPrice && (
          <span className="bg-olive text-cream text-xs px-2 py-1 rounded-sm uppercase tracking-wide">
            {t('shop.badges.sale')}
          </span>
        )}
      </div>

      <div className="border-t border-sand my-6" />

      {/* Description */}
      {product.description && (
        <ProductDescription description={product.description} />
      )}

      {/* Dynamic option selectors */}
      {productOptions.length > 0 && (
        <div className="mt-6 space-y-5">
          {productOptions.map((option: any) => {
            const values: any[] = option.values ?? [];
            const selectedValue = selectedOptions[option.id];

            if (values.length <= 1) {
              return (
                <div key={option.id}>
                  <span className="text-sm font-medium text-charcoal">
                    {option.title}:{' '}
                  </span>
                  <span className="text-sm text-warm-gray">
                    {values[0]?.value ?? '—'}
                  </span>
                </div>
              );
            }

            return (
              <div key={option.id}>
                <p className="text-sm font-medium text-charcoal mb-2">
                  {option.title}
                  {selectedValue ? `: ${selectedValue}` : ''}
                </p>
                <div className="flex flex-wrap gap-2">
                  {values.map((v: any) => {
                    const isSelected = selectedValue === v.value;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => handleOptionSelect(option.id, v.value)}
                        className={`cursor-pointer px-4 py-2 rounded-lg text-sm transition-all duration-150 ${
                          isSelected
                            ? 'border-2 border-olive text-olive bg-olive/5'
                            : 'border border-sand text-charcoal bg-white hover:border-olive/50'
                        }`}
                      >
                        {v.value}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add to cart */}
      <button
        type="button"
        disabled={!selectedVariant}
        className="mt-8 w-full flex items-center justify-center gap-3 bg-olive text-cream py-4 text-sm uppercase tracking-widest font-medium rounded cursor-pointer hover:bg-olive-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-default"
      >
        <ShoppingBag size={18} />
        {t('product.addToCart')}
      </button>
    </div>
  );
}
