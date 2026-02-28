'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import type { MedusaCategory } from '@/lib/categories';

interface MegaMenuProps {
  isOpen: boolean;
  categories: MedusaCategory[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function MegaMenu({
  isOpen,
  categories = [],
  onMouseEnter,
  onMouseLeave,
}: MegaMenuProps) {
  const t = useTranslations('nav.megaMenu');

  return (
    <div
      className={`absolute left-[calc(-50vw+50%)] top-full z-40 w-screen transition-all duration-200 ease-out ${
        isOpen
          ? 'opacity-100 translate-y-0 visible'
          : 'opacity-0 -translate-y-1 invisible pointer-events-none'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Invisible bridge to prevent gap between nav link and menu */}
      <div className="absolute inset-x-0 -top-3 h-3" />

      <div className="bg-[#FAF8F5] border-t border-sand shadow-lg shadow-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">

          {/* Categories + Promo */}
          <div className="flex gap-8">

            {/* Category columns */}
            <div
              className="flex-1 grid gap-5"
              style={{ gridTemplateColumns: `repeat(${Math.max(categories.length, 1)}, minmax(0, 1fr))` }}
            >
              {categories.length === 0 ? (
                <div />
              ) : (
                categories.map((cat, i) => (
                  <div
                    key={cat.handle}
                    className="min-w-0"
                    style={{
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? 'translateY(0)' : 'translateY(-4px)',
                      transitionProperty: 'opacity, transform',
                      transitionDuration: '200ms',
                      transitionDelay: isOpen ? `${i * 50}ms` : '0ms',
                    }}
                  >
                    <Link
                      href={`/shop/${cat.handle}`}
                      className="block font-serif text-base font-semibold text-charcoal hover:text-olive transition-colors leading-snug"
                    >
                      {cat.name}
                    </Link>
                    <div className="w-8 h-0.5 bg-olive/40 mt-1 mb-2" />
                    {cat.category_children && cat.category_children.length > 0 && (
                      <ul className="flex flex-col gap-1">
                        {cat.category_children.map((child) => (
                          <li key={child.handle}>
                            <Link
                              href={`/shop/${cat.handle}/${child.handle}`}
                              className="text-sm text-warm-gray hover:text-olive transition-colors leading-relaxed"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Promo block — h-full so categories define the row height, not the image */}
            <div className="flex-shrink-0 w-[180px]">
              <Link
                href="/shop"
                className="relative block h-full min-h-[120px] w-[180px] rounded-xl overflow-hidden bg-sand transition-transform duration-300 hover:scale-[1.02]"
              >
                <Image
                  src="/images/promo/mega-menu-promo.png"
                  alt={t('promo.title')}
                  fill
                  className="object-cover"
                  sizes="180px"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                {/* Text on image */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="flex items-center gap-1 text-sm font-medium text-white leading-snug">
                    {t('promo.title')}
                    <ArrowRight className="h-3.5 w-3.5 flex-shrink-0" />
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* View all link */}
          <div className="mt-3 pt-3 border-t border-sand/60 flex justify-center">
            <Link
              href="/shop"
              className="flex items-center gap-1.5 text-sm font-medium text-olive hover:text-olive-dark transition-colors"
            >
              {t('viewAll')}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
