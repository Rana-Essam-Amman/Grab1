import type { CategoryFieldDef } from '../categoryFields';
import { getCategoryFields } from '../categoryFields';
import { MOTORS_SUBCATEGORY_FIELDS } from './motors';
import { REAL_ESTATE_SUBCATEGORY_FIELDS } from './real-estate';
import { MOBILES_SUBCATEGORY_FIELDS } from './mobiles';
import { COMPUTERS_SUBCATEGORY_FIELDS } from './computers';
import { ELECTRONICS_SUBCATEGORY_FIELDS } from './electronics';
import { WATCHES_SUBCATEGORY_FIELDS } from './watches';
import { FASHION_SUBCATEGORY_FIELDS } from './fashion';
import { FURNITURE_SUBCATEGORY_FIELDS } from './furniture';
import { KIDS_SUBCATEGORY_FIELDS } from './kids';
import { BEAUTY_SUBCATEGORY_FIELDS } from './beauty';
import { PETS_SUBCATEGORY_FIELDS } from './pets';
import { SPORTS_SUBCATEGORY_FIELDS } from './sports';
import { BOOKS_SUBCATEGORY_FIELDS } from './books';
import { HOME_GARDEN_SUBCATEGORY_FIELDS } from './home-garden';

const SUBCATEGORY_FIELDS: Record<string, Record<string, readonly CategoryFieldDef[]>> = {
  motors: MOTORS_SUBCATEGORY_FIELDS,
  'real-estate': REAL_ESTATE_SUBCATEGORY_FIELDS,
  mobiles: MOBILES_SUBCATEGORY_FIELDS,
  computers: COMPUTERS_SUBCATEGORY_FIELDS,
  electronics: ELECTRONICS_SUBCATEGORY_FIELDS,
  watches: WATCHES_SUBCATEGORY_FIELDS,
  fashion: FASHION_SUBCATEGORY_FIELDS,
  furniture: FURNITURE_SUBCATEGORY_FIELDS,
  kids: KIDS_SUBCATEGORY_FIELDS,
  beauty: BEAUTY_SUBCATEGORY_FIELDS,
  pets: PETS_SUBCATEGORY_FIELDS,
  sports: SPORTS_SUBCATEGORY_FIELDS,
  books: BOOKS_SUBCATEGORY_FIELDS,
  'home-garden': HOME_GARDEN_SUBCATEGORY_FIELDS,
};

export function getFieldsForListing(
  categorySlug: string,
  subcategorySlug: string
): readonly CategoryFieldDef[] {
  const override = SUBCATEGORY_FIELDS[categorySlug]?.[subcategorySlug];
  if (override && override.length > 0) return override;
  return getCategoryFields(categorySlug);
}
