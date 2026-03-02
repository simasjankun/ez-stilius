'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useCart } from '@/context/CartContext';
import { translateOptionTitle, translateOptionValue } from '@/constants/optionTranslations';
import ProductDescription from './ProductDescription';

interface ProductPurchaseSectionProps {
  product: any;
}

export default function ProductPurchaseSection({ product }: ProductPurchaseSectionProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { addItem, isLoading } = useCart();

  // Initialize selected options from first variant
  const firstVariant = product.variants?.[0];
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    if (!firstVariant?.options) return {};
    return Object.fromEntries(
      firstVariant.options.map((opt: any) => [opt.option_id, opt.value]),
    );
  });

  const [quantity, setQuantity] = useState(1);
  const [addError, setAddError] = useState<string | null>(null);

  // Find the variant that matches current selection
  const selectedVariant =
    (product.variants ?? []).find((variant: any) =>
      variant.options?.every(
        (opt: any) => selectedOptions[opt.option_id] === opt.value,
      ),
    ) ?? firstVariant ?? null;

  // Inventory logic
  // manage_inventory must be *explicitly* true — undefined (field not returned) = no limit
  // inventory_quantity: Medusa v2 returns 0 by default even when stock exists (inventory tracked
  // via location levels, not directly on variant), so we only trust it when > 0
  const hasInventoryLimit = selectedVariant?.manage_inventory === true;
  const rawQty: number | null | undefined = selectedVariant?.inventory_quantity;
  const maxQuantity: number = (typeof rawQty === 'number' && rawQty > 0) ? rawQty : 99;
  const effectiveMax = hasInventoryLimit ? Math.min(maxQuantity, 99) : 99;
  // Never show sold-out based on inventory_quantity alone — unreliable in Medusa v2
  // API will reject add-to-cart if genuinely out of stock
  const isSoldOut = false;

  // Reset quantity to 1 when selected variant changes
  useEffect(() => {
    setQuantity(1);
    setAddError(null);
  }, [selectedVariant?.id]);

  // Compute whether variants span a price range
  const allPrices: number[] = (product.variants ?? []).flatMap((v: any) => {
    if (v.calculated_price?.calculated_amount != null)
      return [Number(v.calculated_price.calculated_amount)];
    const eurPrice =
      v.prices?.find((p: any) => p.currency_code === 'eur') || v.prices?.[0];
    return eurPrice ? [Number(eurPrice.amount)] : [];
  });

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

  const displayPrice = currentPrice ?? (allPrices.length ? Math.min(...allPrices) : null);

  function handleOptionSelect(optionId: string, value: string) {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }));
  }

  async function handleAddToCart() {
    if (!selectedVariant) return;
    setAddError(null);
    try {
      await addItem(selectedVariant.id, quantity);
    } catch {
      setAddError(t('product.addError'));
    }
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
                    {translateOptionTitle(option.title, locale)}:{' '}
                  </span>
                  <span className="text-sm text-warm-gray">
                    {values[0]?.value ? translateOptionValue(values[0].value, locale) : '—'}
                  </span>
                </div>
              );
            }

            return (
              <div key={option.id}>
                <p className="text-sm font-medium text-charcoal mb-2">
                  {translateOptionTitle(option.title, locale)}
                  {selectedValue ? `: ${translateOptionValue(selectedValue, locale)}` : ''}
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
                        {translateOptionValue(v.value, locale)}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quantity selector */}
      {!isSoldOut && (
        <div className="mt-6">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-charcoal mr-3">{t('product.quantity')}:</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-10 h-10 rounded-lg border border-sand flex items-center justify-center text-charcoal hover:border-olive disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              −
            </button>
            <span className="w-12 h-10 flex items-center justify-center text-sm font-medium text-charcoal">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(effectiveMax, q + 1))}
              disabled={quantity >= effectiveMax}
              className="w-10 h-10 rounded-lg border border-sand flex items-center justify-center text-charcoal hover:border-olive disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              +
            </button>
          </div>
          {hasInventoryLimit && typeof rawQty === 'number' && rawQty > 0 && rawQty <= 5 && (
            <p className="text-xs text-warm-gray mt-1.5">
              {t('product.stockLeft', { count: rawQty })}
            </p>
          )}
        </div>
      )}

      {/* Add to cart / Sold out */}
      {isSoldOut ? (
        <button
          type="button"
          disabled
          className="mt-8 w-full flex items-center justify-center gap-3 bg-sand text-warm-gray py-4 text-sm uppercase tracking-widest font-medium rounded cursor-default opacity-70"
        >
          {t('product.soldOut')}
        </button>
      ) : (
        <button
          type="button"
          disabled={!selectedVariant || isLoading}
          onClick={handleAddToCart}
          className="mt-8 w-full flex items-center justify-center gap-3 bg-olive text-cream py-4 text-sm uppercase tracking-widest font-medium rounded cursor-pointer hover:bg-olive-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-default"
        >
          <ShoppingBag size={18} />
          {isLoading ? t('product.adding') : t('product.addToCart')}
        </button>
      )}

      {/* Add to cart error */}
      {addError && (
        <p className="text-xs text-red-600 mt-2 text-center">{addError}</p>
      )}
    </div>
  );
}
