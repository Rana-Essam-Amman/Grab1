import { BaseMarketGeoAdapter, cleanGeoToken } from './base.adapter';
import { getCountryGeo } from '@/data/locations/registry';
import type { MarketCode, CanonicalLocation, LatLng } from '../geo.types';

export class JordanGeoAdapter extends BaseMarketGeoAdapter {
  readonly marketCode: MarketCode = 'JO';

  override resolveHierarchy(
    tokens: readonly string[],
    coords?: LatLng
  ): Omit<CanonicalLocation, 'countryCode'> | null {
    const geo = getCountryGeo(this.marketCode);
    if (!geo) return null;

    const cleaned = tokens.map(cleanGeoToken).filter(Boolean);
    if (cleaned.some((t) => t === 'عمان' || t === 'amman')) {
      const ammanGov = geo.governorates.find((g) => g.slug === 'amman');
      if (ammanGov) {
        for (const dist of ammanGov.districts) {
          const dAr = cleanGeoToken(dist.nameAr);
          const dEn = cleanGeoToken(dist.nameEn);
          if (cleaned.some((t) => t === dAr || t === dEn || t === dist.slug)) {
            return {
              governorateSlug: ammanGov.slug,
              governorateEn: ammanGov.nameEn,
              governorateAr: ammanGov.nameAr,
              districtSlug: dist.slug,
              districtEn: dist.nameEn,
              districtAr: dist.nameAr,
              neighborhoodSlug: null,
              neighborhoodEn: null,
              neighborhoodAr: null,
              coordinates: coords ?? null,
              confidence: 'high',
              resolutionSource: 'canonical_match',
              needsManualSelection: false,
            };
          }
        }
      }
    }

    return super.resolveHierarchy(tokens, coords);
  }
}

export const joAdapter = new JordanGeoAdapter();
