import { Listing } from '../types';
import { seedListings } from './seedListings';
import { validateRegionalSanity } from './locations';
import { countryByCode, getSanitizedCurrency } from './countries';

export interface ListingDatabaseStore {
  listings: Listing[];
  injectNewListing: (payload: Partial<Listing>, activeCountryCode?: string) => Listing;
}

// Global In-Memory Reactive Multi-Country Store Buffer
let localListingsMemory: Listing[] = [...seedListings];

export function getListingsDatabase(): Listing[] {
  return localListingsMemory;
}

export function injectNewListing(
  payload: Partial<Listing>,
  activeCountryCode: string = 'JO'
): Listing {
  const sanitizedCountryCode = ['JO', 'LB', 'PS', 'SY', 'SA'].includes(activeCountryCode)
    ? activeCountryCode
    : 'JO';

  const countryDef = countryByCode(sanitizedCountryCode) || countryByCode('JO')!;
  const currency = getSanitizedCurrency(sanitizedCountryCode, payload.currency);
  
  // Dynamic Region Defaults Based on Active Country
  let defaultCity = 'عمّان';
  let defaultNeighborhood = 'خلدا';
  if (sanitizedCountryCode === 'LB') {
    defaultCity = 'بيروت';
    defaultNeighborhood = 'الاشرفية';
  } else if (sanitizedCountryCode === 'PS') {
    defaultCity = 'رام الله';
    defaultNeighborhood = 'المنارة';
  } else if (sanitizedCountryCode === 'SY') {
    defaultCity = 'دمشق';
    defaultNeighborhood = 'المالكي';
  }

  let safeCity = payload.city || defaultCity;
  let safeNeighborhood = payload.neighborhood || defaultNeighborhood;

  // Cross-Border Isolation Check
  if (!validateRegionalSanity(sanitizedCountryCode, safeCity, safeNeighborhood)) {
    safeCity = defaultCity;
    safeNeighborhood = defaultNeighborhood;
  }

  const newId = `listing-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const parsedPrice = typeof payload.price === 'string' 
    ? payload.price.replace(/[^\d]/g, '') 
    : String(payload.price || '0');

  const createdListing: Listing = {
    id: newId,
    title: payload.title || 'إعلان جديد',
    description: payload.description || '',
    price: parsedPrice,
    currency,
    countryCode: sanitizedCountryCode,
    city: safeCity,
    neighborhood: safeNeighborhood,
    categorySlug: payload.categorySlug || 'motors',
    subcategorySlug: payload.subcategorySlug || 'cars',
    imageUrl: payload.imageUrl || (payload.images && payload.images[0]) || '/assets/listings/car.jpg',
    images: payload.images && payload.images.length > 0 ? payload.images : ['/assets/listings/car.jpg'],
    sellerPhone: payload.sellerPhone || (sanitizedCountryCode === 'LB' ? '+9613000000' : sanitizedCountryCode === 'PS' ? '+970590000000' : sanitizedCountryCode === 'SY' ? '+963930000000' : '+962790000000'),
    sellerName: payload.sellerName || 'مستخدم معتمد',
    createdAt: new Date().toISOString().slice(0, 10),
    views: 1,
    attributes: payload.attributes || [],
  };

  // Prepend to reactive memory array for 120Hz instantaneous feed rendering across multi-tenant markets
  localListingsMemory = [createdListing, ...localListingsMemory];
  
  return createdListing;
}
