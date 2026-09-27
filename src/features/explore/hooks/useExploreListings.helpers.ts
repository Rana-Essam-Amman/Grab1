import type { Listing } from '@/types';

export * from '@/shared/lib/listingSearch';

export const countCityListings = (listings: Listing[], cityAr: string, cityEn: string): number =>
  listings.filter((l) => l.city === cityAr || l.city === cityEn || !l.city).length;

export const computeAdaptiveFilterMode = (userMode: 'city' | 'all' | null, cityCount: number, minDensity: number): 'city' | 'all' =>
  userMode !== null ? userMode : cityCount >= minDensity ? 'city' : 'all';
