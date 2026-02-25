import { useTranslations } from 'next-intl';
import HomeHero from '@/components/sections/HomeHero';

export default function HomePage() {
  const t = useTranslations('placeholder');

  return (
    <>
      <HomeHero />
      <section className="min-h-[50vh] flex items-center justify-center px-4">
        <p className="text-warm-gray text-lg">{t('content')}</p>
      </section>
    </>
  );
}
