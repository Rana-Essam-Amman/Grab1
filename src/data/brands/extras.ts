// RULE-14-EXCEPTION: Static taxonomy

interface ExtraBrand {
  readonly id: string;
  readonly name: string;
  readonly nameAr: string;
  readonly en: string;
  readonly ar: string;
  readonly models: ReadonlyArray<readonly [string, string]>;
}

export const EXTRAS_BRANDS: readonly ExtraBrand[] = [
  {
    id: 'sony',
    name: 'Sony',
    nameAr: 'سوني',
    en: 'Sony',
    ar: 'سوني',
    models: [
      ['بلايستيشن 5', 'PlayStation 5'],
      ['بلايستيشن 4', 'PlayStation 4'],
      ['PlayStation 5', 'PlayStation 5'],
      ['PlayStation 4', 'PlayStation 4'],
    ],
  },
  { id: 'nike', name: 'Nike', nameAr: 'نايك', en: 'Nike', ar: 'نايك', models: [] },
  { id: 'adidas', name: 'Adidas', nameAr: 'اديداس', en: 'Adidas', ar: 'اديداس', models: [] },
  { id: 'york', name: 'York', nameAr: 'يورك', en: 'York', ar: 'يورك', models: [] },
  { id: 'puma', name: 'Puma', nameAr: 'بوما', en: 'Puma', ar: 'بوما', models: [] },
  { id: 'reebok', name: 'Reebok', nameAr: 'ريبوك', en: 'Reebok', ar: 'ريبوك', models: [] },
  { id: 'under-armour', name: 'Under Armour', nameAr: 'اندر ارمور', en: 'Under Armour', ar: 'اندر ارمور', models: [] },
];
