export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { getTranslations, getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getCategories } from '@/lib/categories';
import { getRegionId, fetchProducts, BATCH_SIZE } from '@/lib/products';
import PageHero from '@/components/sections/PageHero';
import ProductGrid from '@/components/shop/ProductGrid';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: handle } = await params;
  const locale = await getLocale();

  const [categories, t, tb, regionId] = await Promise.all([
    getCategories(locale),
    getTranslations('shop'),
    getTranslations('breadcrumb'),
    getRegionId(locale),
  ]);

  const category = categories.find((c) => c.handle === handle);
  if (!category) notFound();

  const { products: initialProducts, count: initialCount } = await fetchProducts({
    locale,
    regionId,
    categoryIds: [category.id],
    order: '-created_at',
    limit: BATCH_SIZE,
  });

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
        <ProductGrid
          lockedCategory={handle}
          lockedCategoryId={category.id}
          initialProducts={initialProducts}
          initialCount={initialCount}
          regionId={regionId}
        />
      </Suspense>
    </>
  );
}
