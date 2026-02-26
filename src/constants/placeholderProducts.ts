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
}

export const placeholderProducts: PlaceholderProduct[] = [
  // accessories
  { id: '1',  slug: 'autumn-scarf',      nameKey: 'products.placeholder.autumnScarf',      price: 39.00, category: 'accessories',     createdAt: '2024-09-15', colors: ['cream', 'olive'] },
  { id: '7',  slug: 'bow-tie',           nameKey: 'products.placeholder.bowTie',           price: 9.99,  category: 'accessories',     createdAt: '2024-08-20', colors: ['olive'] },
  { id: '8',  slug: 'summer-shawl',      nameKey: 'products.placeholder.summerShawl',      price: 64.00, category: 'accessories',     createdAt: '2024-07-10', colors: ['cream', 'lavender'] },
  { id: '9',  slug: 'winter-mittens',    nameKey: 'products.placeholder.winterMittens',    price: 28.00, category: 'accessories',     isNew: true, createdAt: '2024-11-20', colors: ['pink', 'sage'] },

  // interior-gifts
  { id: '2',  slug: 'lace-tablecloth',   nameKey: 'products.placeholder.laceTablecloth',   price: 59.00, category: 'interior-gifts',  createdAt: '2024-08-05', colors: ['cream'] },
  { id: '6',  slug: 'linen-napkins',     nameKey: 'products.placeholder.linenNapkins',     price: 17.00, category: 'interior-gifts',  createdAt: '2024-06-18', colors: ['cream', 'sand'] },
  { id: '10', slug: 'woven-basket',      nameKey: 'products.placeholder.wovenBasket',      price: 34.00, originalPrice: 42.00, category: 'interior-gifts', createdAt: '2024-09-01', colors: ['sand'] },
  { id: '11', slug: 'candle-cozy',       nameKey: 'products.placeholder.candleCozy',       price: 22.00, category: 'interior-gifts',  isNew: true, createdAt: '2024-11-01', colors: ['lavender'] },

  // clothing
  { id: '3',  slug: 'baby-cardigan',     nameKey: 'products.placeholder.babyCardigan',     price: 45.00, category: 'clothing',        createdAt: '2024-07-22', colors: ['pink', 'sage'] },
  { id: '5',  slug: 'knitted-dress',     nameKey: 'products.placeholder.knittedDress',     price: 76.00, category: 'clothing',        createdAt: '2024-08-30', colors: ['dusty-rose'] },
  { id: '12', slug: 'knit-sweater',      nameKey: 'products.placeholder.knitSweater',      price: 89.00, category: 'clothing',        isNew: true, createdAt: '2024-12-01', colors: ['olive', 'sand'] },
  { id: '13', slug: 'linen-blouse',      nameKey: 'products.placeholder.linenBlouse',      price: 52.00, originalPrice: 65.00, category: 'clothing', createdAt: '2024-10-15', colors: ['cream'] },

  // sewing-supplies — tools have no color
  { id: '4',  slug: 'crochet-hooks-set', nameKey: 'products.placeholder.crochetHooksSet', price: 12.99, category: 'sewing-supplies', createdAt: '2024-06-01' },
  { id: '14', slug: 'yarn-bundle',       nameKey: 'products.placeholder.yarnBundle',       price: 18.00, originalPrice: 24.00, category: 'sewing-supplies', isNew: true, createdAt: '2024-11-15', colors: ['cream', 'olive', 'pink'] },
  { id: '15', slug: 'fabric-scissors',   nameKey: 'products.placeholder.fabricScissors',   price: 14.00, category: 'sewing-supplies', createdAt: '2024-07-05' },
  { id: '16', slug: 'stitch-markers',    nameKey: 'products.placeholder.stitchMarkers',    price: 7.50,  category: 'sewing-supplies', createdAt: '2024-09-10' },
];
