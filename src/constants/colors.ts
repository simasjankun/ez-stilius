export const availableColors = [
  { key: 'cream',      hex: '#F5F0E8' },
  { key: 'olive',      hex: '#8B8424' },
  { key: 'pink',       hex: '#D4A0A0' },
  { key: 'sage',       hex: '#A8B5A0' },
  { key: 'dusty-rose', hex: '#C9A0B0' },
  { key: 'sand',       hex: '#D4C9B8' },
  { key: 'lavender',   hex: '#B8A9C9' },
] as const;

export type ColorKey = typeof availableColors[number]['key'];
