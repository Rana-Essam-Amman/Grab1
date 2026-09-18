export enum MismatchPolicy {
  silent = 'silent',
  confirm = 'confirm',
}

export const mismatchPolicy: MismatchPolicy = MismatchPolicy.confirm;

export interface CategoryHint {
  categorySlug: string;
  subcategorySlug: string;
  labelAr: string;
  labelEn: string;
}

export const textSignals: Record<string, CategoryHint> = {
  كامري: { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for sale' },
  camry: { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for sale' },
  تويوتا: { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for sale' },
  toyota: { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for sale' },
  سيارة: { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for sale' },
  'للبيع سيارة': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for sale' },
  شقة: { categorySlug: 'real-estate', subcategorySlug: 'for-sale', labelAr: 'عقارات للبيع', labelEn: 'Property for sale' },
  فيلا: { categorySlug: 'real-estate', subcategorySlug: 'for-sale', labelAr: 'عقارات للبيع', labelEn: 'Property for sale' },
  أرض: { categorySlug: 'real-estate', subcategorySlug: 'lands', labelAr: 'أراضي للبيع', labelEn: 'Lands for sale' },
  كنب: { categorySlug: 'furniture', subcategorySlug: 'living', labelAr: 'أثاث غرف جلوس', labelEn: 'Living Room Furniture' },
  كنبة: { categorySlug: 'furniture', subcategorySlug: 'living', labelAr: 'أثاث غرف جلوس', labelEn: 'Living Room Furniture' },
  طاولة: { categorySlug: 'furniture', subcategorySlug: 'tables', labelAr: 'طاولات وسفرة', labelEn: 'Dining & Tables' },
  آيفون: { categorySlug: 'mobiles', subcategorySlug: 'phones', labelAr: 'هواتف محمولة', labelEn: 'Mobile Phones' },
  iphone: { categorySlug: 'mobiles', subcategorySlug: 'phones', labelAr: 'هواتف محمولة', labelEn: 'Mobile Phones' },
  سامسونج: { categorySlug: 'mobiles', subcategorySlug: 'phones', labelAr: 'هواتف محمولة', labelEn: 'Mobile Phones' },
  ساعة: { categorySlug: 'watches', subcategorySlug: 'luxury', labelAr: 'ساعات فاخرة', labelEn: 'Luxury Watches' },
  rolex: { categorySlug: 'watches', subcategorySlug: 'luxury', labelAr: 'ساعات فاخرة', labelEn: 'Luxury Watches' },
  رولكس: { categorySlug: 'watches', subcategorySlug: 'luxury', labelAr: 'ساعات فاخرة', labelEn: 'Luxury Watches' },
  لابتوب: { categorySlug: 'computers', subcategorySlug: 'laptops', labelAr: 'لابتوبات', labelEn: 'Laptops' },
  laptop: { categorySlug: 'computers', subcategorySlug: 'laptops', labelAr: 'لابتوبات', labelEn: 'Laptops' },
  ماكبوك: { categorySlug: 'computers', subcategorySlug: 'laptops', labelAr: 'لابتوبات', labelEn: 'Laptops' },
};

export interface CategoryMatch {
  chosenCategory: string;
  chosenSub: string;
  effectiveCategory: string;
  effectiveSub: string;
  mismatch: boolean;
  suggested?: CategoryHint;
}

export function hintFromNote(raw: string): CategoryHint | null {
  const t = raw.toLowerCase();
  for (const [key, val] of Object.entries(textSignals)) {
    if (t.includes(key.toLowerCase())) {
      return val;
    }
  }
  return null;
}

export function matchCategory({
  chosenCategory,
  chosenSub,
  note,
  visionHint,
}: {
  chosenCategory: string;
  chosenSub: string;
  note: string;
  visionHint?: CategoryHint;
}): CategoryMatch {
  const hinted = visionHint || hintFromNote(note);
  if (!hinted || hinted.categorySlug === chosenCategory) {
    return {
      chosenCategory,
      chosenSub,
      effectiveCategory: chosenCategory,
      effectiveSub: chosenSub,
      mismatch: false,
    };
  }

  const silent = mismatchPolicy === MismatchPolicy.silent;
  return {
    chosenCategory,
    chosenSub,
    effectiveCategory: silent ? hinted.categorySlug : chosenCategory,
    effectiveSub: silent ? hinted.subcategorySlug : chosenSub,
    mismatch: true,
    suggested: hinted,
  };
}
