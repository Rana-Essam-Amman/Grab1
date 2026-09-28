import { useMemo } from 'react';
import { getSanitizedRegionalLocation } from '@/data/locations';
import { getSanitizedCurrency } from '@/data/countries';
import { googleSearchQuery, googleMapsOpenUrl } from '@/data/mapUrls';
import { getFormattedLocalPhone, FormattedPhone } from '@/shared/lib/phoneFormatting';
import { Listing } from '@/types';

export interface ListingDerivedData {
  sanitizedLoc: { city: string; neighborhood: string };
  locationText: string;
  mapQuery: string;
  mapUrl: string;
  displayCurrency: string;
  images: string[];
  formattedPhone: FormattedPhone;
}

const PREFIXES: Record<string, string> = { JO: '962', LB: '961', PS: '970', SY: '963', SA: '966' };

export function getWhatsAppUrl(p: { countryCode: string; dialNumber: string; listingTitle: string }): string {
  const pfx = PREFIXES[p.countryCode] || '962';
  const digits = p.dialNumber.startsWith('0') ? p.dialNumber.slice(1) : p.dialNumber;
  return `https://wa.me/${pfx}${digits}?text=${encodeURIComponent(`مرحباً، بخصوص إعلانك "${p.listingTitle}" على تطبيق Catch the Deals.`)}`;
}

export function computeListingDerivedData(listing: Listing | null, isArabic: boolean): ListingDerivedData {
  const countryCode = listing?.countryCode || 'JO';
  const city = listing?.city || '';
  const neighborhood = listing?.neighborhood || '';

  const sanitizedLoc = listing
    ? getSanitizedRegionalLocation(countryCode, city, neighborhood, isArabic ? 'ar' : 'en')
    : { city: '', neighborhood: '' };

  const locationText = sanitizedLoc.neighborhood ? `${sanitizedLoc.neighborhood}, ${sanitizedLoc.city}` : sanitizedLoc.city;
  const mapQuery = googleSearchQuery({ city: sanitizedLoc.city, area: sanitizedLoc.neighborhood });

  const rawImages = listing?.images && Array.isArray(listing.images) && listing.images.length > 0
    ? listing.images.filter((img): img is string => Boolean(img))
    : listing?.imageUrl
    ? [listing.imageUrl]
    : [];

  const images = rawImages.length > 0
    ? rawImages
    : ['data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23E5E7EB"/><text x="200" y="150" font-size="16" text-anchor="middle" fill="%234B5563">Catch</text></svg>'];

  return {
    sanitizedLoc,
    locationText,
    mapQuery,
    mapUrl: googleMapsOpenUrl(mapQuery),
    displayCurrency: listing ? getSanitizedCurrency(countryCode, listing.currency || '') : '',
    images,
    formattedPhone: listing ? getFormattedLocalPhone(listing.sellerPhone || '', countryCode) : { dialNumber: '', displayFormatted: '' },
  };
}

export function useListingDerivedData(listing: Listing | null, isArabic: boolean): ListingDerivedData {
  return useMemo(() => computeListingDerivedData(listing, isArabic), [listing, isArabic]);
}
