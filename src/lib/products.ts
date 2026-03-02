const MEDUSA_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://api.ezstilius.lt';
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

export const BATCH_SIZE = 20;

export interface FilterOption {
  value: string;
  label: string;
  id?: string;
}

export interface ProductsResult {
  products: any[];
  count: number;
}

export function getMedusaLocale(locale: string): string {
  return locale === 'lt' ? 'lt-LT' : 'en-GB';
}

function getMedusaHeaders(locale: string): Record<string, string> {
  return {
    'x-publishable-api-key': API_KEY,
    'Content-Type': 'application/json',
    'x-medusa-locale': getMedusaLocale(locale),
  };
}

export async function getRegionId(locale: string): Promise<string | null> {
  try {
    const res = await fetch(`${MEDUSA_URL}/store/regions`, {
      headers: getMedusaHeaders(locale),
      next: { revalidate: 300 },
    });
    const data = await res.json();
    return data.regions?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

export async function fetchProducts(options: {
  locale: string;
  regionId?: string | null;
  categoryIds?: string[];
  limit?: number;
  offset?: number;
  order?: string;
}): Promise<ProductsResult> {
  const { locale, regionId, categoryIds, limit = BATCH_SIZE, offset = 0, order } = options;
  const medusaLocale = getMedusaLocale(locale);

  // +options.values → available option values per product (e.g. Color: Yellow)
  // +variants.options → which option value each variant has selected
  let url = `${MEDUSA_URL}/store/products?limit=${limit}&offset=${offset}&locale=${medusaLocale}&fields=%2Boptions.values%2C%2Bvariants.options`;
  if (regionId) url += `&region_id=${regionId}`;
  if (order) url += `&order=${encodeURIComponent(order)}`;
  if (categoryIds?.length) {
    for (const id of categoryIds) {
      url += `&category_id[]=${encodeURIComponent(id)}`;
    }
  }

  try {
    const res = await fetch(url, {
      headers: getMedusaHeaders(locale),
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Products fetch failed: ${res.status}`);
    const data = await res.json();
    return { products: data.products || [], count: data.count || 0 };
  } catch (e) {
    console.error('Failed to fetch products:', e);
    return { products: [], count: 0 };
  }
}

/**
 * Compute price display data across ALL variants of a product.
 * Returns the minimum price, whether there's a price range, and an optional compare-at price.
 */
export function getProductPriceDisplay(product: any): {
  minPrice: number | null;
  compareAtPrice: number | null;
  isRange: boolean;
} {
  const variants: any[] = product.variants ?? [];
  if (!variants.length) return { minPrice: null, compareAtPrice: null, isRange: false };

  const prices: number[] = [];
  let lowestCompareAt: number | null = null;

  for (const variant of variants) {
    let amount: number | null = null;
    let origAmount: number | null = null;

    if (variant.calculated_price?.calculated_amount != null) {
      amount = Number(variant.calculated_price.calculated_amount);
      const orig = variant.calculated_price.original_amount;
      if (orig != null && Number(orig) !== amount) origAmount = Number(orig);
    } else {
      const eurPrice =
        variant.prices?.find((p: any) => p.currency_code === 'eur') ||
        variant.prices?.[0];
      if (eurPrice) amount = Number(eurPrice.amount);
    }

    if (amount != null) prices.push(amount);
    if (origAmount != null && (lowestCompareAt === null || origAmount < lowestCompareAt)) {
      lowestCompareAt = origAmount;
    }
  }

  if (!prices.length) return { minPrice: null, compareAtPrice: null, isRange: false };

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  return { minPrice, compareAtPrice: lowestCompareAt, isRange: minPrice !== maxPrice };
}

export function getProductPrice(product: any): {
  amount: number | null;
  compareAtAmount: number | null;
} {
  const variant = product.variants?.[0];
  if (!variant) return { amount: null, compareAtAmount: null };

  let amount: number | null = null;
  let compareAtAmount: number | null = null;

  if (variant.calculated_price) {
    amount =
      variant.calculated_price.calculated_amount != null
        ? Number(variant.calculated_price.calculated_amount)
        : null;
    const orig = variant.calculated_price.original_amount;
    if (orig != null && orig !== variant.calculated_price.calculated_amount) {
      compareAtAmount = Number(orig);
    }
  }

  if (amount === null) {
    const eurPrice =
      variant.prices?.find((p: any) => p.currency_code === 'eur') ||
      variant.prices?.[0];
    if (eurPrice) amount = Number(eurPrice.amount);
  }

  return { amount, compareAtAmount };
}

export function getProductImage(product: any): string | null {
  return product.thumbnail || product.images?.[0]?.url || null;
}

/**
 * Extract unique option types and their values from an array of products.
 * Returns [{title: 'Spalva', values: ['Raudona', 'Mėlyna']}, ...]
 */
export function extractProductOptions(
  products: any[],
): { title: string; values: string[] }[] {
  const optionMap = new Map<string, Set<string>>();

  for (const product of products) {
    for (const option of product.options ?? []) {
      const title = option.title as string;
      if (!optionMap.has(title)) optionMap.set(title, new Set());
      for (const v of option.values ?? []) {
        optionMap.get(title)!.add(v.value as string);
      }
    }
  }

  return Array.from(optionMap.entries()).map(([title, values]) => ({
    title,
    values: Array.from(values),
  }));
}

/**
 * Fetch a single product by handle (slug) from Medusa API.
 * Requests images, categories, and option data upfront for all product page steps.
 */
export async function fetchProductByHandle(
  handle: string,
  locale: string,
  regionId?: string | null,
): Promise<any | null> {
  const medusaLocale = getMedusaLocale(locale);
  // +images,+categories.id,+categories.name,+categories.handle,+options.values,+variants.options
  let url = `${MEDUSA_URL}/store/products?handle=${encodeURIComponent(handle)}&locale=${medusaLocale}&fields=%2Bimages%2C%2Bcategories.id%2C%2Bcategories.name%2C%2Bcategories.handle%2C%2Boptions.values%2C%2Bvariants.options%2C%2Bvariants.inventory_quantity%2C%2Bvariants.manage_inventory`;
  if (regionId) url += `&region_id=${regionId}`;

  try {
    const res = await fetch(url, {
      headers: getMedusaHeaders(locale),
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.products?.[0] ?? null;
  } catch {
    return null;
  }
}

/**
 * Filter products client-side by selected option values.
 * A product passes if ALL active filters match at least one of its variants.
 */
export function applyOptionFilters(
  products: any[],
  selectedOptions: Record<string, string[]>,
): any[] {
  const activeFilters = Object.entries(selectedOptions).filter(
    ([, vals]) => vals.length > 0,
  );
  if (!activeFilters.length) return products;

  return products.filter((product) =>
    activeFilters.every(([optionTitle, selectedVals]) => {
      const optionDef = product.options?.find(
        (o: any) => o.title === optionTitle,
      );
      if (!optionDef) return false;
      return product.variants?.some((variant: any) =>
        variant.options?.some(
          (vo: any) =>
            vo.option_id === optionDef.id && selectedVals.includes(vo.value),
        ),
      );
    }),
  );
}
