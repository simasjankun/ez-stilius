import { use } from 'react';
import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { placeholderProducts } from '@/constants/placeholderProducts';
import { getCategoryBySlug } from '@/constants/categories';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import RelatedProducts from '@/components/product/RelatedProducts';

export function generateStaticParams() {
  return placeholderProducts.map((p) => ({ slug: p.slug }));
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const product = placeholderProducts.find((p) => p.slug === slug);

  if (!product) notFound();

  const t = useTranslations();
  const tb = useTranslations('breadcrumb');
  const ts = useTranslations('shop');

  const category = getCategoryBySlug(product.category);
  const categoryName = category ? t(`${category.translationKey}.name`) : '';
  const productName = t(product.nameKey);

  const breadcrumbs = [
    { label: tb('home'), href: '/' },
    { label: ts('title'), href: '/shop' },
    ...(category ? [{ label: categoryName, href: `/shop/${product.category}` }] : []),
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
