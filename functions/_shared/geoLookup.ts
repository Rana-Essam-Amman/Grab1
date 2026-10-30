import type { CountryGeo, District } from '../../src/data/locations/types';
import JO_GEO from '../../src/data/locations/JO.geo';
import SA_GEO from '../../src/data/locations/SA.geo';
import LB_GEO from '../../src/data/locations/LB.geo';
import PS_GEO from '../../src/data/locations/PS.geo';
import SY_GEO from '../../src/data/locations/SY.geo';
import KW_GEO from '../../src/data/locations/KW.geo';

const GEO_BY_MARKET: Record<string, CountryGeo> = {
  JO: JO_GEO,
  SA: SA_GEO,
  LB: LB_GEO,
  PS: PS_GEO,
  SY: SY_GEO,
  KW: KW_GEO,
};

export function findDistrict(market: string, areaSlug: string): District | null {
  const geo = GEO_BY_MARKET[market.toUpperCase()];
  if (!geo) return null;
  for (const gov of geo.governorates) {
    for (const d of gov.districts) {
      if (d.slug === areaSlug) return d;
    }
  }
  return null;
}

export function listAllDistricts(market: string): readonly District[] {
  const geo = GEO_BY_MARKET[market.toUpperCase()];
  if (!geo) return [];
  const out: District[] = [];
  for (const gov of geo.governorates) {
    for (const d of gov.districts) {
      out.push(d);
    }
  }
  return out;
}
