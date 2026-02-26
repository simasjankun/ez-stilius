import { useTranslations } from 'next-intl';
import PageHero from '@/components/sections/PageHero';

export default function TermsPage() {
  const t = useTranslations('terms');
  const tb = useTranslations('breadcrumb');

  return (
    <>
      <PageHero
        title={t('title')}
        breadcrumbs={[
          { label: tb('home'), href: '/' },
          { label: t('title') },
        ]}
      />
      <div className="bg-cream py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl text-charcoal mb-4">{t('comingSoon')}</h2>
          <p className="text-warm-gray">{t('comingSoonSubtitle')}</p>
        </div>
      </div>
    </>
  );
}
