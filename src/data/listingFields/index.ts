import type { ListingField, ListingFieldsMap } from './types';
import { MOTORS_FIELDS } from './motors';
import { REAL_ESTATE_FIELDS } from './real-estate';
import { MOBILES_FIELDS } from './mobiles';
import { WATCHES_FIELDS } from './watches';
import { COMPUTERS_FIELDS } from './computers';
import { ELECTRONICS_FIELDS } from './electronics';
import { FURNITURE_FIELDS } from './furniture';
import { FASHION_FIELDS } from './fashion';
import { BEAUTY_FIELDS } from './beauty';
import { KIDS_FIELDS } from './kids';
import { PETS_FIELDS } from './pets';
import { SPORTS_FIELDS } from './sports';
import { BOOKS_FIELDS } from './books';
import { HOME_GARDEN_FIELDS } from './home-garden';
import { KRAKEEB_FIELDS } from './krakeeb';
import { SERVICES_FIELDS } from './services';
import { JOBS_FIELDS } from './jobs';
import { CLEANING_FIELDS } from './cleaning';
import { HANDYMEN_FIELDS } from './handymen';
import { PROJECTS_FIELDS } from './projects';

export const LISTING_FIELDS: ListingFieldsMap = {
  motors: MOTORS_FIELDS,
  'real-estate': REAL_ESTATE_FIELDS,
  mobiles: MOBILES_FIELDS,
  watches: WATCHES_FIELDS,
  computers: COMPUTERS_FIELDS,
  electronics: ELECTRONICS_FIELDS,
  furniture: FURNITURE_FIELDS,
  fashion: FASHION_FIELDS,
  beauty: BEAUTY_FIELDS,
  kids: KIDS_FIELDS,
  pets: PETS_FIELDS,
  sports: SPORTS_FIELDS,
  books: BOOKS_FIELDS,
  'home-garden': HOME_GARDEN_FIELDS,
  krakeeb: KRAKEEB_FIELDS,
  services: SERVICES_FIELDS,
  jobs: JOBS_FIELDS,
  cleaning: CLEANING_FIELDS,
  handymen: HANDYMEN_FIELDS,
  projects: PROJECTS_FIELDS,
};

export function getListingFields(
  categorySlug: string,
  subcategorySlug?: string
): readonly ListingField[] {
  if (subcategorySlug) {
    return LISTING_FIELDS[categorySlug]?.[subcategorySlug] ?? [];
  }
  const categorySubcats = LISTING_FIELDS[categorySlug];
  if (!categorySubcats) return [];
  const firstSubcat = Object.keys(categorySubcats)[0];
  return firstSubcat ? categorySubcats[firstSubcat] ?? [] : [];
}

export type { ListingField, ListingFieldOption, CategoryFieldMap, ListingFieldsMap } from './types';
