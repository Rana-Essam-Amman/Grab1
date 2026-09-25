import { TYPE_ALIASES, TYPE_CATEGORY } from './data/types.data';

// Sort aliases by length desc to avoid substring collisions
const SORTED_ALIASES = Object.entries(TYPE_ALIASES)
  .sort(([a], [b]) => b.length - a.length);

export function extractType(text: string): string | undefined {
  const t = text.toLowerCase();
  for (const [alias, canonical] of SORTED_ALIASES) {
    if (t.includes(alias.toLowerCase())) return canonical;
  }
  return undefined;
}

export function extractCategorySlug(text: string): string | undefined {
  const type = extractType(text);
  return type ? TYPE_CATEGORY[type] : undefined;
}
