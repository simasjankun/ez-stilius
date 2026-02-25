import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <h1 className="font-serif text-5xl md:text-7xl text-charcoal tracking-wide">
        {t('title')}
      </h1>
      <p className="mt-4 text-lg text-warm-gray">
        {t('subtitle')}
      </p>
    </section>
  );
}
