'use client';

import { useTranslations } from 'next-intl';
import { Heart, Leaf, Sparkles, Award } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const USP_ITEMS: { key: string; Icon: LucideIcon }[] = [
  { key: 'handmade', Icon: Heart },
  { key: 'natural', Icon: Leaf },
  { key: 'custom', Icon: Sparkles },
  { key: 'experience', Icon: Award },
];

export default function USPSection() {
  const t = useTranslations('home.usp');

  return (
    <section className="border-t border-sand py-16 md:py-24 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
          {USP_ITEMS.map(({ key, Icon }) => (
            <div key={key} className="text-center">
              <Icon className="w-8 h-8 md:w-10 md:h-10 text-olive mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="text-sm md:text-base font-semibold uppercase tracking-wide text-charcoal mb-2">
                {t(`${key}.title`)}
              </h3>
              <p className="text-sm text-warm-gray leading-relaxed max-w-[200px] mx-auto">
                {t(`${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
