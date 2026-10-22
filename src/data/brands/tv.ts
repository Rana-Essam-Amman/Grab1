import type { GenericBrand, GenericModel } from '@/features/post-wizard/helpers/genericModelHelpers';

export const TV_BRANDS: readonly GenericBrand[] = [
  { slug: 'samsung', nameAr: 'سامسونج', nameEn: 'Samsung' },
  { slug: 'lg', nameAr: 'إل جي', nameEn: 'LG' },
  { slug: 'sony', nameAr: 'سوني', nameEn: 'Sony' },
  { slug: 'tcl', nameAr: 'تي سي إل', nameEn: 'TCL' },
  { slug: 'hisense', nameAr: 'هايسنس', nameEn: 'Hisense' },
  { slug: 'philips', nameAr: 'فيليبس', nameEn: 'Philips' },
  { slug: 'xiaomi', nameAr: 'شاومي', nameEn: 'Xiaomi' },
  { slug: 'sharp', nameAr: 'شارب', nameEn: 'Sharp' },
  { slug: 'toshiba', nameAr: 'توشيبا', nameEn: 'Toshiba' },
  { slug: 'panasonic', nameAr: 'باناسونيك', nameEn: 'Panasonic' },
];

export const TV_MODELS: Record<string, readonly GenericModel[]> = {
  samsung: [
    { slug: 'qn90c', nameAr: 'كيو إن 90 سي', nameEn: 'QN90C Neo QLED', releaseYear: 2023 },
    { slug: 'qn85c', nameAr: 'كيو إن 85 سي', nameEn: 'QN85C Neo QLED', releaseYear: 2023 },
    { slug: 's90c', nameAr: 'إس 90 سي', nameEn: 'S90C OLED', releaseYear: 2023 },
    { slug: 's95c', nameAr: 'إس 95 سي', nameEn: 'S95C OLED', releaseYear: 2023 },
    { slug: 'q80c', nameAr: 'كيو 80 سي', nameEn: 'Q80C QLED', releaseYear: 2023 },
    { slug: 'q60c', nameAr: 'كيو 60 سي', nameEn: 'Q60C QLED', releaseYear: 2023 },
    { slug: 'the-frame-2023', nameAr: 'ذا فريم', nameEn: 'The Frame', releaseYear: 2023 },
  ],
  lg: [
    { slug: 'c3', nameAr: 'سي 3', nameEn: 'C3 OLED', releaseYear: 2023 },
    { slug: 'g3', nameAr: 'جي 3', nameEn: 'G3 OLED', releaseYear: 2023 },
    { slug: 'b3', nameAr: 'بي 3', nameEn: 'B3 OLED', releaseYear: 2023 },
    { slug: 'a3', nameAr: 'إيه 3', nameEn: 'A3 OLED', releaseYear: 2023 },
    { slug: 'qned85', nameAr: 'كيونيد 85', nameEn: 'QNED85', releaseYear: 2023 },
    { slug: 'qned80', nameAr: 'كيونيد 80', nameEn: 'QNED80', releaseYear: 2023 },
  ],
  sony: [
    { slug: 'a95l', nameAr: 'إيه 95 إل', nameEn: 'Bravia A95L QD-OLED', releaseYear: 2023 },
    { slug: 'a80l', nameAr: 'إيه 80 إل', nameEn: 'Bravia A80L OLED', releaseYear: 2023 },
    { slug: 'x90l', nameAr: 'إكس 90 إل', nameEn: 'Bravia X90L', releaseYear: 2023 },
    { slug: 'x85l', nameAr: 'إكس 85 إل', nameEn: 'Bravia X85L', releaseYear: 2023 },
    { slug: 'x80l', nameAr: 'إكس 80 إل', nameEn: 'Bravia X80L', releaseYear: 2023 },
    { slug: 'bravia-9', nameAr: 'برافيا 9', nameEn: 'Bravia 9 Mini LED', releaseYear: 2024 },
  ],
  tcl: [
    { slug: 'c845', nameAr: 'سي 845', nameEn: 'C845 Mini LED', releaseYear: 2023 },
    { slug: 'c745', nameAr: 'سي 745', nameEn: 'C745 QLED', releaseYear: 2023 },
    { slug: 'c645', nameAr: 'سي 645', nameEn: 'C645 QLED', releaseYear: 2023 },
    { slug: 'p745', nameAr: 'بي 745', nameEn: 'P745 4K', releaseYear: 2023 },
  ],
  hisense: [
    { slug: 'u8k', nameAr: 'يو 8 كيه', nameEn: 'U8K Mini LED', releaseYear: 2023 },
    { slug: 'u7k', nameAr: 'يو 7 كيه', nameEn: 'U7K ULED', releaseYear: 2023 },
    { slug: 'u6k', nameAr: 'يو 6 كيه', nameEn: 'U6K ULED', releaseYear: 2023 },
    { slug: 'a6k', nameAr: 'إيه 6 كيه', nameEn: 'A6K 4K', releaseYear: 2023 },
  ],
  philips: [
    { slug: 'oled808', nameAr: 'أوليد 808', nameEn: 'OLED808', releaseYear: 2023 },
    { slug: 'oled708', nameAr: 'أوليد 708', nameEn: 'OLED708', releaseYear: 2023 },
    { slug: 'pus8518', nameAr: 'بي يو إس 8518', nameEn: 'PUS8518', releaseYear: 2023 },
  ],
  xiaomi: [
    { slug: 'tv-q2', nameAr: 'تي في كيو 2', nameEn: 'TV Q2', releaseYear: 2023 },
    { slug: 'tv-a-pro', nameAr: 'تي في إيه برو', nameEn: 'TV A Pro', releaseYear: 2023 },
    { slug: 'tv-s-pro', nameAr: 'تي في إس برو', nameEn: 'TV S Pro', releaseYear: 2024 },
  ],
  sharp: [
    { slug: '4t-c55fv2x', nameAr: '55 بوصة 4K', nameEn: '4T-C55FV2X', releaseYear: 2023 },
  ],
  toshiba: [
    { slug: 'z870', nameAr: 'زد 870', nameEn: 'Z870 Mini LED', releaseYear: 2023 },
    { slug: 'z770', nameAr: 'زد 770', nameEn: 'Z770 QLED', releaseYear: 2023 },
  ],
  panasonic: [
    { slug: 'lz2000', nameAr: 'إل زد 2000', nameEn: 'LZ2000 OLED', releaseYear: 2023 },
    { slug: 'lz1500', nameAr: 'إل زد 1500', nameEn: 'LZ1500 OLED', releaseYear: 2023 },
  ],
};
