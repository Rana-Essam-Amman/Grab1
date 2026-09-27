import type { CategoryFieldDef } from '../categoryFields';
import { getCategoryFields } from '../categoryFields';
import { MOTORS_SUBCATEGORY_FIELDS as motors } from './motors';
import { REAL_ESTATE_SUBCATEGORY_FIELDS as re } from './real-estate';
import { MOBILES_SUBCATEGORY_FIELDS as mobiles } from './mobiles';
import { COMPUTERS_SUBCATEGORY_FIELDS as pc } from './computers';
import { ELECTRONICS_SUBCATEGORY_FIELDS as el } from './electronics';
import { WATCHES_SUBCATEGORY_FIELDS as wt } from './watches';
import { FASHION_SUBCATEGORY_FIELDS as fs } from './fashion';
import { FURNITURE_SUBCATEGORY_FIELDS as fr } from './furniture';
import { KIDS_SUBCATEGORY_FIELDS as kd } from './kids';
import { BEAUTY_SUBCATEGORY_FIELDS as bt } from './beauty';
import { PETS_SUBCATEGORY_FIELDS as pt } from './pets';
import { SPORTS_SUBCATEGORY_FIELDS as sp } from './sports';
import { BOOKS_SUBCATEGORY_FIELDS as bk } from './books';
import { HOME_GARDEN_SUBCATEGORY_FIELDS as hg } from './home-garden';
import { JOBS_SUBCATEGORY_FIELDS as jb } from './jobs';
import { SERVICES_SUBCATEGORY_FIELDS as sv } from './services';
import { CLEANING_SUBCATEGORY_FIELDS as cl } from './cleaning';
import { HANDYMEN_SUBCATEGORY_FIELDS as hm } from './handymen';

const SUBCATEGORY_FIELDS: Record<string, Record<string, readonly CategoryFieldDef[]>> = {
  motors, 'real-estate': re, mobiles, computers: pc, electronics: el,
  watches: wt, fashion: fs, furniture: fr, kids: kd, beauty: bt, pets: pt, sports: sp,
  books: bk, 'home-garden': hg, jobs: jb, services: sv,
  cleaning: cl, handymen: hm,
};

export function getFieldsForListing(cat: string, sub: string): readonly CategoryFieldDef[] {
  return SUBCATEGORY_FIELDS[cat]?.[sub] || getCategoryFields(cat);
}
