'use client';

import { Package } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

interface ProductCardProps {
  slug: string;
  nameKey: string;
  price: number;
  image?: string;
}

export default function ProductCard({ slug, nameKey, price, image }: ProductCardProps) {
  const t = useTranslations();

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
      </div>
      <h3 className="mt-3 font-serif text-base text-charcoal truncate">
        {t(nameKey)}
      </h3>
      <p className="mt-1 text-sm font-medium text-olive">
        €{price.toFixed(2)}
      </p>
    </Link>
  );
}
