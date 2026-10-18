// RULE-14-EXCEPTION: Pricing matrix
// Strategic decision 2026-10-08: disruption via impulse pricing + 0% commission.
// Verified against Haraj (1% commission, 2390 SAR/yr store), OpenSooq (paid
// promotion), Dubizzle (109 AED / 7-day Featured), Motory (1% cars).
export interface CountryMonetizationPackage {
  countryCode: string;
  currency: string;
  currencySymbol: string;
  turboAdCost: number;
  featuredAdCost: number;
}

export interface MonetizationMatrix {
  freeLimits: {
    generalCategoryLimit: number;
    photoLimit: number;
  };
  packages: Record<string, CountryMonetizationPackage>;
}

export const MONETIZATION_MATRIX: MonetizationMatrix = {
  freeLimits: {
    generalCategoryLimit: 20,
    photoLimit: 10,
  },
  packages: {
    JO: {
      countryCode: "JO",
      currency: "JOD",
      currencySymbol: "دينار",
      turboAdCost: 0.75,
      featuredAdCost: 2,
    },
    SA: {
      countryCode: "SA",
      currency: "SAR",
      currencySymbol: "ر.س",
      turboAdCost: 4,
      featuredAdCost: 9,
    },
    PS: {
      countryCode: "PS",
      currency: "ILS",
      currencySymbol: "شيكل",
      turboAdCost: 2,
      featuredAdCost: 5,
    },
    LB: {
      countryCode: "LB",
      currency: "USD",
      currencySymbol: "$",
      turboAdCost: 0.69,
      featuredAdCost: 1.49,
    },
    SY: {
      countryCode: "SY",
      currency: "USD",
      currencySymbol: "$",
      turboAdCost: 0.49,
      featuredAdCost: 0.99,
    },
  },
};

export function validateAdQuotaAvailability(
  listings: Array<{ countryCode?: string; sellerPhone?: string; userId?: string; categorySlug?: string }>,
  userId: string,
  countryCode: string,
  _categorySlug: string,
  isVipShop?: boolean
): { allowed: boolean; activeCount: number; limit: number } {
  // VIP Merchant Store Unlimited Bypass Gate
  if (isVipShop) {
    return { allowed: true, activeCount: 0, limit: 999 };
  }
  const limit = MONETIZATION_MATRIX.freeLimits.generalCategoryLimit;

  // Count active listings for this user in this country (matches DB trigger)
  const activeCount = listings.filter((l) => {
    const matchesUser = l.userId === userId || (!l.userId && userId);
    const matchesCountry = (l.countryCode || 'JO') === countryCode;
    return matchesUser && matchesCountry;
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
