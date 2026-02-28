import { getLocale } from 'next-intl/server';
import { getCategories } from '@/lib/categories';
import Header from './Header';

export default async function HeaderServer() {
  const locale = await getLocale();
  const categories = await getCategories(locale);
  return <Header categories={categories} />;
}
