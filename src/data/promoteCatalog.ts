export type PromoteAccent = 'accent' | 'info' | 'success' | 'warning';
export type PromoteProductId = 'featured' | 'turbo' | 'auto-bump' | 'vip';
export type PromotePriceKey =
  | 'featuredAdCost'
  | 'turboAdCost'
  | 'autoBumpCost'
  | 'vipStoreMonthlyCost';

export interface PromoteCatalogEntry {
  readonly id: PromoteProductId;
  readonly emoji: string;
  readonly titleAr: string;
  readonly titleEn: string;
  readonly descAr: string;
  readonly descEn: string;
  readonly priceKey: PromotePriceKey;
  readonly durationAr: string;
  readonly durationEn: string;
  readonly accent: PromoteAccent;
  readonly badgeAr?: string;
  readonly badgeEn?: string;
}

export const PROMOTE_CATALOG: readonly PromoteCatalogEntry[] = [
  {
    id: 'featured',
    emoji: 'fluent-emoji:sparkles',
    titleAr: 'إعلان مميز',
    titleEn: 'Featured Ad',
    descAr: 'يتصدر نتائج البحث + شارة مميزة',
    descEn: 'Top of search + Featured badge',
    priceKey: 'featuredAdCost',
    durationAr: '7 أيام',
    durationEn: '7 days',
    accent: 'accent',
    badgeAr: 'الأكثر طلباً',
    badgeEn: 'Most popular',
  },
  {
    id: 'turbo',
    emoji: 'fluent-emoji:high-voltage',
    titleAr: 'رفع فوري',
    titleEn: 'Instant Boost',
    descAr: 'انقل إعلانك للقمة الآن',
    descEn: 'Move your ad to the top now',
    priceKey: 'turboAdCost',
    durationAr: 'فوري',
    durationEn: 'Instant',
    accent: 'info',
  },
  {
    id: 'auto-bump',
    emoji: 'fluent-emoji:repeat-button',
    titleAr: 'رفع تلقائي',
    titleEn: 'Auto-Bump',
    descAr: 'رفع كل 24 ساعة لـ 30 يوم',
    descEn: 'Auto-bump every 24h for 30 days',
    priceKey: 'autoBumpCost',
    durationAr: '30 يوم',
    durationEn: '30 days',
    accent: 'success',
  },
  {
    id: 'vip',
    emoji: 'fluent-emoji:crown',
    titleAr: 'متجر VIP',
    titleEn: 'VIP Store',
    descAr: 'إعلانات غير محدودة + صفحة متجر',
    descEn: 'Unlimited ads + store page',
    priceKey: 'vipStoreMonthlyCost',
    durationAr: 'شهرياً',
    durationEn: 'Monthly',
    accent: 'warning',
  },
];
