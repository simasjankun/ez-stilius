'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const CATEGORIES = [
  {
    slug: 'clothing',
    image: '/images/categories/category-clothing.png',
    key: 'clothing',
    large: true,
  },
  {
    slug: 'sewing-supplies',
    image: '/images/categories/category-sewing-supplies.png',
    key: 'sewing-supplies',
  },
  {
    slug: 'accessories',
    image: '/images/categories/category-accessories.png',
    key: 'accessories',
  },
  {
    slug: 'interior-gifts',
    image: '/images/categories/category-interior-gifts.png',
    key: 'interior-gifts',
    wide: true,
  },
] as const;

export default function CategoriesSection() {
  const t = useTranslations('home.categories');
  const tc = useTranslations('categories');

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-sm uppercase tracking-widest text-olive mb-2 block">
            {t('label')}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal">
            {t('title')}
          </h2>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              className={`group relative block overflow-hidden rounded-lg ${
                cat.large
                  ? 'md:col-span-2 md:row-span-2 h-[300px] md:h-[510px]'
                  : cat.wide
                    ? 'md:col-span-3 h-[250px]'
                    : 'h-[250px]'
              }`}
            >
              <Image
                src={cat.image}
                alt={tc(`${cat.key}.label`)}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes={
                  cat.large
                    ? '(min-width: 768px) 66vw, 100vw'
                    : cat.wide
                      ? '100vw'
                      : '(min-width: 768px) 33vw, 100vw'
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 transition-transform duration-300 group-hover:-translate-y-1">
                <h3
                  className={`font-serif text-cream ${
                    cat.large ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'
                  }`}
                >
                  {tc(`${cat.key}.label`)}
                </h3>
                <p className="text-cream/80 text-sm mt-1">
                  {tc(`${cat.key}.description`)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
