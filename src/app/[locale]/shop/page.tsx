import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import PageHero from '@/components/sections/PageHero';
import ProductGrid from '@/components/shop/ProductGrid';

export default function ShopPage() {
  const t = useTranslations('shop');
  const tb = useTranslations('breadcrumb');

  return (
    <>
      <PageHero
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[
          { label: tb('home'), href: '/' },
          { label: t('title') },
        ]}
      />
      <Suspense>
        <ProductGrid />
      </Suspense>
    </>
  );
}
