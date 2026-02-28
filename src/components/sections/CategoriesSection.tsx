import Image from 'next/image';
import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getCategories } from '@/lib/categories';

// Mapping from Medusa category handle → local placeholder image + layout flags
const CATEGORY_LAYOUT: Record<string, { image: string; large?: boolean; wide?: boolean }> = {
  clothing: {
    image: '/images/categories/category-clothing.png',
    large: true,
  },
  accessories: {
    image: '/images/categories/category-accessories.png',
  },
  interior: {
    image: '/images/categories/category-interior-gifts.png',
    wide: true,
  },
  'craft-supplies': {
    image: '/images/categories/category-sewing-supplies.png',
  },
};

const FALLBACK_IMAGE = '/images/categories/category-clothing.png';

export default async function CategoriesSection() {
  const locale = await getLocale();
  const [t, categories] = await Promise.all([
    getTranslations('home.categories'),
    getCategories(locale),
  ]);

  if (!categories.length) return null;

  // Sort: large first → normal → wide last (ensures asymmetric grid always works)
  const sorted = [...categories].sort((a, b) => {
    const aL = CATEGORY_LAYOUT[a.handle] ?? {};
    const bL = CATEGORY_LAYOUT[b.handle] ?? {};
    if (aL.large && !bL.large) return -1;
    if (!aL.large && bL.large) return 1;
    if (aL.wide && !bL.wide) return 1;
    if (!aL.wide && bL.wide) return -1;
    return 0;
  });

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-sm uppercase tracking-widest text-olive mb-2 block">
            {t('label')}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal">
            {t('title')}
          </h2>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {sorted.map((cat) => {
            const layout = CATEGORY_LAYOUT[cat.handle] ?? {};
            const image = layout.image ?? FALLBACK_IMAGE;

            return (
              <Link
                key={cat.handle}
                href={`/shop/${cat.handle}`}
                className={`group relative block overflow-hidden rounded-lg ${
                  layout.large
                    ? 'md:col-span-2 md:row-span-2 h-[300px] md:h-[520px]'
                    : layout.wide
                      ? 'md:col-span-3 h-[250px]'
                      : 'h-[250px]'
                }`}
              >
                <Image
                  src={image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes={
                    layout.large
                      ? '(min-width: 768px) 66vw, 100vw'
                      : layout.wide
                        ? '100vw'
                        : '(min-width: 768px) 33vw, 100vw'
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-300" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 transition-transform duration-300 group-hover:-translate-y-1">
                  <h3
                    className={`font-serif text-cream ${
                      layout.large ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'
                    }`}
                  >
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-cream/80 text-sm mt-1">{cat.description}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
