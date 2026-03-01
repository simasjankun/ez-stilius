'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  /** Hex color string or 'multicolor' — triggers a color swatch if provided. */
  color?: string;
}

interface MultiSelectDropdownProps {
  options: DropdownOption[];
  values: string[];
  onChange: (values: string[]) => void;
  buttonLabel: string;
  hasClear: boolean;
  onClear: () => void;
  className?: string;
}

function ColorSwatch({ color, size = 'md' }: { color: string; size?: 'sm' | 'md' }) {
  const cls = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  if (color === 'multicolor') {
    return (
      <span
        className={`${cls} rounded-full shrink-0 border border-black/10`}
        style={{
          background:
            'conic-gradient(red 0deg, orange 51deg, yellow 102deg, green 154deg, cyan 205deg, blue 257deg, violet 308deg, red 360deg)',
        }}
      />
    );
  }
  return (
    <span
      className={`${cls} rounded-full shrink-0 border border-black/10`}
      style={{ backgroundColor: color }}
    />
  );
}

export default function MultiSelectDropdown({
  options,
  values,
  onChange,
  buttonLabel,
  hasClear,
  onClear,
  className = '',
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function toggle(value: string) {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  }

  // Collect swatches for selected options (for trigger button preview)
  const selectedSwatches = values
    .slice(0, 3)
    .map((v) => options.find((o) => o.value === v)?.color)
    .filter((c): c is string => !!c);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 w-full bg-sand/50 rounded px-4 py-2.5 text-sm text-charcoal hover:bg-sand/70 transition-colors duration-150"
      >
        {selectedSwatches.length > 0 && (
          <span className="flex items-center gap-0.5 shrink-0">
            {selectedSwatches.map((color, i) => (
              <ColorSwatch key={i} color={color} size="sm" />
            ))}
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
        <div className="absolute top-full left-0 mt-1 w-max min-w-full bg-cream rounded-lg shadow-lg border border-sand/60 z-30 py-1">
          {options.map((option) => {
            const checked = values.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggle(option.value)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left cursor-pointer text-charcoal hover:bg-olive/10 hover:text-olive transition-colors duration-100"
              >
                <span
                  className={`w-4 h-4 rounded-sm border shrink-0 flex items-center justify-center transition-colors duration-150 ${
                    checked ? 'bg-olive border-olive' : 'border-warm-gray/50 bg-cream'
                  }`}
                >
                  {checked && <Check size={10} className="text-cream" strokeWidth={2.5} />}
                </span>
                {option.color && <ColorSwatch color={option.color} />}
                <span className={`whitespace-nowrap ${checked ? 'text-olive font-medium' : ''}`}>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
