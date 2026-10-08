import { MONETIZATION_MATRIX } from '@/data/monetization';
import { PROMOTE_CATALOG } from '@/data/promoteCatalog';
import type { PromoteOption, PromoteProduct } from '../components/PromoteOptionCard';

type Pkg = typeof MONETIZATION_MATRIX.packages.JO;

export function buildPromoteOptions(pkg: Pkg): readonly PromoteOption[] {
  return PROMOTE_CATALOG.map((e) => ({
    id: e.id,
    emoji: e.emoji,
    titleAr: e.titleAr,
    titleEn: e.titleEn,
    descAr: e.descAr,
    descEn: e.descEn,
    price: pkg[e.priceKey],
    currency: pkg.currencySymbol,
    durationAr: e.durationAr,
    durationEn: e.durationEn,
    accent: e.accent,
    badgeAr: e.badgeAr,
    badgeEn: e.badgeEn,
  }));
}

export const PROMOTE_TYPE_MAP: Record<
  PromoteProduct,
  'featured-ad' | 'turbo-ad' | 'auto-bump' | 'vip-store'
> = {
  featured: 'featured-ad',
  turbo: 'turbo-ad',
  'auto-bump': 'auto-bump',
  vip: 'vip-store',
};

export function getPromotePrice(pkg: Pkg, product: PromoteProduct): number {
  const map: Record<PromoteProduct, number> = {
    featured: pkg.featuredAdCost,
    turbo: pkg.turboAdCost,
    'auto-bump': pkg.autoBumpCost,
    vip: pkg.vipStoreMonthlyCost,
  };
  return map[product];
}
