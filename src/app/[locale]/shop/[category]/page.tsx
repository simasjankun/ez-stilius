import { use } from 'react';
import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, categories } from '@/constants/categories';
import PageHero from '@/components/sections/PageHero';

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = use(params);
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const t = useTranslations();
  const tb = useTranslations('breadcrumb');
  const ts = useTranslations('shop');

  const name = t(`${category.translationKey}.name`);
  const description = t(`${category.translationKey}.description`);
  const tp = useTranslations('placeholder');

  return (
    <>
      <PageHero
        title={name}
        subtitle={description}
        breadcrumbs={[
          { label: tb('home'), href: '/' },
          { label: ts('title'), href: '/shop' },
          { label: name },
        ]}
      />
      <section className="min-h-[50vh] flex items-center justify-center px-4">
        <p className="text-warm-gray text-lg">{tp('content')}</p>
      </section>
    </>
  );
}
