import { BaseMarketGeoAdapter, cleanGeoToken } from './base.adapter';
import { getCountryGeo } from '@/data/locations/registry';
import type { MarketCode, CanonicalLocation, LatLng } from '../geo.types';

export class SyriaGeoAdapter extends BaseMarketGeoAdapter {
  readonly marketCode: MarketCode = 'SY';

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
      hasakah: 'al-hasakah',
      hassakeh: 'al-hasakah',
      hasakeh: 'al-hasakah',
      qamishli: 'al-hasakah',
      suwayda: 'as-suwayda',
      sweida: 'as-suwayda',
      'rural damascus': 'rif-dimashq',
      dimashq: 'damascus',
      sham: 'damascus',
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

export const syAdapter = new SyriaGeoAdapter();
