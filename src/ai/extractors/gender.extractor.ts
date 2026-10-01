import { normalizeArabic } from '@/data/arabicNormalize';

const GENDER_ALIASES: Array<[string, string[]]> = [
  ['رجالي', ['رجالي', 'رجالية', 'للرجال', 'men', 'male']],
  ['نسائي', ['نسائي', 'نسائية', 'للنساء', 'women', 'female']],
  ['أطفال', ['اطفال', 'أطفال', 'ولادي', 'بناتي', 'kids', 'children']],
  ['للجنسين', ['للجنسين', 'unisex']],
];

const NORMALIZED: Array<[string, string[]]> = GENDER_ALIASES.map(
  ([canonical, aliases]) => [
    canonical,
    aliases.map((a) => normalizeArabic(a).toLowerCase()),
  ]
);

export function extractGender(text: string): string | undefined {
  if (!text) return undefined;
  const t = normalizeArabic(text).toLowerCase();
  for (const [canonical, aliases] of NORMALIZED) {
    for (const alias of aliases) {
      if (t.includes(alias)) return canonical;
    }
  }
  return undefined;
}
