'use client';

import { useState, useRef } from 'react';
import { Package } from 'lucide-react';

const SHADES = ['#E8E0D4', '#DED6CA', '#E2DAD0', '#EAE2D8', '#D8D0C6'];

interface ProductGalleryProps {
  imageCount: number;
}

export default function ProductGallery({ imageCount }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const images = Array.from({ length: imageCount }, (_, i) => SHADES[i % SHADES.length]);

  function handleMobileScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(index);
  }

  function scrollToImage(index: number) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
    setActiveIndex(index);
  }

  return (
    <>
      {/* ── Desktop ── */}
      <div className="hidden md:block">
        <div
          className="aspect-[3/4] rounded-lg overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: images[activeIndex] }}
        >
          <Package className="w-16 h-16 text-warm-gray/20" strokeWidth={1} />
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
          {images.map((bg, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative w-16 h-20 rounded-md shrink-0 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                i === activeIndex ? 'opacity-100' : 'opacity-50 hover:opacity-75'
              }`}
              style={{ backgroundColor: bg }}
            >
              <Package className="w-5 h-5 text-warm-gray/20" strokeWidth={1} />
              {i === activeIndex && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-olive rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Mobile carousel ── */}
      <div className="md:hidden">
        <div
          ref={scrollRef}
          onScroll={handleMobileScroll}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory rounded-lg"
        >
          {images.map((bg, i) => (
            <div
              key={i}
              className="snap-start shrink-0 w-full aspect-[3/4] flex items-center justify-center"
              style={{ backgroundColor: bg }}
            >
              <Package className="w-16 h-16 text-warm-gray/20" strokeWidth={1} />
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-3">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToImage(i)}
              className={`rounded-full transition-all duration-200 ${
                i === activeIndex ? 'w-4 h-2 bg-olive' : 'w-2 h-2 bg-sand hover:bg-warm-gray/40'
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
