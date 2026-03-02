'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';

interface ProductImage {
  id: string;
  url: string;
  rank: number;
}

interface ProductGalleryProps {
  images: ProductImage[];
  thumbnail: string | null;
  title: string;
}

export default function ProductGallery({ images, thumbnail, title }: ProductGalleryProps) {
  // Build ordered list: sorted images, or fall back to thumbnail only
  const orderedImages =
    images.length > 0
      ? [...images].sort((a, b) => a.rank - b.rank).map((img) => img.url)
      : thumbnail
      ? [thumbnail]
      : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  if (orderedImages.length === 0) {
    return (
      <>
        <div className="hidden md:flex aspect-[3/4] rounded-lg overflow-hidden bg-sand/30 items-center justify-center">
          <Package className="w-16 h-16 text-warm-gray/20" strokeWidth={1} />
        </div>
        <div className="md:hidden aspect-[3/4] rounded-lg bg-sand/30 flex items-center justify-center">
          <Package className="w-16 h-16 text-warm-gray/20" strokeWidth={1} />
        </div>
      </>
    );
  }

  return (
    <>
      {/* ── Desktop ── */}
      <div className="hidden md:block">
        <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-sand/20">
          <Image
            src={orderedImages[activeIndex]}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 50vw, 600px"
            priority
          />
        </div>
        {orderedImages.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
            {orderedImages.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`relative w-16 h-20 rounded-md shrink-0 overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
                  i === activeIndex
                    ? 'border-olive'
                    : 'border-transparent opacity-60 hover:opacity-90'
                }`}
              >
                <Image
                  src={url}
                  alt={`${title} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Mobile carousel ── */}
      <div className="md:hidden">
        <div
          ref={scrollRef}
          onScroll={handleMobileScroll}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory rounded-lg"
        >
          {orderedImages.map((url, i) => (
            <div key={i} className="snap-start shrink-0 w-full aspect-[3/4] relative">
              <Image
                src={url}
                alt={`${title} ${i + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
        {orderedImages.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {orderedImages.map((_, i) => (
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
        )}
      </div>
    </>
  );
}
