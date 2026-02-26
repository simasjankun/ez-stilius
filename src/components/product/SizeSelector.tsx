'use client';

interface SizeSelectorProps {
  sizes: string[];
  selected: string | null;
  onSelect: (size: string) => void;
}

export default function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => onSelect(size)}
          className={`min-w-[44px] h-[44px] px-3 rounded border text-sm flex items-center justify-center cursor-pointer transition-colors duration-150 ${
            size === selected
              ? 'border-olive bg-olive text-cream'
              : 'border-sand text-charcoal hover:border-olive'
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
