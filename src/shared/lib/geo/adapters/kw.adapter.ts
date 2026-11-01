import { BaseMarketGeoAdapter, cleanGeoToken } from './base.adapter';
import { getCountryGeo } from '@/data/locations/registry';
import type { MarketCode, CanonicalLocation, LatLng } from '../geo.types';

export class KuwaitGeoAdapter extends BaseMarketGeoAdapter {
  readonly marketCode: MarketCode = 'KW';

  override resolveHierarchy(
    tokens: readonly string[],
    coords?: LatLng
  ): Omit<CanonicalLocation, 'countryCode'> | null {
    const geo = getCountryGeo(this.marketCode);
    if (!geo) return null;

    const baseResult = super.resolveHierarchy(tokens, coords);
    if (baseResult) return baseResult;

    const cleaned = tokens.map(cleanGeoToken).filter(Boolean);
    const aliases: Record<string, string> = {
      'kuwait city': 'al-asimah',
      'capital': 'al-asimah',
      'al asimah': 'al-asimah',
      'farwaniya': 'al-farwaniya',
      'ahmadi': 'al-ahmadi',
      'jahra': 'al-jahra',
      'salmiya': 'hawalli',
    };

    for (const t of cleaned) {
      const mappedSlug = aliases[t];
      if (mappedSlug) {
        const gov = geo.governorates.find((g) => g.slug === mappedSlug);
        if (gov) {
          return {
            governorateSlug: gov.slug,
            governorateEn: gov.nameEn,
            governorateAr: gov.nameAr,
            districtSlug: null,
            districtEn: null,
            districtAr: null,
            neighborhoodSlug: null,
            neighborhoodEn: null,
            neighborhoodAr: null,
            coordinates: coords ?? null,
            confidence: 'approximate',
            resolutionSource: 'canonical_match',
            needsManualSelection: false,
          };
        }
      }
    }

    return null;
  }
}

export const kwAdapter = new KuwaitGeoAdapter();
