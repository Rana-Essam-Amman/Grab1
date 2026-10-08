// RULE-14-EXCEPTION: Pricing matrix
// Strategic decision 2026-10-08: disruption via impulse pricing + 0% commission.
// Verified against Haraj (1% commission, 2390 SAR/yr store), OpenSooq (paid
// promotion), Dubizzle (109 AED / 7-day Featured), Motory (1% cars).
export interface CountryMonetizationPackage {
  countryCode: string;
  currency: string;
  currencySymbol: string;
  turboAdCost: number;
  autoBumpCost: number;
  featuredAdCost: number;
  vipStoreMonthlyCost: number;
}

export interface MonetizationMatrix {
  freeLimits: {
    generalCategoryLimit: number;
    premiumCategoryLimit: number;
    bumpDailyLimit: number;
    photoLimit: number;
  };
  packages: Record<string, CountryMonetizationPackage>;
}

export const MONETIZATION_MATRIX: MonetizationMatrix = {
  freeLimits: {
    generalCategoryLimit: 5,
    premiumCategoryLimit: 2,
    bumpDailyLimit: 3,
    photoLimit: 10,
  },
  packages: {
    JO: {
      countryCode: "JO",
      currency: "JOD",
      currencySymbol: "دينار",
      turboAdCost: 0.75,
      autoBumpCost: 1,
      featuredAdCost: 2,
      vipStoreMonthlyCost: 9.9,
    },
    SA: {
      countryCode: "SA",
      currency: "SAR",
      currencySymbol: "ر.س",
      turboAdCost: 4,
      autoBumpCost: 5,
      featuredAdCost: 9,
      vipStoreMonthlyCost: 39,
    },
    PS: {
      countryCode: "PS",
      currency: "ILS",
      currencySymbol: "شيكل",
      turboAdCost: 2,
      autoBumpCost: 3,
      featuredAdCost: 5,
      vipStoreMonthlyCost: 29,
    },
    LB: {
      countryCode: "LB",
      currency: "USD",
      currencySymbol: "$",
      turboAdCost: 0.69,
      autoBumpCost: 0.99,
      featuredAdCost: 1.49,
      vipStoreMonthlyCost: 9.99,
    },
    SY: {
      countryCode: "SY",
      currency: "USD",
      currencySymbol: "$",
      turboAdCost: 0.49,
      autoBumpCost: 0.79,
      featuredAdCost: 0.99,
      vipStoreMonthlyCost: 7.99,
    },
  },
};

export function getFreeAdLimitForCategory(categorySlug: string): number {
  const premiumCategories = ['motors', 'real-estate', 'سيارات', 'عقارات'];
  if (premiumCategories.includes(categorySlug.toLowerCase())) {
    return MONETIZATION_MATRIX.freeLimits.premiumCategoryLimit;
  }
  return MONETIZATION_MATRIX.freeLimits.generalCategoryLimit;
}

export function validateAdQuotaAvailability(
  listings: Array<{ countryCode?: string; sellerPhone?: string; userId?: string; categorySlug?: string }>,
  userId: string,
  countryCode: string,
  categorySlug: string,
  isVipShop?: boolean
): { allowed: boolean; activeCount: number; limit: number } {
  // VIP Merchant Store Unlimited Bypass Gate
  if (isVipShop) {
    return { allowed: true, activeCount: 0, limit: 999 };
  }

  const limit = getFreeAdLimitForCategory(categorySlug);
  
  // Count active listings for this user and country in this category branch
  const activeCount = listings.filter((l) => {
    const matchesUser = l.userId === userId || (!l.userId && userId);
    const matchesCountry = (l.countryCode || 'JO') === countryCode;
    const isPremiumCat = ['motors', 'real-estate'].includes(categorySlug.toLowerCase());
    const itemCat = (l.categorySlug || '').toLowerCase();
    const matchesCategory = isPremiumCat 
      ? ['motors', 'real-estate'].includes(itemCat) 
      : !['motors', 'real-estate'].includes(itemCat);

    return matchesUser && matchesCountry && matchesCategory;
  }).length;

  return {
    allowed: activeCount < limit,
    activeCount,
    limit,
  };
}

export function executeAutoBumpScheduler<T extends { isAutoBumpActive?: boolean; lastBumpedAt?: string; createdAt?: string }>(listings: T[]): T[] {
  const now = new Date().getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;
  return listings.map((l) => {
    if (l.isAutoBumpActive) {
      const lastBump = l.lastBumpedAt ? new Date(l.lastBumpedAt).getTime() : new Date(l.createdAt || now).getTime();
      if (now - lastBump > oneDayMs) {
        return {
          ...l,
          lastBumpedAt: new Date().toISOString(),
        };
      }
    }
    return l;
  });
}
