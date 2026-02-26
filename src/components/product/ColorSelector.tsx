'use client';

import { availableColors } from '@/constants/colors';

interface ColorSelectorProps {
  colors: string[];
  selected: string | null;
  onSelect: (color: string) => void;
}

export default function ColorSelector({ colors, selected, onSelect }: ColorSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((key) => {
        const color = availableColors.find((c) => c.key === key);
        if (!color) return null;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`w-8 h-8 rounded-full border border-black/10 cursor-pointer transition-all duration-150 ${
              key === selected
                ? 'ring-2 ring-olive ring-offset-2'
                : 'hover:scale-110'
            }`}
            style={{ backgroundColor: color.hex }}
          />
        );
      })}
    </div>
  );
}
