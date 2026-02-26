'use client';

import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 10,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-10 h-10 rounded border border-sand flex items-center justify-center cursor-pointer hover:border-olive transition-colors duration-150 disabled:opacity-40 disabled:cursor-default"
      >
        <Minus size={14} />
      </button>
      <span className="w-12 text-center text-base text-charcoal select-none">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-10 h-10 rounded border border-sand flex items-center justify-center cursor-pointer hover:border-olive transition-colors duration-150 disabled:opacity-40 disabled:cursor-default"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
