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
