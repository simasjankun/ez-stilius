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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-10">
            {/* Left: category columns */}
            <div className="flex-1 grid gap-8" style={{ gridTemplateColumns: `repeat(${Math.max(categories.length, 1)}, minmax(0, 1fr))` }}>
              {categories.length === 0 ? (
                <div />
              ) : (
                categories.map((cat) => (
                  <div key={cat.handle} className="min-w-0">
                    <Link
                      href={`/shop/${cat.handle}`}
                      className="block font-serif text-base font-semibold text-charcoal hover:text-olive transition-colors leading-snug"
                    >
                      {cat.name}
                    </Link>
                    <div className="w-8 h-0.5 bg-olive/40 my-2" />
                    {cat.category_children && cat.category_children.length > 0 && (
                      <ul className="space-y-1.5">
                        {cat.category_children.map((child) => (
                          <li key={child.handle}>
                            <Link
                              href={`/shop/${cat.handle}/${child.handle}`}
                              className="text-sm text-warm-gray hover:text-olive transition-colors leading-snug"
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

            {/* Right: promo block */}
            <div className="flex-shrink-0 w-[180px]">
              <Link href="/shop" className="group block">
                <div className="relative w-[180px] aspect-[3/4] rounded-lg overflow-hidden bg-sand">
                  <Image
                    src="/images/promo/mega-menu-promo.png"
                    alt={t('promo.title')}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="180px"
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-charcoal">
                  {t('promo.title')}
                </p>
              </Link>
            </div>
          </div>

          {/* Bottom: view all link */}
          <div className="mt-6 pt-5 border-t border-sand/60 flex justify-center">
            <Link
              href="/shop"
              className="flex items-center gap-1.5 text-sm text-olive hover:underline transition-colors"
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
