'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { placeholderProducts } from '@/constants/placeholderProducts';
import ProductCard from '@/components/ui/ProductCard';

interface RelatedProductsProps {
  currentSlug: string;
  category: string;
}

export default function RelatedProducts({ currentSlug, category }: RelatedProductsProps) {
  const t = useTranslations('product');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const sameCategory = placeholderProducts.filter(
    (p) => p.category === category && p.slug !== currentSlug
  );
  const others = placeholderProducts.filter(
    (p) => p.category !== category && p.slug !== currentSlug
  );
  const related = [...sameCategory, ...others].slice(0, 4);

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
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }

  if (related.length === 0) return null;

  return (
    <section className="py-16 border-t border-sand bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-serif text-2xl text-charcoal">{t('relatedProducts')}</h2>
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                canScrollLeft
                  ? 'bg-sand text-charcoal hover:bg-olive hover:text-cream'
                  : 'bg-sand/50 text-warm-gray/40 cursor-default'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                canScrollRight
                  ? 'bg-sand text-charcoal hover:bg-olive hover:text-cream'
                  : 'bg-sand/50 text-warm-gray/40 cursor-default'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
        >
          {related.map((product) => (
            <div
              key={product.id}
              data-card
              className="snap-start shrink-0 w-[70vw] sm:w-[45vw] md:w-[calc(25%-18px)]"
            >
              <ProductCard
                slug={product.slug}
                nameKey={product.nameKey}
                price={product.price}
                originalPrice={product.originalPrice}
                isNew={product.isNew}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
