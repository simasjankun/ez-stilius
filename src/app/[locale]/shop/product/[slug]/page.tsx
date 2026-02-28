import { getTranslations, getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { placeholderProducts } from '@/constants/placeholderProducts';
import { getCategories } from '@/lib/categories';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import RelatedProducts from '@/components/product/RelatedProducts';

export function generateStaticParams() {
  return placeholderProducts.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = placeholderProducts.find((p) => p.slug === slug);

  if (!product) notFound();

  const locale = await getLocale();
  const [t, tb, ts, categories] = await Promise.all([
    getTranslations(),
    getTranslations('breadcrumb'),
    getTranslations('shop'),
    getCategories(locale),
  ]);

  const apiCategory = categories.find((c) => c.handle === product.category);
  const categoryName = apiCategory?.name ?? '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productName = t(product.nameKey as any);

  const breadcrumbs = [
    { label: tb('home'), href: '/' },
    { label: ts('title'), href: '/shop' },
    ...(apiCategory
      ? [{ label: categoryName, href: `/shop/${product.category}` }]
      : []),
    { label: productName },
  ];

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
          <ProductGallery imageCount={product.images} />
          <ProductInfo product={product} categoryName={categoryName} />
        </div>
      </div>

      {/* Related products */}
      <RelatedProducts currentSlug={slug} category={product.category} />
    </div>
  );
}
