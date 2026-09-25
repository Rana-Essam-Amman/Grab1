import type { CategoryFieldDef } from '../categoryFields';
import { getCategoryFields } from '../categoryFields';
import { MOTORS_SUBCATEGORY_FIELDS } from './motors';
import { REAL_ESTATE_SUBCATEGORY_FIELDS } from './real-estate';

const SUBCATEGORY_FIELDS: Record<string, Record<string, readonly CategoryFieldDef[]>> = {
  motors: MOTORS_SUBCATEGORY_FIELDS,
  'real-estate': REAL_ESTATE_SUBCATEGORY_FIELDS,
};

export function getFieldsForListing(
  categorySlug: string,
  subcategorySlug: string
): readonly CategoryFieldDef[] {
  const override = SUBCATEGORY_FIELDS[categorySlug]?.[subcategorySlug];
  if (override && override.length > 0) return override;
  return getCategoryFields(categorySlug);
}
