'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const CATEGORIES = [
  { slug: 'clothing', image: '/images/categories/category-clothing.png' },
  { slug: 'sewing-supplies', image: '/images/categories/category-sewing-supplies.png' },
  { slug: 'accessories', image: '/images/categories/category-accessories.png' },
  { slug: 'interior-gifts', image: '/images/categories/category-interior-gifts.png' },
] as const;

interface MegaMenuProps {
  isOpen: boolean;
}

export default function MegaMenu({ isOpen }: MegaMenuProps) {
  const t = useTranslations('categories');

  return (
    <div
      className={`absolute left-1/2 top-full z-40 w-screen -translate-x-1/2 transition-all duration-200 ease-in-out ${
        isOpen
          ? 'opacity-100 translate-y-0 visible'
          : 'opacity-0 -translate-y-1 invisible pointer-events-none'
      }`}
    >
      <div className="before:absolute before:inset-x-0 before:-top-3 before:h-3" />
      <div className="bg-white shadow-lg border-t border-sand">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-4 gap-6">
            {CATEGORIES.map(({ slug, image }) => (
              <Link
                key={slug}
                href={`/shop/${slug}`}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-sand">
                  <Image
                    src={image}
                    alt={t(`${slug}.label`)}
                    fill
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    sizes="(min-width: 1280px) 280px, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent pointer-events-none" />
                </div>
                <h3 className="font-serif text-lg text-charcoal group-hover:text-olive transition-colors">
                  {t(`${slug}.label`)}
                </h3>
                <p className="text-sm text-warm-gray mt-1">
                  {t(`${slug}.description`)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
