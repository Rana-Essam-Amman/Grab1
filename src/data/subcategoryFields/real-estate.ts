import type { CategoryFieldDef } from '../categoryFields';
import type { ListingField } from '../listingFields/types';
import { REAL_ESTATE_FIELDS } from '../listingFields/real-estate';

/**
 * Adapter: exposes legacy CategoryFieldDef[] API backed by ListingField[].
 * Single source of truth = listingFields/real-estate.ts.
 */
function toLegacy(field: ListingField): CategoryFieldDef {
  const legacyOptions = field.options?.map((o) => o.value);
  return {
    key: field.key,
    labelAr: field.labelAr,
    labelEn: field.labelEn,
    type: field.type,
    required: field.required,
    options: legacyOptions,
    richOptions: field.options,
    placeholder: field.placeholder,
    allowOther: field.allowOther,
    multiSelect: field.multiSelect,
    placeholderAr: field.placeholderAr,
    dependsOn: field.dependsOn,
  } as CategoryFieldDef;
}

function buildAdapter(): Record<string, readonly CategoryFieldDef[]> {
  const result: Record<string, readonly CategoryFieldDef[]> = {};
  for (const [slug, fields] of Object.entries(REAL_ESTATE_FIELDS)) {
    result[slug] = fields.map(toLegacy);
  }
  return result;
}

export const REAL_ESTATE_SUBCATEGORY_FIELDS: Record<string, readonly CategoryFieldDef[]> = buildAdapter();
