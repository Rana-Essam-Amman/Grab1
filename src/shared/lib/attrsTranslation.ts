import { getListingFields } from '@/data/listingFields';

/**
 * Translates UI attribute values to their Arabic labels (labelAr) before they
 * are sent to the database or compared locally. This is the SINGLE source of
 * truth for attribute translation — every filter path (server + client) uses it.
 */
export function translateAttrsForDb(
  attrs: Record<string, string> | undefined,
  categorySlug?: string | null,
  subcategorySlug?: string | null,
): Record<string, string> {
  if (!attrs) return {};
  const fields = categorySlug ? getListingFields(categorySlug, subcategorySlug ?? undefined) : [];
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (!key || !value) continue;
    const field = fields.find((f) => f.key === key);
    let dbValue = value;
    if (field?.options) {
      const option = field.options.find(
        (o) => o.value === value || o.labelAr === value || o.labelEn === value,
      );
      if (option) dbValue = option.labelAr;
    }
    result[key] = dbValue;
  }
  return result;
}

/**
 * Normalizes a raw attribute value to its canonical slug (the option's `value`).
 * This is used at WRITE time (Wizard) so new listings are stored in a
 * canonical form that the filter can reliably match against.
 *
 * Examples:
 *   'بايك' → 'baic'
 *   'BAIC' → 'baic'
 *   'baic' → 'baic'
 *   custom text → unchanged
 */
export function normalizeValueToSlug(
  key: string,
  value: string,
  categorySlug?: string | null,
  subcategorySlug?: string | null,
): string {
  if (!categorySlug) return value;
  const fields = getListingFields(categorySlug, subcategorySlug ?? undefined);
  const field = fields.find((f) => f.key === key);
  if (!field?.options) return value;
  const trimmed = value.trim();
  const lower = trimmed.toLowerCase();
  const option = field.options.find(
    (o) =>
      o.value.toLowerCase() === lower ||
      o.labelEn.toLowerCase() === lower ||
      o.labelAr === trimmed,
  );
  return option ? option.value : value;
}
