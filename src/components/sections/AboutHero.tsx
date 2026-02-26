'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import FadeIn from '@/components/ui/FadeIn';

export default function AboutHero() {
  const t = useTranslations('about');

  return (
    <section className="bg-sand/20 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
          {/* Photo */}
          <FadeIn className="w-full md:w-[45%] shrink-0" delay={0}>
            <div className="relative w-full aspect-[4/3] md:aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src="/images/about/egle.jpg"
                alt="Eglė Žemgulienė"
                fill
                className="object-cover object-top"
                sizes="(min-width: 768px) 45vw, 100vw"
                priority
              />
            </div>
          </FadeIn>

          {/* Text */}
          <div className="flex-1">
            <FadeIn delay={150}>
              <blockquote className="font-serif text-2xl md:text-3xl text-charcoal italic leading-snug">
                „{t('hero.quote')}"
              </blockquote>
              <div className="w-16 h-0.5 bg-olive/50 my-6" />
            </FadeIn>
            <FadeIn delay={250}>
              <p className="text-lg text-warm-gray leading-relaxed">{t('hero.intro')}</p>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
