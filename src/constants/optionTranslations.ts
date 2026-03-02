const OPTION_TITLE_LT: Record<string, string> = {
  Color: 'Spalva',
  Size: 'Dydis',
  Material: 'Medžiaga',
};

const OPTION_VALUE_LT: Record<string, string> = {
  Red: 'Raudona',
  Pink: 'Rožinė',
  Orange: 'Oranžinė',
  Yellow: 'Geltona',
  Green: 'Žalia',
  Blue: 'Mėlyna',
  Purple: 'Violetinė',
  Brown: 'Ruda',
  Black: 'Juoda',
  White: 'Balta',
  Gray: 'Pilka',
  Grey: 'Pilka',
  Gold: 'Auksinė',
  Silver: 'Sidabrinė',
  Beige: 'Smėlinė',
  Cream: 'Kreminė',
  Navy: 'Tamsiai mėlyna',
  Teal: 'Žalsvai mėlyna',
  Coral: 'Koralinė',
  Burgundy: 'Bordo',
  Multicolor: 'Spalvota',
};

export function translateOptionTitle(title: string, locale: string): string {
  if (locale !== 'lt') return title;
  return OPTION_TITLE_LT[title] ?? title;
}

export function translateOptionValue(value: string, locale: string): string {
  if (locale !== 'lt') return value;
  return OPTION_VALUE_LT[value] ?? value;
}
