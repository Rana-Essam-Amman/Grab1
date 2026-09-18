// RULE-14-EXCEPTION: Pricing matrix
export interface CountryMonetizationPackage {
  countryCode: string;
  currency: string;
  currencySymbol: string;
  turboAdCost: number;
  autoBumpCost: number;
  vipStoreMonthlyCost: number;
}

export interface MonetizationMatrix {
  freeLimits: {
    generalCategoryLimit: number; // 5 for electronics, fashion, etc.
    premiumCategoryLimit: number; // 2 for motors, real-estate
  };
  packages: Record<string, CountryMonetizationPackage>;
}

export const MONETIZATION_MATRIX: MonetizationMatrix = {
  freeLimits: {
    generalCategoryLimit: 5,
    premiumCategoryLimit: 2,
  },
  packages: {
    JO: {
      countryCode: 'JO',
      currency: 'JOD',
      currencySymbol: 'دينار',
      turboAdCost: 3,
      autoBumpCost: 1.5,
      vipStoreMonthlyCost: 19,
    },
    LB: {
      countryCode: 'LB',
      currency: 'LBP',
      currencySymbol: 'ليرة',
      turboAdCost: 270000,
      autoBumpCost: 135000,
      vipStoreMonthlyCost: 1700000,
    },
    PS: {
      countryCode: 'PS',
      currency: 'ILS',
      currencySymbol: 'شيكل',
      turboAdCost: 15,
      autoBumpCost: 7,
      vipStoreMonthlyCost: 95,
    },
    SY: {
      countryCode: 'SY',
      currency: 'SYP',
      currencySymbol: 'ليرة',
      turboAdCost: 60000,
      autoBumpCost: 30000,
      vipStoreMonthlyCost: 380000,
    },
    SA: {
      countryCode: 'SA',
      currency: 'SAR',
      currencySymbol: 'ر.س',
      turboAdCost: 15,
      autoBumpCost: 7.5,
      vipStoreMonthlyCost: 95,
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
