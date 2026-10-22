import type { GenericBrand, GenericModel } from '@/features/post-wizard/helpers/genericModelHelpers';

export const LAPTOP_BRANDS: readonly GenericBrand[] = [
  { slug: 'apple', nameAr: 'أبل', nameEn: 'Apple' },
  { slug: 'dell', nameAr: 'ديل', nameEn: 'Dell' },
  { slug: 'hp', nameAr: 'إتش بي', nameEn: 'HP' },
  { slug: 'lenovo', nameAr: 'لينوفو', nameEn: 'Lenovo' },
  { slug: 'asus', nameAr: 'أسوس', nameEn: 'Asus' },
  { slug: 'acer', nameAr: 'أيسر', nameEn: 'Acer' },
  { slug: 'msi', nameAr: 'إم إس آي', nameEn: 'MSI' },
  { slug: 'microsoft', nameAr: 'مايكروسوفت', nameEn: 'Microsoft' },
  { slug: 'razer', nameAr: 'ريزر', nameEn: 'Razer' },
  { slug: 'samsung', nameAr: 'سامسونج', nameEn: 'Samsung' },
];

export const LAPTOP_MODELS: Record<string, readonly GenericModel[]> = {
  apple: [
    { slug: 'macbook-pro-14-m3', nameAr: 'ماك بوك برو 14 إم 3', nameEn: 'MacBook Pro 14 M3', releaseYear: 2023 },
    { slug: 'macbook-pro-16-m3-pro', nameAr: 'ماك بوك برو 16 إم 3 برو', nameEn: 'MacBook Pro 16 M3 Pro', releaseYear: 2023 },
    { slug: 'macbook-air-13-m3', nameAr: 'ماك بوك إير 13 إم 3', nameEn: 'MacBook Air 13 M3', releaseYear: 2024 },
    { slug: 'macbook-air-15-m3', nameAr: 'ماك بوك إير 15 إم 3', nameEn: 'MacBook Air 15 M3', releaseYear: 2024 },
  ],
  dell: [
    { slug: 'xps-13', nameAr: 'إكس بي إس 13', nameEn: 'XPS 13' },
    { slug: 'xps-15', nameAr: 'إكس بي إس 15', nameEn: 'XPS 15' },
    { slug: 'xps-17', nameAr: 'إكس بي إس 17', nameEn: 'XPS 17' },
    { slug: 'inspiron-15', nameAr: 'إنسبيرون 15', nameEn: 'Inspiron 15' },
    { slug: 'alienware-m15', nameAr: 'ألينوير إم 15', nameEn: 'Alienware m15' },
    { slug: 'alienware-m18', nameAr: 'ألينوير إم 18', nameEn: 'Alienware m18' },
  ],
  hp: [
    { slug: 'spectre-x360', nameAr: 'سبيكتر إكس 360', nameEn: 'Spectre x360' },
    { slug: 'envy-x360', nameAr: 'إنفي إكس 360', nameEn: 'Envy x360' },
    { slug: 'pavilion-15', nameAr: 'بافيليون 15', nameEn: 'Pavilion 15' },
    { slug: 'omen-16', nameAr: 'أومين 16', nameEn: 'Omen 16' },
    { slug: 'victus-15', nameAr: 'فيكتوس 15', nameEn: 'Victus 15' },
    { slug: 'elitebook-840', nameAr: 'إيليت بوك 840', nameEn: 'EliteBook 840' },
  ],
  lenovo: [
    { slug: 'thinkpad-x1-carbon', nameAr: 'ثينك باد إكس 1 كربون', nameEn: 'ThinkPad X1 Carbon' },
    { slug: 'thinkpad-t14', nameAr: 'ثينك باد تي 14', nameEn: 'ThinkPad T14' },
    { slug: 'ideapad-slim-5', nameAr: 'آيديا باد سليم 5', nameEn: 'IdeaPad Slim 5' },
    { slug: 'yoga-9i', nameAr: 'يوغا 9 آي', nameEn: 'Yoga 9i' },
    { slug: 'legion-5-pro', nameAr: 'ليجيون 5 برو', nameEn: 'Legion 5 Pro' },
  ],
  asus: [
    { slug: 'rog-zephyrus-g14', nameAr: 'روج زيفيروس جي 14', nameEn: 'ROG Zephyrus G14' },
    { slug: 'rog-zephyrus-g16', nameAr: 'روج زيفيروس جي 16', nameEn: 'ROG Zephyrus G16' },
    { slug: 'tuf-a15', nameAr: 'تاف إيه 15', nameEn: 'TUF A15' },
    { slug: 'zenbook-14', nameAr: 'زين بوك 14', nameEn: 'Zenbook 14' },
    { slug: 'vivobook-15', nameAr: 'فيفو بوك 15', nameEn: 'Vivobook 15' },
  ],
  acer: [
    { slug: 'swift-3', nameAr: 'سويفت 3', nameEn: 'Swift 3' },
    { slug: 'swift-5', nameAr: 'سويفت 5', nameEn: 'Swift 5' },
    { slug: 'aspire-5', nameAr: 'أسباير 5', nameEn: 'Aspire 5' },
    { slug: 'predator-helios-16', nameAr: 'بريدايتور هيليوس 16', nameEn: 'Predator Helios 16' },
    { slug: 'nitro-5', nameAr: 'نيترو 5', nameEn: 'Nitro 5' },
  ],
  msi: [
    { slug: 'raider-ge78', nameAr: 'رايدر جي إي 78', nameEn: 'Raider GE78' },
    { slug: 'stealth-16', nameAr: 'ستيلث 16', nameEn: 'Stealth 16' },
    { slug: 'katana-15', nameAr: 'كاتانا 15', nameEn: 'Katana 15' },
    { slug: 'cyborg-15', nameAr: 'سايبورغ 15', nameEn: 'Cyborg 15' },
  ],
  microsoft: [
    { slug: 'surface-laptop-5', nameAr: 'سيرفس لابتوب 5', nameEn: 'Surface Laptop 5' },
    { slug: 'surface-laptop-studio-2', nameAr: 'سيرفس لابتوب ستوديو 2', nameEn: 'Surface Laptop Studio 2' },
    { slug: 'surface-pro-9', nameAr: 'سيرفس برو 9', nameEn: 'Surface Pro 9' },
  ],
  razer: [
    { slug: 'blade-14', nameAr: 'بليد 14', nameEn: 'Blade 14' },
    { slug: 'blade-15', nameAr: 'بليد 15', nameEn: 'Blade 15' },
    { slug: 'blade-16', nameAr: 'بليد 16', nameEn: 'Blade 16' },
  ],
  samsung: [
    { slug: 'galaxy-book-3-pro', nameAr: 'جالاكسي بوك 3 برو', nameEn: 'Galaxy Book 3 Pro' },
    { slug: 'galaxy-book-3-ultra', nameAr: 'جالاكسي بوك 3 ألترا', nameEn: 'Galaxy Book 3 Ultra' },
  ],
};
