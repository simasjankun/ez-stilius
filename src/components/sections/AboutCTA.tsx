'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import FadeIn from '@/components/ui/FadeIn';

export default function AboutCTA() {
  const t = useTranslations('about.cta');

  return (
    <section className="bg-sand/40 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <p className="font-serif text-xl md:text-2xl text-charcoal mb-8 max-w-xl mx-auto leading-snug">
            {t('text')}
          </p>
          <Link
            href="/contacts"
            className="inline-block bg-olive text-cream px-8 py-4 rounded-sm text-sm tracking-widest uppercase font-medium hover:bg-olive-dark transition-colors duration-300"
          >
            {t('button')}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
