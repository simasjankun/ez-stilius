'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';

export default function AboutStrip() {
  const t = useTranslations('home.about');

  return (
    <section className="bg-sand/40 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Photo */}
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/images/about/egle.jpg"
              alt="Eglė"
              fill
              className="object-cover object-top"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>

          {/* Text content */}
          <div className="text-center md:text-left">
            <blockquote className="font-serif italic text-xl md:text-2xl lg:text-3xl text-charcoal leading-snug">
              &bdquo;{t('quote')}&ldquo;
            </blockquote>

            <div className="my-6">
              <div className="w-15 h-px bg-olive/50 mx-auto md:mx-0" />
            </div>

            <p className="text-warm-gray text-base md:text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
              {t('text')}
            </p>

            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 mt-6 text-sm uppercase tracking-widest font-medium text-olive hover:underline transition-colors cursor-pointer"
            >
              {t('cta')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
