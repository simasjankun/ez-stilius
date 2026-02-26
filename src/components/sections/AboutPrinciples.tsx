'use client';

import { Leaf, Gem, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { LucideIcon } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';

const PRINCIPLES: { key: string; Icon: LucideIcon }[] = [
  { key: 'natural', Icon: Leaf },
  { key: 'quality', Icon: Gem },
  { key: 'longevity', Icon: Clock },
];

export default function AboutPrinciples() {
  const t = useTranslations('about.principles');

  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="text-xs uppercase tracking-widest text-olive text-center mb-12 md:mb-16">
            {t('label')}
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {PRINCIPLES.map(({ key, Icon }, i) => (
            <FadeIn key={key} delay={i * 100}>
              <div className="text-center">
                <Icon className="w-10 h-10 text-olive mx-auto mb-4" strokeWidth={1.5} />
                <h3 className="font-semibold text-charcoal mb-3">{t(`${key}.title`)}</h3>
                <p className="text-sm text-warm-gray leading-relaxed max-w-xs mx-auto">
                  {t(`${key}.text`)}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
