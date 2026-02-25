export type Locale = 'lt' | 'en';

export interface NavItem {
  label: string;
  href: string;
  hasMegaMenu?: boolean;
}

export interface Category {
  slug: string;
  label: string;
  description: string;
  image: string;
}
