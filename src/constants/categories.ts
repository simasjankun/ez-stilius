export const categories = [
  { slug: 'clothing', translationKey: 'categories.clothing' },
  { slug: 'sewing-supplies', translationKey: 'categories.sewingSupplies' },
  { slug: 'accessories', translationKey: 'categories.accessories' },
  { slug: 'interior-gifts', translationKey: 'categories.interiorGifts' },
] as const;

export type CategorySlug = (typeof categories)[number]['slug'];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
