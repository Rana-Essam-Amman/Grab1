import type { Listing } from '@/types';
import { JO_LISTINGS } from './JO';
import { SA_LISTINGS } from './SA';
import { LB_LISTINGS } from './LB';
import { PS_LISTINGS } from './PS';
import { SY_LISTINGS } from './SY';

export const seedListings: Listing[] = [
  ...JO_LISTINGS,
  ...SA_LISTINGS,
  ...LB_LISTINGS,
  ...PS_LISTINGS,
  ...SY_LISTINGS,
];

export type { SeedListingsByCountry } from './types';
