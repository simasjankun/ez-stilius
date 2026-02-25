'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function HomeHero() {
  const t = useTranslations('home.hero');

  return (
    <section className="relative min-h-[70vh] md:min-h-[calc(100vh-10rem)] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream to-sand/50" />

      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-olive)_0%,_transparent_70%)] opacity-[0.07]" />

      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232D2A26' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <h1
          className="font-serif text-charcoal animate-[heroFadeUp_800ms_ease-out_both]"
        >
          <span className="block text-3xl md:text-5xl lg:text-7xl tracking-wide">
            {t('title')}
          </span>
          <span className="block text-3xl md:text-5xl lg:text-7xl tracking-wide italic font-light mt-1">
            {t('titleAccent')}
          </span>
        </h1>

        {/* Decorative flourish */}
        <div className="flex items-center justify-center gap-3 my-6 md:my-8 animate-[heroFadeUp_800ms_ease-out_200ms_both]">
          <div className="h-px w-8 bg-olive/40" />
          <span className="text-olive/40 text-sm">✦</span>
          <div className="h-px w-8 bg-olive/40" />
        </div>

        <p className="text-base md:text-lg lg:text-xl text-warm-gray max-w-xl mx-auto leading-relaxed animate-[heroFadeUp_800ms_ease-out_400ms_both]">
          {t('subtitle')}
        </p>

        <div className="mt-8 md:mt-10 animate-[heroFadeUp_800ms_ease-out_600ms_both]">
          <Link
            href="/shop"
            className="inline-block bg-olive text-cream px-8 py-4 rounded-sm text-sm tracking-widest uppercase font-medium hover:bg-olive-dark transition-colors duration-300 cursor-pointer"
          >
            {t('cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
