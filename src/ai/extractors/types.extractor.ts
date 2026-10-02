import { TYPE_ALIASES, TYPE_CATEGORY } from './data/types.data';
import { TYPE_ALIASES_EXPANDED } from './data/type-aliases.data';
import { normalizeArabic } from '@/data/arabicNormalize';

// Sort aliases by length desc to avoid substring collisions
const SORTED_ALIASES = Object.entries(TYPE_ALIASES)
  .sort(([a], [b]) => b.length - a.length);

const SORTED_EXPANDED = TYPE_ALIASES_EXPANDED
  .flatMap((entry) =>
    entry.aliases.map((a) => ({ alias: normalizeArabic(a).toLowerCase(), canonical: entry.canonical }))
  )
  .sort((a, b) => b.alias.length - a.alias.length);

export function extractType(text: string): string | undefined {
  const t = normalizeArabic(text).toLowerCase();
  for (const [alias, canonical] of SORTED_ALIASES) {
    if (t.includes(alias.toLowerCase())) return canonical;
  }
  for (const { alias, canonical } of SORTED_EXPANDED) {
    if (t.includes(alias)) return canonical;
  }
  return undefined;
}

export function extractCategorySlug(text: string): string | undefined {
  const type = extractType(text);
  return type ? TYPE_CATEGORY[type] : undefined;
}
