import { Listing } from '@/types';
import { getSanitizedRegionalLocation } from '@/data/locations';
import { getSanitizedCurrency } from '@/data/countries';
import { globalStorage } from '@/shared/lib/marketStorage';

export const sanitizeListingData = (listing: Listing, activeCountry: string, isArabic: boolean): Listing => {
  const country = activeCountry || listing.countryCode;
  if (!country) {
    throw new Error('Market Isolation Violation: Listing market parameter is required and cannot be omitted.');
  }
  const sanitizedLoc = getSanitizedRegionalLocation(country, listing.city, listing.neighborhood, isArabic ? 'ar' : 'en', { allowUnknown: true });
  const sanitizedCurr = getSanitizedCurrency(country, listing.currency);

  return {
    ...listing,
    countryCode: country as Listing['countryCode'],
    city: sanitizedLoc.city,
    neighborhood: sanitizedLoc.neighborhood,
    currency: sanitizedCurr as Listing['currency'],
  };
};

export const logListingError = (err: unknown) => {
  const error = err instanceof Error ? err : new Error(String(err));
  const errorData = {
    message: error.message,
    stack: error.stack?.slice(0, 2000) || '',
    timestamp: new Date().toISOString(),
    location: 'addListing/listings.slice',
  };
  try {
    globalStorage().set('catch_crash_last', errorData);
  } catch {}
};
