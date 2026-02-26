'use client';

import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/context/CartContext';
import type { PlaceholderProduct } from '@/constants/placeholderProducts';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import ProductAccordion, { type AccordionSection } from './ProductAccordion';

interface ProductInfoProps {
  product: PlaceholderProduct;
  categoryName: string;
}

export default function ProductInfo({ product, categoryName }: ProductInfoProps) {
  const t = useTranslations();
  const tp = useTranslations('product');
  const tc = useTranslations('shop.filters.colors');
  const { openCart } = useCart();

  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors?.[0] ?? null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.details.sizes?.[0] ?? null
  );
  const [quantity, setQuantity] = useState(1);

  const colorName = selectedColor ? tc(selectedColor) : null;

  // Build accordion sections — only non-null content renders
  const materialContent = [
    product.details.materialKey ? t(product.details.materialKey) : null,
    product.details.careKey ? t(product.details.careKey) : null,
  ]
    .filter(Boolean)
    .join('\n') || null;

  const sections: AccordionSection[] = [
    {
      titleKey: 'description',
      title: tp('description'),
      content: product.descriptionKey ? t(product.descriptionKey) : null,
      defaultOpen: true,
    },
    {
      titleKey: 'materialCare',
      title: tp('materialCare'),
      content: materialContent,
      defaultOpen: false,
    },
  ];

  const visibleSections = sections.filter((s) => s.content !== null);

  return (
    <div className="mt-8 lg:mt-0">
      {/* Category label */}
      <p className="text-xs uppercase tracking-widest text-olive mb-3">{categoryName}</p>

      {/* Product name */}
      <h1 className="font-serif text-2xl md:text-3xl text-charcoal leading-snug">
        {t(product.nameKey)}
      </h1>

      {/* Price */}
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        {product.originalPrice ? (
          <>
            <span className="text-base text-warm-gray line-through">
              €{product.originalPrice.toFixed(2)}
            </span>
            <span className="text-xl font-medium text-olive">€{product.price.toFixed(2)}</span>
            <span className="bg-olive text-cream text-xs px-2 py-1 rounded-sm uppercase tracking-wide">
              {t('shop.badges.sale')}
            </span>
          </>
        ) : (
          <span className="text-xl font-medium text-olive">€{product.price.toFixed(2)}</span>
        )}
      </div>

      <div className="border-t border-sand my-6" />

      {/* Color selector */}
      {product.colors && product.colors.length > 0 && (
        <div className="mb-5">
          <p className="text-sm font-medium text-charcoal mb-3">
            {tp('color')}
            {colorName ? `: ${colorName}` : ':'}
          </p>
          <ColorSelector
            colors={product.colors}
            selected={selectedColor}
            onSelect={setSelectedColor}
          />
        </div>
      )}

      {/* Size selector */}
      {product.details.sizes && product.details.sizes.length > 0 && (
        <div className="mb-5">
          <p className="text-sm font-medium text-charcoal mb-3">{tp('size')}:</p>
          <SizeSelector
            sizes={product.details.sizes}
            selected={selectedSize}
            onSelect={setSelectedSize}
          />
        </div>
      )}

      {/* Quantity */}
      <div className="mb-6">
        <p className="text-sm font-medium text-charcoal mb-3">{tp('quantity')}:</p>
        <QuantitySelector value={quantity} onChange={setQuantity} />
      </div>

      {/* Add to cart */}
      <button
        type="button"
        onClick={openCart}
        className="w-full flex items-center justify-center gap-3 bg-olive text-cream py-4 text-sm uppercase tracking-widest font-medium rounded cursor-pointer hover:bg-olive-dark transition-colors duration-200"
      >
        <ShoppingBag size={18} />
        {tp('addToCart')}
      </button>

      {/* Accordion sections */}
      {visibleSections.length > 0 && (
        <div className="mt-6">
          {visibleSections.map((section) => (
            <ProductAccordion
              key={section.titleKey}
              title={section.title}
              content={section.content!}
              defaultOpen={section.defaultOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}
