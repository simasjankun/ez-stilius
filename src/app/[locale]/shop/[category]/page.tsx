export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { getTranslations, getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getCategories } from '@/lib/categories';
import PageHero from '@/components/sections/PageHero';
import ProductGrid from '@/components/shop/ProductGrid';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: handle } = await params;
  const locale = await getLocale();

  const [categories, t, tb] = await Promise.all([
    getCategories(locale),
    getTranslations('shop'),
    getTranslations('breadcrumb'),
  ]);

  const category = categories.find((c) => c.handle === handle);
  if (!category) notFound();

  return (
    <>
      <PageHero
        title={category.name}
        subtitle={category.description ?? ''}
        breadcrumbs={[
          { label: tb('home'), href: '/' },
          { label: t('title'), href: '/shop' },
          { label: category.name },
        ]}
      />
      <Suspense>
        <ProductGrid lockedCategory={handle} />
      </Suspense>
    </>
  );
}
