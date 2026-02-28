export interface PlaceholderProduct {
  id: string;
  slug: string;
  nameKey: string;
  price: number;
  originalPrice?: number;
  category: string;
  isNew?: boolean;
  createdAt: string;
  colors?: string[];
  descriptionKey: string;
  details: {
    materialKey?: string;
    sizes?: string[];
    careKey?: string;
  };
  images: number;
}

export const placeholderProducts: PlaceholderProduct[] = [
  // accessories
  {
    id: '1', slug: 'autumn-scarf', nameKey: 'products.placeholder.autumnScarf',
    price: 39.00, category: 'accessories', createdAt: '2024-09-15',
    colors: ['cream', 'olive'],
    descriptionKey: 'products.descriptions.autumnScarf',
    details: { materialKey: 'products.materials.autumnScarf', careKey: 'products.care.autumnScarf' },
    images: 4,
  },
  {
    id: '7', slug: 'bow-tie', nameKey: 'products.placeholder.bowTie',
    price: 9.99, category: 'accessories', createdAt: '2024-08-20',
    colors: ['olive'],
    descriptionKey: 'products.descriptions.bowTie',
    details: { materialKey: 'products.materials.bowTie', careKey: 'products.care.bowTie' },
    images: 3,
  },
  {
    id: '8', slug: 'summer-shawl', nameKey: 'products.placeholder.summerShawl',
    price: 64.00, category: 'accessories', createdAt: '2024-07-10',
    colors: ['cream', 'lavender'],
    descriptionKey: 'products.descriptions.summerShawl',
    details: { materialKey: 'products.materials.summerShawl', careKey: 'products.care.summerShawl' },
    images: 4,
  },
  {
    id: '9', slug: 'winter-mittens', nameKey: 'products.placeholder.winterMittens',
    price: 28.00, category: 'accessories', isNew: true, createdAt: '2024-11-20',
    colors: ['pink', 'sage'],
    descriptionKey: 'products.descriptions.winterMittens',
    details: { materialKey: 'products.materials.winterMittens', sizes: ['S/M', 'M/L'], careKey: 'products.care.winterMittens' },
    images: 4,
  },

  // interior-gifts
  {
    id: '2', slug: 'lace-tablecloth', nameKey: 'products.placeholder.laceTablecloth',
    price: 59.00, category: 'interior', createdAt: '2024-08-05',
    colors: ['cream'],
    descriptionKey: 'products.descriptions.laceTablecloth',
    details: { materialKey: 'products.materials.laceTablecloth', careKey: 'products.care.laceTablecloth' },
    images: 3,
  },
  {
    id: '6', slug: 'linen-napkins', nameKey: 'products.placeholder.linenNapkins',
    price: 17.00, category: 'interior', createdAt: '2024-06-18',
    colors: ['cream', 'sand'],
    descriptionKey: 'products.descriptions.linenNapkins',
    details: { materialKey: 'products.materials.linenNapkins', careKey: 'products.care.linenNapkins' },
    images: 3,
  },
  {
    id: '10', slug: 'woven-basket', nameKey: 'products.placeholder.wovenBasket',
    price: 34.00, originalPrice: 42.00, category: 'interior', createdAt: '2024-09-01',
    colors: ['sand'],
    descriptionKey: 'products.descriptions.wovenBasket',
    details: { materialKey: 'products.materials.wovenBasket', careKey: 'products.care.wovenBasket' },
    images: 3,
  },
  {
    id: '11', slug: 'candle-cozy', nameKey: 'products.placeholder.candleCozy',
    price: 22.00, category: 'interior', isNew: true, createdAt: '2024-11-01',
    colors: ['lavender'],
    descriptionKey: 'products.descriptions.candleCozy',
    details: { materialKey: 'products.materials.candleCozy', careKey: 'products.care.candleCozy' },
    images: 3,
  },

  // clothing
  {
    id: '3', slug: 'baby-cardigan', nameKey: 'products.placeholder.babyCardigan',
    price: 45.00, category: 'clothing', createdAt: '2024-07-22',
    colors: ['pink', 'sage'],
    descriptionKey: 'products.descriptions.babyCardigan',
    details: { materialKey: 'products.materials.babyCardigan', sizes: ['56/62', '68/74', '80/86'], careKey: 'products.care.babyCardigan' },
    images: 5,
  },
  {
    id: '5', slug: 'knitted-dress', nameKey: 'products.placeholder.knittedDress',
    price: 76.00, category: 'clothing', createdAt: '2024-08-30',
    colors: ['dusty-rose'],
    descriptionKey: 'products.descriptions.knittedDress',
    details: { materialKey: 'products.materials.knittedDress', sizes: ['XS', 'S', 'M', 'L', 'XL'], careKey: 'products.care.knittedDress' },
    images: 5,
  },
  {
    id: '12', slug: 'knit-sweater', nameKey: 'products.placeholder.knitSweater',
    price: 89.00, category: 'clothing', isNew: true, createdAt: '2024-12-01',
    colors: ['olive', 'sand'],
    descriptionKey: 'products.descriptions.knitSweater',
    details: { materialKey: 'products.materials.knitSweater', sizes: ['XS', 'S', 'M', 'L', 'XL'], careKey: 'products.care.knitSweater' },
    images: 5,
  },
  {
    id: '13', slug: 'linen-blouse', nameKey: 'products.placeholder.linenBlouse',
    price: 52.00, originalPrice: 65.00, category: 'clothing', createdAt: '2024-10-15',
    colors: ['cream'],
    descriptionKey: 'products.descriptions.linenBlouse',
    details: { materialKey: 'products.materials.linenBlouse', sizes: ['XS', 'S', 'M', 'L'], careKey: 'products.care.linenBlouse' },
    images: 5,
  },

  // sewing-supplies
  {
    id: '4', slug: 'crochet-hooks-set', nameKey: 'products.placeholder.crochetHooksSet',
    price: 12.99, category: 'craft-supplies', createdAt: '2024-06-01',
    descriptionKey: 'products.descriptions.crochetHooksSet',
    details: { materialKey: 'products.materials.crochetHooksSet', careKey: 'products.care.crochetHooksSet' },
    images: 3,
  },
  {
    id: '14', slug: 'yarn-bundle', nameKey: 'products.placeholder.yarnBundle',
    price: 18.00, originalPrice: 24.00, category: 'craft-supplies', isNew: true, createdAt: '2024-11-15',
    colors: ['cream', 'olive', 'pink'],
    descriptionKey: 'products.descriptions.yarnBundle',
    details: { materialKey: 'products.materials.yarnBundle', careKey: 'products.care.yarnBundle' },
    images: 3,
  },
  {
    id: '15', slug: 'fabric-scissors', nameKey: 'products.placeholder.fabricScissors',
    price: 14.00, category: 'craft-supplies', createdAt: '2024-07-05',
    descriptionKey: 'products.descriptions.fabricScissors',
    details: { materialKey: 'products.materials.fabricScissors', careKey: 'products.care.fabricScissors' },
    images: 3,
  },
  {
    id: '16', slug: 'stitch-markers', nameKey: 'products.placeholder.stitchMarkers',
    price: 7.50, category: 'craft-supplies', createdAt: '2024-09-10',
    descriptionKey: 'products.descriptions.stitchMarkers',
    details: { materialKey: 'products.materials.stitchMarkers', careKey: 'products.care.stitchMarkers' },
    images: 3,
  },
];
