'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionSection {
  titleKey: string;
  title: string;
  content: string | null;
  defaultOpen?: boolean;
}

interface ProductAccordionProps {
  title: string;
  content: string;
  defaultOpen?: boolean;
}

export default function ProductAccordion({
  title,
  content,
  defaultOpen = false,
}: ProductAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-sand">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 cursor-pointer"
      >
        <span className="text-sm font-medium text-charcoal">{title}</span>
        <ChevronDown
          size={16}
          className={`text-warm-gray shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-96 pb-4' : 'max-h-0'
        }`}
      >
        <p className="text-sm leading-relaxed text-warm-gray whitespace-pre-line">{content}</p>
      </div>
    </div>
  );
}
