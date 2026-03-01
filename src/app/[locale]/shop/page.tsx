export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { getTranslations, getLocale } from 'next-intl/server';
import { getCategories } from '@/lib/categories';
import { getRegionId, fetchProducts, BATCH_SIZE } from '@/lib/products';
import PageHero from '@/components/sections/PageHero';
import ProductGrid from '@/components/shop/ProductGrid';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { category: catParam, sort: sortParam } = await searchParams;
  const locale = await getLocale();

  const [t, tb, categories, regionId] = await Promise.all([
    getTranslations('shop'),
    getTranslations('breadcrumb'),
    getCategories(locale),
    getRegionId(locale),
  ]);

  const categoryOptions = categories.map((cat) => ({
    value: cat.handle,
    label: cat.name,
    id: cat.id,
  }));

  // Resolve initial category filter from URL
  const catHandles = catParam?.split(',').filter(Boolean) ?? [];
  const catIds = catHandles
    .map((h) => categories.find((c) => c.handle === h)?.id)
    .filter((id): id is string => !!id);

  const apiOrder = sortParam === 'name-az' ? 'title' : '-created_at';

  const { products: initialProducts, count: initialCount } = await fetchProducts({
    locale,
    regionId,
    categoryIds: catIds.length ? catIds : undefined,
    order: apiOrder,
    limit: BATCH_SIZE,
  });

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
        <ProductGrid
          categoryOptions={categoryOptions}
          initialProducts={initialProducts}
          initialCount={initialCount}
          regionId={regionId}
        />
      </Suspense>
    </>
  );
}
