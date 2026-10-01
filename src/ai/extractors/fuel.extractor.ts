import { normalizeArabic } from '@/data/arabicNormalize';

const FUEL_ALIASES: Array<[string, string[]]> = [
  ['هايبرد', ['هايبرد', 'هايبر', 'hybrid', 'هجين']],
  ['كهرباء', ['كهرباء', 'كهربائي', 'electric', 'ev']],
  ['ديزل', ['ديزل', 'diesel']],
  ['بنزين', ['بنزين', 'بترول', 'petrol', 'gasoline']],
];

const NORMALIZED_FUEL: Array<[string, string[]]> = FUEL_ALIASES.map(
  ([canonical, aliases]) => [
    canonical,
    aliases.map((a) => normalizeArabic(a).toLowerCase()),
  ]
);

export function extractFuel(text: string): string | undefined {
  if (!text) return undefined;
  const t = normalizeArabic(text).toLowerCase();
  for (const [canonical, aliases] of NORMALIZED_FUEL) {
    for (const alias of aliases) {
      if (t.includes(alias)) return canonical;
    }
  }
  return undefined;
}
