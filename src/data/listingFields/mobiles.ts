import type { CategoryFieldMap } from './types';
import { PHONES_FIELDS, TABLETS_FIELDS } from './mobiles-phones';
import { MOBILES_WATCHES_FIELDS, MOBILES_ACCESSORIES_FIELDS } from './mobiles-wearables';
import { MOBILES_NUMBERS_FIELDS } from './mobiles-numbers';

export const MOBILES_FIELDS: CategoryFieldMap = {
  phones: PHONES_FIELDS,
  tablets: TABLETS_FIELDS,
  'smart-watches': MOBILES_WATCHES_FIELDS,
  accessories: MOBILES_ACCESSORIES_FIELDS,
  numbers: MOBILES_NUMBERS_FIELDS,
};
