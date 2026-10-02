// RULE-14-EXCEPTION: Static taxonomy
/**
 * Brands NOT already covered by motors.ts, tech.ts, or extras.ts.
 * Duplicates (Dell, HP, Sony, Samsung, LG, Canon, Nikon, Nike, Dior)
 * were removed to avoid conflicting fuzzy matches.
 */
export const EXTRA_BRANDS: ReadonlyArray<{
  readonly canonical: string;
  readonly aliases: readonly string[];
  readonly categorySlug: string;
}> = [
  { canonical: 'Trek', aliases: ['Trek', 'trek', 'تريك', 'تريك بايك'], categorySlug: 'sports' },
  { canonical: 'Weber', aliases: ['Weber', 'weber', 'ويبر'], categorySlug: 'home-garden' },
  { canonical: 'Whirlpool', aliases: ['Whirlpool', 'whirlpool', 'ويرلبول', 'ويرل بول'], categorySlug: 'electronics' },
  { canonical: 'Bose', aliases: ['Bose', 'bose', 'بوز'], categorySlug: 'electronics' },
  { canonical: 'JBL', aliases: ['JBL', 'jbl', 'جي بي ال', 'جيبي ال'], categorySlug: 'electronics' },
  { canonical: 'PlayStation', aliases: ['PlayStation', 'playstation', 'بلايستيشن', 'بلاي ستيشن'], categorySlug: 'electronics' },
  { canonical: 'Xbox', aliases: ['Xbox', 'xbox', 'اكس بوكس', 'إكس بوكس'], categorySlug: 'electronics' },
  { canonical: 'Panasonic', aliases: ['Panasonic', 'panasonic', 'باناسونيك', 'باناسونك'], categorySlug: 'electronics' },
];
