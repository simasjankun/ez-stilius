import { getTranslations } from 'next-intl/server';
import { fetchProducts, getProductPriceDisplay, getProductImage } from '@/lib/products';
import ProductCard from '@/components/ui/ProductCard';

interface RelatedProductsSectionProps {
  currentProductId: string;
  categoryId: string;
  regionId: string | null;
  locale: string;
}

export default async function RelatedProductsSection({
  currentProductId,
  categoryId,
  regionId,
  locale,
}: RelatedProductsSectionProps) {
  const [t, { products }] = await Promise.all([
    getTranslations('product'),
    fetchProducts({ locale, regionId, categoryIds: [categoryId], limit: 5 }),
  ]);

  const related = products.filter((p) => p.id !== currentProductId).slice(0, 4);
  if (!related.length) return null;

  return (
    <section className="py-16 border-t border-sand bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-widest text-olive mb-2">
            {t('relatedSubtitle')}
          </p>
          <h2 className="font-serif text-2xl text-charcoal">{t('relatedTitle')}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {related.map((product) => {
            const { minPrice, compareAtPrice, isRange } = getProductPriceDisplay(product);
            const image = getProductImage(product);
            const isNew =
              new Date(product.created_at) >
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const isSoldOut =
              (product.variants?.length ?? 0) > 0 &&
              product.variants.every(
                (v: any) =>
                  v.manage_inventory === true &&
                  typeof v.inventory_quantity === 'number' &&
                  v.inventory_quantity === 0,
              );
            return (
              <ProductCard
                key={product.id}
                slug={product.handle}
                name={product.title}
                price={minPrice ?? 0}
                originalPrice={compareAtPrice ?? undefined}
                isNew={isNew}
                isRange={isRange}
                image={image ?? undefined}
                isSoldOut={isSoldOut}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
