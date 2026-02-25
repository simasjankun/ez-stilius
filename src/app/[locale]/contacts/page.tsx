import { useTranslations } from 'next-intl';
import PageHero from '@/components/sections/PageHero';

export default function ContactsPage() {
  const t = useTranslations('contacts');
  const tb = useTranslations('breadcrumb');
  const tp = useTranslations('placeholder');

  return (
    <>
      <PageHero
        title={t('title')}
        breadcrumbs={[
          { label: tb('home'), href: '/' },
          { label: t('title') },
        ]}
      />
      <section className="min-h-[50vh] flex items-center justify-center px-4">
        <p className="text-warm-gray text-lg">{tp('content')}</p>
      </section>
    </>
  );
}
