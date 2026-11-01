import type { MarketCode, MarketGeoAdapter } from '../geo.types';
import { joAdapter } from './jo.adapter';
import { saAdapter } from './sa.adapter';
import { psAdapter } from './ps.adapter';
import { lbAdapter } from './lb.adapter';
import { syAdapter } from './sy.adapter';
import { kwAdapter } from './kw.adapter';

export const ADAPTER_REGISTRY: Record<MarketCode, MarketGeoAdapter> = {
  JO: joAdapter,
  SA: saAdapter,
  PS: psAdapter,
  LB: lbAdapter,
  SY: syAdapter,
  KW: kwAdapter,
};

export function getGeoAdapter(market: MarketCode): MarketGeoAdapter {
  return ADAPTER_REGISTRY[market] ?? ADAPTER_REGISTRY.JO;
}
