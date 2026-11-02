import { BaseMarketGeoAdapter, cleanGeoToken } from './base.adapter';
import { getCountryGeo } from '@/data/locations/registry';
import type { MarketCode, CanonicalLocation, LatLng } from '../geo.types';

export class LebanonGeoAdapter extends BaseMarketGeoAdapter {
  readonly marketCode: MarketCode = 'LB';

  override resolveHierarchy(
    tokens: readonly string[],
    coords?: LatLng
  ): Omit<CanonicalLocation, 'countryCode'> | null {
    const geo = getCountryGeo(this.marketCode);
    if (!geo) return null;

    const baseResult = super.resolveHierarchy(tokens, coords);
    if (baseResult) return baseResult;

    const cleaned = tokens.map(cleanGeoToken).filter(Boolean);
    const cazaToGovMap: Record<string, string> = {
      baabda: 'mount-lebanon',
      metn: 'mount-lebanon',
      matn: 'mount-lebanon',
      chouf: 'mount-lebanon',
      aley: 'mount-lebanon',
      keserwan: 'mount-lebanon',
      jbeil: 'mount-lebanon',
      tripoli: 'north-lebanon',
      batroun: 'north-lebanon',
      koura: 'north-lebanon',
      saida: 'south-lebanon',
      tyre: 'south-lebanon',
      sour: 'south-lebanon',
      zahle: 'beqaa',
    };

    for (const t of cleaned) {
      const mappedGovSlug = cazaToGovMap[t];
      if (mappedGovSlug) {
        const gov = geo.governorates.find((g) => g.slug === mappedGovSlug);
        const dist = gov?.districts.find(
          (d) => cleanGeoToken(d.slug) === t || cleanGeoToken(d.nameEn) === t
        );
        if (gov) {
          return {
            governorateSlug: gov.slug,
            governorateEn: gov.nameEn,
            governorateAr: gov.nameAr,
            districtSlug: dist?.slug ?? null,
            districtEn: dist?.nameEn ?? null,
            districtAr: dist?.nameAr ?? null,
            neighborhoodSlug: null,
            neighborhoodEn: null,
            neighborhoodAr: null,
            coordinates: coords ?? null,
            confidence: dist ? 'high' : 'approximate',
            resolutionSource: 'canonical_match',
            needsManualSelection: false,
          };
        }
      }
    }

    return null;
  }
}

export const lbAdapter = new LebanonGeoAdapter();
