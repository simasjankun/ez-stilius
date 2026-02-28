import { Suspense } from 'react';
import { getTranslations, getLocale } from 'next-intl/server';
import { getCategories } from '@/lib/categories';
import PageHero from '@/components/sections/PageHero';
import ProductGrid from '@/components/shop/ProductGrid';

export default async function ShopPage() {
  const locale = await getLocale();
  const [t, tb, categories] = await Promise.all([
    getTranslations('shop'),
    getTranslations('breadcrumb'),
    getCategories(locale),
  ]);

  const categoryOptions = categories.map((cat) => ({
    value: cat.handle,
    label: cat.name,
  }));

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
        <ProductGrid categoryOptions={categoryOptions} />
      </Suspense>
    </>
  );
}
