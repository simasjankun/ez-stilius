import { getLocale } from 'next-intl/server';
import { medusaFetch } from '@/lib/medusa';
import { getProductPriceDisplay } from '@/lib/products';
import FeaturedProducts, { FeaturedProduct } from './FeaturedProducts';

async function getFeaturedProducts(locale: string): Promise<FeaturedProduct[]> {
  const medusaLocale = locale === 'lt' ? 'lt-LT' : 'en-GB';
  try {
    const [regionsData, collectionsData] = await Promise.all([
      medusaFetch<{ regions: { id: string }[] }>('/store/regions', locale),
      medusaFetch<{ collections: { id: string }[] }>(
        '/store/collections?handle[]=featured',
        locale,
      ),
    ]);

    const regionId = regionsData.regions?.[0]?.id;
    const collectionId = collectionsData.collections?.[0]?.id;
    if (!collectionId) return [];

    let url = `/store/products?collection_id[]=${collectionId}&limit=8&locale=${medusaLocale}`;
    if (regionId) url += `&region_id=${regionId}`;

    const productsData = await medusaFetch<{ products: any[] }>(url, locale);

    return (productsData.products || [])
      .map((p): FeaturedProduct | null => {
        const { minPrice, isRange } = getProductPriceDisplay(p);
        if (minPrice == null) return null;
        return {
          id: p.id,
          handle: p.handle,
          title: p.title,
          image: p.thumbnail ?? p.images?.[0]?.url ?? undefined,
          price: minPrice,
          isRange,
        };
      })
      .filter((p): p is FeaturedProduct => p !== null);
  } catch (err) {
    console.error('Failed to fetch featured products:', err);
    return [];
  }
}

export default async function FeaturedProductsServer() {
  const locale = await getLocale();
  const products = await getFeaturedProducts(locale);
  if (!products.length) return null;
  return <FeaturedProducts products={products} />;
}
