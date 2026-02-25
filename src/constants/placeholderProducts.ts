export interface PlaceholderProduct {
  id: string;
  slug: string;
  nameKey: string;
  price: number;
  category: string;
}

export const placeholderProducts: PlaceholderProduct[] = [
  { id: '1', slug: 'autumn-scarf', nameKey: 'products.placeholder.autumnScarf', price: 39.0, category: 'accessories' },
  { id: '2', slug: 'lace-tablecloth', nameKey: 'products.placeholder.laceTablecloth', price: 59.0, category: 'interior-gifts' },
  { id: '3', slug: 'baby-cardigan', nameKey: 'products.placeholder.babyCardigan', price: 45.0, category: 'clothing' },
  { id: '4', slug: 'crochet-hooks-set', nameKey: 'products.placeholder.crochetHooksSet', price: 12.99, category: 'sewing-supplies' },
  { id: '5', slug: 'knitted-dress', nameKey: 'products.placeholder.knittedDress', price: 76.0, category: 'clothing' },
  { id: '6', slug: 'linen-napkins', nameKey: 'products.placeholder.linenNapkins', price: 17.0, category: 'interior-gifts' },
  { id: '7', slug: 'bow-tie', nameKey: 'products.placeholder.bowTie', price: 9.99, category: 'accessories' },
  { id: '8', slug: 'summer-shawl', nameKey: 'products.placeholder.summerShawl', price: 64.0, category: 'accessories' },
];
