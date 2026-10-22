import type { GenericBrand, GenericModel } from '@/features/post-wizard/helpers/genericModelHelpers';

export const CAMERA_BRANDS: readonly GenericBrand[] = [
  { slug: 'canon', nameAr: 'كانون', nameEn: 'Canon' },
  { slug: 'nikon', nameAr: 'نايكون', nameEn: 'Nikon' },
  { slug: 'sony', nameAr: 'سوني', nameEn: 'Sony' },
  { slug: 'fujifilm', nameAr: 'فوجي فيلم', nameEn: 'Fujifilm' },
  { slug: 'panasonic', nameAr: 'باناسونيك', nameEn: 'Panasonic' },
  { slug: 'om_system', nameAr: 'أو إم سيستم', nameEn: 'OM System' },
  { slug: 'gopro', nameAr: 'جو برو', nameEn: 'GoPro' },
  { slug: 'dji', nameAr: 'دي جي آي', nameEn: 'DJI' },
];

export const CAMERA_MODELS: Record<string, readonly GenericModel[]> = {
  canon: [
    { slug: 'eos-r5', nameAr: 'إي أو إس آر 5', nameEn: 'EOS R5', releaseYear: 2020 },
    { slug: 'eos-r6-mark-ii', nameAr: 'إي أو إس آر 6 مارك 2', nameEn: 'EOS R6 Mark II', releaseYear: 2022 },
    { slug: 'eos-r8', nameAr: 'إي أو إس آر 8', nameEn: 'EOS R8', releaseYear: 2023 },
    { slug: 'eos-r50', nameAr: 'إي أو إس آر 50', nameEn: 'EOS R50', releaseYear: 2023 },
    { slug: 'eos-r100', nameAr: 'إي أو إس آر 100', nameEn: 'EOS R100', releaseYear: 2023 },
  ],
  nikon: [
    { slug: 'z9', nameAr: 'زد 9', nameEn: 'Z9', releaseYear: 2021 },
    { slug: 'z8', nameAr: 'زد 8', nameEn: 'Z8', releaseYear: 2023 },
    { slug: 'z7-ii', nameAr: 'زد 7 مارك 2', nameEn: 'Z7 II', releaseYear: 2020 },
    { slug: 'z6-ii', nameAr: 'زد 6 مارك 2', nameEn: 'Z6 II', releaseYear: 2020 },
    { slug: 'z50', nameAr: 'زد 50', nameEn: 'Z50', releaseYear: 2019 },
  ],
  sony: [
    { slug: 'alpha-1', nameAr: 'ألفا 1', nameEn: 'Alpha 1', releaseYear: 2021 },
    { slug: 'a7-iv', nameAr: 'إيه 7 مارك 4', nameEn: 'Alpha A7 IV', releaseYear: 2021 },
    { slug: 'a7r-v', nameAr: 'إيه 7 آر 5', nameEn: 'Alpha A7R V', releaseYear: 2022 },
    { slug: 'a7s-iii', nameAr: 'إيه 7 إس 3', nameEn: 'Alpha A7S III', releaseYear: 2020 },
    { slug: 'a6700', nameAr: 'إيه 6700', nameEn: 'Alpha A6700', releaseYear: 2023 },
    { slug: 'zv-e10', nameAr: 'زد في إي 10', nameEn: 'ZV-E10', releaseYear: 2021 },
  ],
  fujifilm: [
    { slug: 'x-t5', nameAr: 'إكس تي 5', nameEn: 'X-T5', releaseYear: 2022 },
    { slug: 'x-h2', nameAr: 'إكس إتش 2', nameEn: 'X-H2', releaseYear: 2022 },
    { slug: 'x-s20', nameAr: 'إكس إس 20', nameEn: 'X-S20', releaseYear: 2023 },
    { slug: 'x100v', nameAr: 'إكس 100 في', nameEn: 'X100V', releaseYear: 2020 },
    { slug: 'x100vi', nameAr: 'إكس 100 في آي', nameEn: 'X100VI', releaseYear: 2024 },
  ],
  panasonic: [
    { slug: 'lumix-s5-ii', nameAr: 'لوميكس إس 5 مارك 2', nameEn: 'Lumix S5 II', releaseYear: 2023 },
    { slug: 'gh6', nameAr: 'جي إتش 6', nameEn: 'Lumix GH6', releaseYear: 2022 },
    { slug: 'g9-ii', nameAr: 'جي 9 مارك 2', nameEn: 'Lumix G9 II', releaseYear: 2023 },
  ],
  om_system: [
    { slug: 'om-1', nameAr: 'أو إم 1', nameEn: 'OM-1', releaseYear: 2022 },
    { slug: 'om-5', nameAr: 'أو إم 5', nameEn: 'OM-5', releaseYear: 2022 },
  ],
  gopro: [
    { slug: 'hero-12', nameAr: 'هيرو 12', nameEn: 'HERO12 Black', releaseYear: 2023 },
    { slug: 'hero-11', nameAr: 'هيرو 11', nameEn: 'HERO11 Black', releaseYear: 2022 },
    { slug: 'max', nameAr: 'ماكس', nameEn: 'MAX 360', releaseYear: 2019 },
  ],
  dji: [
    { slug: 'osmo-action-4', nameAr: 'أوزمو أكشن 4', nameEn: 'Osmo Action 4', releaseYear: 2023 },
    { slug: 'pocket-3', nameAr: 'بوكيت 3', nameEn: 'Osmo Pocket 3', releaseYear: 2023 },
    { slug: 'mini-4-pro', nameAr: 'ميني 4 برو', nameEn: 'Mini 4 Pro', releaseYear: 2023 },
  ],
};
