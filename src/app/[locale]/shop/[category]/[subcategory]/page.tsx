export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { getTranslations, getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getCategories } from '@/lib/categories';
import PageHero from '@/components/sections/PageHero';
import ProductGrid from '@/components/shop/ProductGrid';

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const { category: parentHandle, subcategory: childHandle } = await params;
  const locale = await getLocale();

  const [categories, t, tb] = await Promise.all([
    getCategories(locale),
    getTranslations('shop'),
    getTranslations('breadcrumb'),
  ]);

  const parent = categories.find((c) => c.handle === parentHandle);
  if (!parent) notFound();

  const child = parent.category_children?.find((c) => c.handle === childHandle);
  if (!child) notFound();

  return (
    <>
      <PageHero
        title={child.name}
        subtitle={child.description ?? ''}
        breadcrumbs={[
          { label: tb('home'), href: '/' },
          { label: t('title'), href: '/shop' },
          { label: parent.name, href: `/shop/${parentHandle}` },
          { label: child.name },
        ]}
      />
      <Suspense>
        <ProductGrid lockedCategory={childHandle} />
      </Suspense>
    </>
  );
}
