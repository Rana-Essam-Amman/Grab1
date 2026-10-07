export interface CategoryMeta {
  readonly nameAr: string;
  readonly nameEn: string;
}

// Mirror of src/data/categories.ts slugs (subset used for SEO titles).
export const CATEGORY_META: Record<string, CategoryMeta> = {
  motors: { nameAr: 'سيارات ومركبات', nameEn: 'Motors' },
  'real-estate': { nameAr: 'عقارات', nameEn: 'Real Estate' },
  mobiles: { nameAr: 'موبايلات وتابلت', nameEn: 'Mobiles & Tablets' },
  watches: { nameAr: 'ساعات وإكسسوار', nameEn: 'Watches' },
  computers: { nameAr: 'كمبيوتر وشاشات', nameEn: 'Computers' },
  electronics: { nameAr: 'أجهزة وإلكترونيات', nameEn: 'Electronics' },
  furniture: { nameAr: 'أثاث وديكور', nameEn: 'Furniture' },
  fashion: { nameAr: 'أزياء وملابس', nameEn: 'Fashion' },
  services: { nameAr: 'خدمات', nameEn: 'Services' },
  jobs: { nameAr: 'وظائف', nameEn: 'Jobs' },
  kids: { nameAr: 'أطفال وألعاب', nameEn: 'Baby & Kids' },
  beauty: { nameAr: 'عناية وجمال', nameEn: 'Beauty & Personal' },
  pets: { nameAr: 'حيوانات', nameEn: 'Pets' },
  sports: { nameAr: 'رياضة وتخييم', nameEn: 'Sports & Outdoors' },
  books: { nameAr: 'كتب وهوايات', nameEn: 'Books & Hobbies' },
  'home-garden': { nameAr: 'حديقة ومنزل', nameEn: 'Home & Garden' },
  krakeeb: { nameAr: 'أغراض متفرقة', nameEn: 'Miscellaneous' },
  cleaning: { nameAr: 'تنظيف', nameEn: 'Cleaning' },
  handymen: { nameAr: 'صنايعي', nameEn: 'Handymen' },
  projects: { nameAr: 'مشاريع للبيع أو للشراكة', nameEn: 'Projects & Business' },
};

export const MARKET_AR: Record<string, string> = {
  JO: 'الأردن',
  SA: 'السعودية',
  LB: 'لبنان',
  PS: 'فلسطين',
  SY: 'سوريا',
};

export const MARKET_EN: Record<string, string> = {
  JO: 'Jordan',
  SA: 'Saudi Arabia',
  LB: 'Lebanon',
  PS: 'Palestine',
  SY: 'Syria',
};

export function categoryTitle(market: string, category: string): string {
  const c = CATEGORY_META[category] ?? { nameAr: category, nameEn: category };
  const mAr = MARKET_AR[market] ?? market;
  return `${c.nameAr} للبيع في ${mAr} — FOX Marketplace`;
}

export function categoryDescription(market: string, category: string): string {
  const c = CATEGORY_META[category] ?? { nameAr: category, nameEn: category };
  const mAr = MARKET_AR[market] ?? market;
  return `تصفح أحدث ${c.nameAr} المعروضة للبيع في ${mAr}. إعلانات محدّثة يومياً — تواصل مباشر مع البائعين على FOX Marketplace.`;
}
