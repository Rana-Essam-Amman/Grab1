import { CITY_COORDS } from '@/data/locations/coords';
import { getCountryGeo } from '@/data/locations/registry';
import { DEFAULT_REGIONAL_CAPITALS } from '@/data/locations/capitals';
import { MARKET_BOUNDS, isWithinMarketBounds } from '../marketBounds';
import { haversineKm, cleanGeoToken, matchLandmarkOrCamp } from './adapterUtils';
import { matchHierarchyPasses } from './hierarchyMatcher';
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

  getNearestCity(coords: LatLng) {
    const marketCoords = CITY_COORDS[this.marketCode];
    if (!marketCoords) return null;

    let best: { cityEn: string; distanceKm: number } | null = null;
    for (const [cityName, pos] of Object.entries(marketCoords)) {
      const d = haversineKm(coords.lat, coords.lng, pos.lat, pos.lng);
      if (!best || d < best.distanceKm) best = { cityEn: cityName, distanceKm: d };
    }
    if (!best || best.distanceKm > 100) return null;

    const geo = getCountryGeo(this.marketCode);
    const gov = geo?.governorates.find(
      (g) => cleanGeoToken(g.nameEn) === cleanGeoToken(best!.cityEn) || g.slug === best!.cityEn.toLowerCase()
    );
    const cap = this.getDefaultCapital();
    return {
      cityEn: best.cityEn,
      cityAr: gov?.nameAr ?? cap.cityAr,
      slug: gov?.slug ?? best.cityEn.toLowerCase().replace(/\s+/g, '-'),
      distanceKm: best.distanceKm,
    };
  }

  getDefaultCapital() {
    const cap = DEFAULT_REGIONAL_CAPITALS[this.marketCode] || DEFAULT_REGIONAL_CAPITALS.JO;
    const geo = getCountryGeo(this.marketCode);
    const gov = geo?.governorates.find(
      (g) => cleanGeoToken(g.nameEn) === cleanGeoToken(cap.cityEn) || cleanGeoToken(g.nameAr) === cleanGeoToken(cap.cityAr)
    );
    return {
      cityEn: cap.cityEn,
      cityAr: cap.cityAr,
      neighborhoodEn: cap.neighborhoodEn,
      neighborhoodAr: cap.neighborhoodAr,
      slug: gov?.slug ?? cap.cityEn.toLowerCase().replace(/\s+/g, '-'),
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
