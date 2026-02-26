'use client';

import { useTranslations } from 'next-intl';
import { Camera, Instagram } from 'lucide-react';
import { CONTACT } from '@/constants/contact';

const GALLERY_IMAGES = [
  { id: 1, bg: '#E8E0D4', gridClass: 'row-span-2' },
  { id: 2, bg: '#DED6CA', gridClass: 'row-span-1' },
  { id: 3, bg: '#E2DAD0', gridClass: 'row-span-2' },
  { id: 4, bg: '#EAE2D8', gridClass: 'row-span-1' },
  { id: 5, bg: '#D8D0C6', gridClass: 'row-span-1' },
  { id: 6, bg: '#E5DDD3', gridClass: 'col-span-2 row-span-1' },
];

export default function GallerySection() {
  const t = useTranslations('home.gallery');

  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs uppercase tracking-widest text-olive font-medium mb-3">
            {t('label')}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal">
            {t('title')}
          </h2>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 grid-rows-[280px_280px] gap-4">
          {GALLERY_IMAGES.map((img) => (
            <div
              key={img.id}
              className={`relative rounded-lg overflow-hidden group ${img.gridClass}`}
              style={{ backgroundColor: img.bg }}
            >
              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <Camera
                  className="text-charcoal/20"
                  strokeWidth={1}
                  size={48}
                />
              </div>
              <div className="absolute inset-0 transition-all duration-500 group-hover:brightness-105" />
            </div>
          ))}
        </div>

        {/* Mobile grid — 2 columns, 4 images */}
        <div className="grid md:hidden grid-cols-2 gap-2">
          {GALLERY_IMAGES.slice(0, 4).map((img) => (
            <div
              key={img.id}
              className="relative rounded-lg overflow-hidden"
              style={{ backgroundColor: img.bg, height: '180px' }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera
                  className="text-charcoal/20"
                  strokeWidth={1}
                  size={36}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Instagram CTA */}
        <div className="mt-10 md:mt-12 flex items-center justify-center gap-3">
          <Instagram
            className="text-warm-gray"
            strokeWidth={1.5}
            size={16}
          />
          <span className="text-sm text-warm-gray">{t('followUs')}</span>
          <span className="block w-8 h-px bg-olive/40" />
          <a
            href={CONTACT.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-warm-gray hover:text-olive transition-colors duration-200"
          >
            {t('instagram')}
          </a>
        </div>
      </div>
    </section>
  );
}
