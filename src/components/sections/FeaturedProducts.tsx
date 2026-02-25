'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { placeholderProducts } from '@/constants/placeholderProducts';
import ProductCard from '@/components/ui/ProductCard';

export default function FeaturedProducts() {
  const t = useTranslations('home.featured');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  function scroll(direction: 'left' | 'right') {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    const scrollAmount = card ? card.offsetWidth + 24 : 300;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading row */}
        <div className="flex items-end justify-between mb-10 md:mb-12">
          <div>
            <span className="text-sm uppercase tracking-widest text-olive mb-2 block">
              {t('label')}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal">
              {t('title')}
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`cursor-pointer w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                canScrollLeft
                  ? 'bg-sand text-charcoal hover:bg-olive hover:text-cream'
                  : 'bg-sand/50 text-warm-gray/40 cursor-default'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`cursor-pointer w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                canScrollRight
                  ? 'bg-sand text-charcoal hover:bg-olive hover:text-cream'
                  : 'bg-sand/50 text-warm-gray/40 cursor-default'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
        >
          {placeholderProducts.map((product) => (
            <div
              key={product.id}
              data-card
              className="snap-start shrink-0 w-[70vw] sm:w-[45vw] md:w-[calc(25%-18px)]"
            >
              <ProductCard
                slug={product.slug}
                nameKey={product.nameKey}
                price={product.price}
              />
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm text-olive hover:underline transition-colors"
          >
            {t('viewAll')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
