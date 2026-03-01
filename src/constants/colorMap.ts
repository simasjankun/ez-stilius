const COLOR_MAP: Record<string, string> = {
  Red: '#E53E3E',
  Pink: '#F687B3',
  Orange: '#ED8936',
  Yellow: '#ECC94B',
  Green: '#48BB78',
  Blue: '#4299E1',
  Purple: '#9F7AEA',
  Brown: '#8B5E3C',
  Black: '#2D2A26',
  White: '#F0EFE9',
  Gray: '#A0AEC0',
  Gold: '#D4AF37',
  Silver: '#C0C0C0',
  Beige: '#F5DEB3',
  Cream: '#FAF8F5',
  Navy: '#1A365D',
  Teal: '#2C7A7B',
  Coral: '#FC8181',
  Burgundy: '#742A2A',
  Multicolor: 'multicolor',
};

/** Returns a hex color string (or 'multicolor') for a known color name, or null if unknown. */
export function getSwatchColor(name: string): string | null {
  return (
    COLOR_MAP[name] ??
    COLOR_MAP[name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()] ??
    null
  );
}
