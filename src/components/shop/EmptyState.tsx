'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface EmptyStateProps {
  onClear: () => void;
}

export default function EmptyState({ onClear }: EmptyStateProps) {
  const t = useTranslations('shop');

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Search className="w-16 h-16 text-warm-gray/30 mb-6" strokeWidth={1} />
      <h3 className="font-serif text-xl text-charcoal mb-3">{t('noResults.title')}</h3>
      <p className="text-sm text-warm-gray mb-8">{t('noResults.subtitle')}</p>
      <button
        type="button"
        onClick={onClear}
        className="border-2 border-olive text-olive text-sm uppercase tracking-widest px-8 py-3 rounded hover:bg-olive hover:text-cream transition-colors duration-200"
      >
        {t('filters.clearFilters')}
      </button>
    </div>
  );
}
