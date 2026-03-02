export const dynamic = 'force-dynamic';

import { getTranslations, getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getRegionId, fetchProductByHandle } from '@/lib/products';
import { getCategories, type MedusaCategory } from '@/lib/categories';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductGallery from '@/components/product/ProductGallery';
import ProductPurchaseSection from '@/components/product/ProductPurchaseSection';
import RelatedProductsSection from '@/components/product/RelatedProductsSection';

/** Find a category by ID in the full category tree (max 2 levels deep). */
function findCategoryInTree(
  categories: MedusaCategory[],
  targetId: string,
): { cat: MedusaCategory; parent: MedusaCategory | null } | null {
  for (const root of categories) {
    if (root.id === targetId) return { cat: root, parent: null };
    for (const child of root.category_children) {
      if (child.id === targetId) return { cat: child, parent: root };
    }
  }
  return null;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();

  const [tb, ts, regionId, allCategories] = await Promise.all([
    getTranslations('breadcrumb'),
    getTranslations('shop'),
    getRegionId(locale),
    getCategories(locale),
  ]);

  const product = await fetchProductByHandle(slug, locale, regionId);
  if (!product) notFound();

  // Resolve the product's primary category against the full category tree
  const productCategoryId = product.categories?.[0]?.id ?? null;
  const found = productCategoryId
    ? findCategoryInTree(allCategories, productCategoryId)
    : null;

  const breadcrumbs: { label: string; href?: string }[] = [
    { label: tb('home'), href: '/' },
    { label: ts('title'), href: '/shop' },
  ];

  if (found) {
    if (found.parent) {
      breadcrumbs.push({
        label: found.parent.name,
        href: `/shop/${found.parent.handle}`,
      });
      breadcrumbs.push({
        label: found.cat.name,
        href: `/shop/${found.parent.handle}/${found.cat.handle}`,
      });
    } else {
      breadcrumbs.push({
        label: found.cat.name,
        href: `/shop/${found.cat.handle}`,
      });
    }
  }

  // Category label shown above the product title
  const categoryLabel = found?.cat.name ?? null;

  return (
    <div className="bg-cream min-h-screen">
      {/* Breadcrumb bar */}
      <div className="border-b border-sand/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbs} />
        </div>
      </div>

      {/* Main product content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Left: image gallery */}
          <ProductGallery
            images={product.images ?? []}
            thumbnail={product.thumbnail ?? null}
            title={product.title}
          />

          {/* Right: product info */}
          <div className="mt-8 lg:mt-0">
            {categoryLabel && (
              <p className="text-xs uppercase tracking-widest text-olive mb-3">
                {categoryLabel}
              </p>
            )}

            <h1 className="font-serif text-2xl md:text-3xl text-charcoal leading-snug">
              {product.title}
            </h1>

            {/* Price, description, options, add-to-cart — client component */}
            <ProductPurchaseSection product={product} />
          </div>
        </div>
      </div>

      {/* Related products */}
      {productCategoryId && (
        <RelatedProductsSection
          currentProductId={product.id}
          categoryId={productCategoryId}
          regionId={regionId}
          locale={locale}
        />
      )}
    </div>
  );
}
