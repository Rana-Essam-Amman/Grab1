import type { ListingFieldOption } from '../listingFields/types';

export interface PhoneBrand {
  readonly slug: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly hasModels: boolean;
}

export const PHONE_BRANDS_REGISTRY: readonly PhoneBrand[] = [
  { slug: 'apple', nameAr: 'أبل', nameEn: 'Apple', hasModels: true },
  { slug: 'samsung', nameAr: 'سامسونج', nameEn: 'Samsung', hasModels: true },
  { slug: 'huawei', nameAr: 'هواوي', nameEn: 'Huawei', hasModels: true },
  { slug: 'xiaomi', nameAr: 'شاومي', nameEn: 'Xiaomi', hasModels: true },
  { slug: 'oppo', nameAr: 'أوبو', nameEn: 'Oppo', hasModels: true },
  { slug: 'vivo', nameAr: 'فيفو', nameEn: 'Vivo', hasModels: true },
  { slug: 'realme', nameAr: 'ريلمي', nameEn: 'Realme', hasModels: true },
  { slug: 'google', nameAr: 'جوجل', nameEn: 'Google', hasModels: true },
  { slug: 'sony', nameAr: 'سوني', nameEn: 'Sony', hasModels: true },
  { slug: 'nokia', nameAr: 'نوكيا', nameEn: 'Nokia', hasModels: false },
  { slug: 'oneplus', nameAr: 'ون بلس', nameEn: 'OnePlus', hasModels: true },
  { slug: 'motorola', nameAr: 'موتورولا', nameEn: 'Motorola', hasModels: false },
  { slug: 'honor', nameAr: 'هونر', nameEn: 'Honor', hasModels: true },
  { slug: 'infinix', nameAr: 'إنفينكس', nameEn: 'Infinix', hasModels: false },
  { slug: 'tecno', nameAr: 'تكنو', nameEn: 'Tecno', hasModels: false },
  { slug: 'tcl', nameAr: 'TCL', nameEn: 'TCL', hasModels: false },
  { slug: 'zte', nameAr: 'ZTE', nameEn: 'ZTE', hasModels: false },
  { slug: 'nothing', nameAr: 'ناثينغ', nameEn: 'Nothing', hasModels: true },
  { slug: 'asus', nameAr: 'أسوس', nameEn: 'Asus', hasModels: false },
  { slug: 'lenovo', nameAr: 'لينوفو', nameEn: 'Lenovo', hasModels: false },
  { slug: 'htc', nameAr: 'إتش تي سي', nameEn: 'HTC', hasModels: false },
  { slug: 'lg', nameAr: 'إل جي', nameEn: 'LG', hasModels: false },
  { slug: 'alcatel', nameAr: 'ألكاتل', nameEn: 'Alcatel', hasModels: false },
  { slug: 'meizu', nameAr: 'ميزو', nameEn: 'Meizu', hasModels: false },
  { slug: 'blackberry', nameAr: 'بلاك بيري', nameEn: 'BlackBerry', hasModels: false },
  { slug: 'sharp', nameAr: 'شارب', nameEn: 'Sharp', hasModels: false },
  { slug: 'panasonic', nameAr: 'باناسونيك', nameEn: 'Panasonic', hasModels: false },
  { slug: 'iqoo', nameAr: 'أيكو', nameEn: 'iQOO', hasModels: true },
  { slug: 'redmi', nameAr: 'ريدمي', nameEn: 'Redmi', hasModels: true },
  { slug: 'poco', nameAr: 'بوكو', nameEn: 'Poco', hasModels: true },
];

export function getPhoneBrandOptions(): ListingFieldOption[] {
  return PHONE_BRANDS_REGISTRY.map((b) => ({
    value: b.slug,
    labelAr: b.nameAr,
    labelEn: b.nameEn,
  }));
}
