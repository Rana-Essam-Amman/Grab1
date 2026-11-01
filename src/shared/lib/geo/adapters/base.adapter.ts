import { CITY_COORDS } from '@/data/locations/coords';
import { getCountryGeo } from '@/data/locations/registry';
import { DEFAULT_REGIONAL_CAPITALS } from '@/data/locations/capitals';
import { MARKET_BOUNDS, isWithinMarketBounds } from '../marketBounds';
import { haversineKm, cleanGeoToken, matchLandmarkOrCamp } from './adapterUtils';
import { matchHierarchyPasses } from './hierarchyMatcher';
import { CITY_TO_GOVERNORATE_SLUG } from './cityToGovMap';
import type {
  MarketGeoAdapter,
  MarketCode,
  LatLng,
  MarketBounds,
  CanonicalLocation,
} from '../geo.types';

export { cleanGeoToken } from './adapterUtils';

export abstract class BaseMarketGeoAdapter implements MarketGeoAdapter {
  abstract readonly marketCode: MarketCode;

  get bounds(): MarketBounds {
    return MARKET_BOUNDS[this.marketCode];
  }

  isWithinBounds(coords: LatLng): boolean {
    return isWithinMarketBounds(this.marketCode, coords);
  }

  getNearestCity(coords: LatLng): {
    cityEn: string;
    cityAr: string;
    slug: string;
    distanceKm: number;
  } | null {
    const marketCoords = CITY_COORDS[this.marketCode];
    if (!marketCoords) return null;

    let best: { cityEn: string; distanceKm: number } | null = null;
    for (const [cityName, pos] of Object.entries(marketCoords)) {
      const d = haversineKm(coords.lat, coords.lng, pos.lat, pos.lng);
      if (!best || d < best.distanceKm) best = { cityEn: cityName, distanceKm: d };
    }
    if (!best || best.distanceKm > 100) return null;

    const geo = getCountryGeo(this.marketCode);
    if (!geo) return null;

    // Strict Canonical Mapping: Look up authoritative governorate slug
    const mappedGovSlug = CITY_TO_GOVERNORATE_SLUG[this.marketCode]?.[best.cityEn];
    let gov = mappedGovSlug ? geo.governorates.find((g) => g.slug === mappedGovSlug) : undefined;

    if (!gov) {
      gov = geo.governorates.find(
        (g) => cleanGeoToken(g.nameEn) === cleanGeoToken(best!.cityEn) || g.slug === best!.cityEn.toLowerCase()
      );
    }

    // Never manufacture a slug from a city label when no canonical mapping exists
    if (!gov) return null;

    return {
      cityEn: best.cityEn,
      cityAr: gov.nameAr,
      slug: gov.slug,
      distanceKm: best.distanceKm,
    };
  }

  getDefaultCapital() {
    const cap = DEFAULT_REGIONAL_CAPITALS[this.marketCode] || DEFAULT_REGIONAL_CAPITALS.JO;
    const geo = getCountryGeo(this.marketCode);
    const gov = geo?.governorates.find(
      (g) => cleanGeoToken(g.nameEn) === cleanGeoToken(cap.cityEn) || cleanGeoToken(g.nameAr) === cleanGeoToken(cap.cityAr)
    );
    const slug = gov?.slug ?? cap.cityEn.toLowerCase().replace(/\s+/g, '-');
    return {
      cityEn: cap.cityEn,
      cityAr: cap.cityAr,
      neighborhoodEn: cap.neighborhoodEn,
      neighborhoodAr: cap.neighborhoodAr,
      slug,
    };
  }

  resolveHierarchy(tokens: readonly string[], coords?: LatLng): Omit<CanonicalLocation, 'countryCode'> | null {
    const geo = getCountryGeo(this.marketCode);
    if (!geo) return null;
    const cleaned = tokens.map(cleanGeoToken).filter(Boolean);
    if (cleaned.length === 0) return null;

    const special = matchLandmarkOrCamp(cleaned, geo.refugeeCamps, geo.landmarks);
    if (special?.type === 'camp') {
      const campGov = geo.governorates.find((g) => g.slug === special.entity.governorateSlug);
      return {
        governorateSlug: campGov?.slug ?? null,
        governorateEn: campGov?.nameEn ?? null,
        governorateAr: campGov?.nameAr ?? null,
        districtSlug: null, districtEn: null, districtAr: null,
        neighborhoodSlug: special.entity.slug,
        neighborhoodEn: special.entity.nameEn,
        neighborhoodAr: special.entity.nameAr,
        coordinates: coords ?? null, confidence: 'exact',
        resolutionSource: 'canonical_match', needsManualSelection: false,
      };
    }
    if (special?.type === 'landmark') {
      return {
        governorateSlug: null, governorateEn: null, governorateAr: null,
        districtSlug: null, districtEn: null, districtAr: null,
        neighborhoodSlug: special.entity.slug,
        neighborhoodEn: special.entity.nameEn,
        neighborhoodAr: special.entity.nameAr,
        site: special.entity.nameAr,
        coordinates: coords ?? null, confidence: 'exact',
        resolutionSource: 'canonical_match', needsManualSelection: false,
      };
    }

    return matchHierarchyPasses(geo, cleaned, coords);
  }
}
