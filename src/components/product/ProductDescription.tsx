'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ProductDescriptionProps {
  description: string;
}

const TRUNCATE_AT = 250;

export default function ProductDescription({ description }: ProductDescriptionProps) {
  const t = useTranslations('product');
  const isLong = description.length > TRUNCATE_AT;
  const [expanded, setExpanded] = useState(!isLong);

  const text = expanded ? description : description.slice(0, TRUNCATE_AT).trimEnd() + '…';

  return (
    <div>
      <p className="text-warm-gray leading-relaxed whitespace-pre-line text-sm">{text}</p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 text-sm text-olive hover:text-olive-dark underline-offset-2 hover:underline transition-colors duration-150"
        >
          {expanded ? t('readLess') : t('readMore')}
        </button>
      )}
    </div>
  );
}
