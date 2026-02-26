'use client';

import { Package } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

interface ProductCardProps {
  slug: string;
  nameKey: string;
  price: number;
  originalPrice?: number;
  isNew?: boolean;
  image?: string;
}

export default function ProductCard({ slug, nameKey, price, originalPrice, isNew, image }: ProductCardProps) {
  const t = useTranslations();

  const showSaleBadge = !!originalPrice;
  const showNewBadge = isNew && !originalPrice;

  return (
    <Link href={`/shop/product/${slug}`} className="group block">
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-sand">
        {image ? (
          <img
            src={image}
            alt={t(nameKey)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <Package className="w-12 h-12 text-warm-gray/30" strokeWidth={1} />
          </div>
        )}

        {(showSaleBadge || showNewBadge) && (
          <div className="absolute top-2 left-2 z-10">
            {showSaleBadge ? (
              <span className="bg-olive text-cream text-xs px-2 py-1 rounded-sm uppercase tracking-wide">
                {t('shop.badges.sale')}
              </span>
            ) : (
              <span className="bg-charcoal text-cream text-xs px-2 py-1 rounded-sm uppercase tracking-wide">
                {t('shop.badges.new')}
              </span>
            )}
          </div>
        )}
      </div>

      <h3 className="mt-3 font-serif text-base text-charcoal truncate">
        {t(nameKey)}
      </h3>

      {originalPrice ? (
        <p className="mt-1 text-sm">
          <span className="line-through text-warm-gray mr-2">€{originalPrice.toFixed(2)}</span>
          <span className="font-medium text-olive">€{price.toFixed(2)}</span>
        </p>
      ) : (
        <p className="mt-1 text-sm font-medium text-olive">€{price.toFixed(2)}</p>
      )}
    </Link>
  );
}
