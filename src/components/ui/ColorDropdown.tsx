'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { availableColors } from '@/constants/colors';

interface ColorDropdownProps {
  values: string[];
  onChange: (values: string[]) => void;
  buttonLabel: string;
  hasClear: boolean;
  onClear: () => void;
  className?: string;
}

export default function ColorDropdown({
  values,
  onChange,
  buttonLabel,
  hasClear,
  onClear,
  className = '',
}: ColorDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const tc = useTranslations('shop.filters.colors');

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function toggle(key: string) {
    if (values.includes(key)) {
      onChange(values.filter((v) => v !== key));
    } else {
      onChange([...values, key]);
    }
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 w-full bg-sand/50 rounded px-4 py-2.5 text-sm text-charcoal hover:bg-sand/70 transition-colors duration-150"
      >
        {values.length > 0 && (
          <span className="flex items-center gap-0.5 shrink-0">
            {values.slice(0, 3).map((key) => {
              const c = availableColors.find((ac) => ac.key === key);
              return c ? (
                <span
                  key={key}
                  className="w-3 h-3 rounded-full border border-charcoal/15 shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
              ) : null;
            })}
          </span>
        )}
        <span className="flex-1 text-left truncate">{buttonLabel}</span>
        {hasClear ? (
          <X
            size={14}
            className="shrink-0 text-warm-gray hover:text-charcoal"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
              setOpen(false);
            }}
          />
        ) : (
          <ChevronDown
            size={14}
            className={`shrink-0 text-warm-gray transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-max min-w-[220px] bg-cream rounded-lg shadow-lg border border-sand/60 z-30 py-1">
          {availableColors.map((color) => {
            const checked = values.includes(color.key);
            return (
              <button
                key={color.key}
                type="button"
                onClick={() => toggle(color.key)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left cursor-pointer text-charcoal hover:bg-sand/30 transition-colors duration-100"
              >
                <span
                  className={`w-4 h-4 rounded-sm border shrink-0 flex items-center justify-center transition-colors duration-150 ${
                    checked ? 'bg-olive border-olive' : 'border-warm-gray/50 bg-cream'
                  }`}
                >
                  {checked && <Check size={10} className="text-cream" strokeWidth={2.5} />}
                </span>
                <span
                  className="w-4 h-4 rounded-full shrink-0 border border-black/10"
                  style={{ backgroundColor: color.hex }}
                />
                <span className={`whitespace-nowrap ${checked ? 'text-olive font-medium' : ''}`}>
                  {tc(color.key)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
