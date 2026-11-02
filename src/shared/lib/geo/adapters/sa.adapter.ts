import { BaseMarketGeoAdapter, cleanGeoToken } from './base.adapter';
import { getCountryGeo } from '@/data/locations/registry';
import type { MarketCode, CanonicalLocation, LatLng } from '../geo.types';

export class SaudiGeoAdapter extends BaseMarketGeoAdapter {
  readonly marketCode: MarketCode = 'SA';

  override resolveHierarchy(
    tokens: readonly string[],
    coords?: LatLng
  ): Omit<CanonicalLocation, 'countryCode'> | null {
    const geo = getCountryGeo(this.marketCode);
    if (!geo) return null;

    const baseResult = super.resolveHierarchy(tokens, coords);
    if (baseResult) return baseResult;

    const cleaned = tokens.map(cleanGeoToken).filter(Boolean);
    const regionAliases: Record<string, string> = {
      buraidah: 'qassim',
      buraydah: 'qassim',
      dammam: 'eastern-province',
      khobar: 'eastern-province',
      dhahran: 'eastern-province',
      jubail: 'eastern-province',
      qatif: 'eastern-province',
      abha: 'asir',
      khamis: 'asir',
      'khamis-mushait': 'asir',
      hail: 'hail',
      jizan: 'jazan',
      jazan: 'jazan',
      jeddah: 'makkah-region',
      taif: 'makkah-region',
    };

    for (const t of cleaned) {
      const mappedGovSlug = regionAliases[t];
      if (mappedGovSlug) {
        const gov = geo.governorates.find((g) => g.slug === mappedGovSlug);
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

export const saAdapter = new SaudiGeoAdapter();
