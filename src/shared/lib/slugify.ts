const MAX_SLUG_LENGTH = 60;

/**
 * Converts a listing title into a URL-safe slug.
 * Preserves Arabic letters (Google indexes Arabic URLs natively).
 * Strips diacritics, special chars, and collapses whitespace.
 */
export function slugify(input: string): string {
  if (!input) return 'listing';

  const cleaned = input
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670]/g, '') // Arabic diacritics
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .toLowerCase();

  const slug = cleaned
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!slug) return 'listing';
  if (slug.length <= MAX_SLUG_LENGTH) return slug;
  return slug.slice(0, MAX_SLUG_LENGTH).replace(/-$/, '');
}

export function slugMatches(id: string, slug: string, title: string): boolean {
  if (!id || !slug || !title) return false;
  return slugify(title) === slug;
}
