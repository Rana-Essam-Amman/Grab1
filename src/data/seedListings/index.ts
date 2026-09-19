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
].map(l => ({
  ...l,
  status: (l.status || 'active') as Listing['status'],
  countryCode: l.countryCode as Listing['countryCode'],
  currency: l.currency as Listing['currency'],
}));

export type { SeedListingsByCountry } from './types';
