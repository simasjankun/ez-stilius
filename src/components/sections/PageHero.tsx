'use client';

import Breadcrumb from '@/components/ui/Breadcrumb';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs: { label: string; href?: string }[];
}

export default function PageHero({ title, subtitle, breadcrumbs }: PageHeroProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sand/40 via-sand/20 to-cream" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <div className="animate-[heroFadeUp_600ms_ease-out_both]">
          <Breadcrumb items={breadcrumbs} />
        </div>

        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal tracking-wide mt-6 animate-[heroFadeUp_600ms_ease-out_100ms_both]">
          {title}
        </h1>

        {subtitle && (
          <p className="text-base md:text-lg text-warm-gray mt-4 max-w-xl mx-auto animate-[heroFadeUp_600ms_ease-out_200ms_both]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
