import { Listing } from '@/types';
import { getSanitizedRegionalLocation } from '@/data/locations';
import { getSanitizedCurrency } from '@/data/countries';
import { globalStorage } from '@/shared/lib/marketStorage';

export const sanitizeListingData = (listing: Listing, activeCountry: string, isArabic: boolean): Listing => {
  const country = activeCountry || listing.countryCode;
  if (!country) {
    throw new Error('Market Isolation Violation: Listing market parameter is required and cannot be omitted.');
  }
  const sanitizedLoc = getSanitizedRegionalLocation(country, listing.city, listing.neighborhood, isArabic ? 'ar' : 'en');
  const sanitizedCurr = getSanitizedCurrency(country, listing.currency);

  return {
    ...listing,
    countryCode: country,
    city: sanitizedLoc.city,
    neighborhood: sanitizedLoc.neighborhood,
    currency: sanitizedCurr,
  };
};

export const logListingError = (err: any) => {
  const errorData = {
    message: err?.message || String(err),
    stack: err?.stack?.slice(0, 2000) || '',
    timestamp: new Date().toISOString(),
    location: 'addListing/listings.slice',
  };
  try {
    globalStorage().set('catch_crash_last', errorData);
  } catch {}
};
