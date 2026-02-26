'use client';

import Image from 'next/image';
import FadeIn from '@/components/ui/FadeIn';

interface AboutStoryProps {
  image: string;
  imageAlt: string;
  label: string;
  text: string;
  /** When true: text left, image right. When false (default): image left, text right. */
  reversed?: boolean;
  bg?: string;
}

export default function AboutStory({
  image,
  imageAlt,
  label,
  text,
  reversed = false,
  bg = 'bg-cream',
}: AboutStoryProps) {
  const paragraphs = text.split('\n\n').filter(Boolean);

  const imageEl = (
    <FadeIn className="w-full md:w-1/2 shrink-0" delay={reversed ? 150 : 0}>
      <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>
    </FadeIn>
  );

  const textEl = (
    <div className="flex-1">
      <FadeIn delay={reversed ? 0 : 100}>
        <p className="text-xs uppercase tracking-widest text-olive mb-5">{label}</p>
        <div className="space-y-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-base md:text-lg text-warm-gray leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </FadeIn>
    </div>
  );

  return (
    <section className={`${bg} py-16 md:py-24`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/*
          DOM order always: text, image — so mobile (flex-col) shows text first.
          Desktop: reversed=true → flex-row (text left, image right)
                   reversed=false → flex-row-reverse (image left, text right)
        */}
        <div
          className={`flex flex-col gap-12 md:gap-16 items-center ${
            reversed ? 'md:flex-row' : 'md:flex-row-reverse'
          }`}
        >
          {textEl}
          {imageEl}
        </div>
      </div>
    </section>
  );
}
