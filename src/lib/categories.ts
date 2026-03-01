import { medusaFetch } from './medusa';

export interface MedusaCategory {
  id: string;
  name: string;
  handle: string;
  description: string | null;
  parent_category_id: string | null;
  category_children: MedusaCategory[];
}

export async function getCategories(locale: string): Promise<MedusaCategory[]> {
  try {
    const data = await medusaFetch<{ product_categories: MedusaCategory[] }>(
      `/store/product-categories?include_descendants_tree=true&locale=${locale === 'lt' ? 'lt-LT' : 'en-GB'}`,
      locale,
    );
    return (data.product_categories || []).filter((cat) => !cat.parent_category_id);
  } catch (err) {
    console.error('Failed to fetch categories from Medusa:', err);
    return [];
  }
}
