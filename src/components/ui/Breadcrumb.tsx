'use client';

import { useRef, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const scrollRef = useRef<HTMLOListElement>(null);

  // Auto-scroll to show the current (last) breadcrumb on mobile
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  return (
    <nav aria-label="Breadcrumb">
      <ol
        ref={scrollRef}
        className="flex items-center gap-1.5 text-sm overflow-x-auto scrollbar-hide whitespace-nowrap px-4 md:flex-wrap md:justify-center md:overflow-x-visible md:px-0"
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1;

          return (
            <li key={i} className="flex items-center gap-1.5 flex-shrink-0 md:flex-shrink">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-warm-gray/60 flex-shrink-0" />}
              {isLast || !item.href ? (
                <span className="text-charcoal">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-warm-gray hover:text-olive transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
