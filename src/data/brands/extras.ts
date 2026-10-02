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
  {
    id: 'apple-arab-models',
    name: 'Apple',
    nameAr: 'ابل',
    en: 'Apple',
    ar: 'ابل',
    models: [
      ['ايفون', 'iPhone'],
      ['ابل', 'Apple'],
      ['ايفون 11', 'iPhone 11'],
      ['ايفون 11 برو', 'iPhone 11 Pro'],
      ['ايفون 11 برو ماكس', 'iPhone 11 Pro Max'],
      ['ايفون 12', 'iPhone 12'],
      ['ايفون 12 برو', 'iPhone 12 Pro'],
      ['ايفون 12 برو ماكس', 'iPhone 12 Pro Max'],
      ['ايفون 13', 'iPhone 13'],
      ['ايفون 13 برو', 'iPhone 13 Pro'],
      ['ايفون 13 برو ماكس', 'iPhone 13 Pro Max'],
      ['ايفون 14', 'iPhone 14'],
      ['ايفون 14 برو', 'iPhone 14 Pro'],
      ['ايفون 14 برو ماكس', 'iPhone 14 Pro Max'],
      ['ايفون 15', 'iPhone 15'],
      ['ايفون 15 برو', 'iPhone 15 Pro'],
      ['ايفون 15 برو ماكس', 'iPhone 15 Pro Max'],
    ],
  },
  {
    id: 'samsung-arab-models',
    name: 'Samsung',
    nameAr: 'سامسونج',
    en: 'Samsung',
    ar: 'سامسونج',
    models: [
      ['جالكسي اس 20', 'Galaxy S20'],
      ['جالكسي اس 21', 'Galaxy S21'],
      ['جالكسي اس 22', 'Galaxy S22'],
      ['جالكسي اس 23', 'Galaxy S23'],
      ['جالكسي اس 24', 'Galaxy S24'],
      ['جالكسي a54', 'Galaxy A54'],
      ['جالكسي a34', 'Galaxy A34'],
    ],
  },
  {
    id: 'xiaomi-arab-models',
    name: 'Xiaomi',
    nameAr: 'شاومي',
    en: 'Xiaomi',
    ar: 'شاومي',
    models: [
      ['ريدمي نوت 11', 'Redmi Note 11'],
      ['ريدمي نوت 12', 'Redmi Note 12'],
      ['ريدمي نوت 10', 'Redmi Note 10'],
      ['ريدمي 9', 'Redmi 9'],
    ],
  },
  {
    id: 'huawei-arab-models',
    name: 'Huawei',
    nameAr: 'هواوي',
    en: 'Huawei',
    ar: 'هواوي',
    models: [
      ['نوفا 9', 'Nova 9'],
      ['نوفا 10', 'Nova 10'],
      ['نوفا 11', 'Nova 11'],
      ['بي 60 برو', 'P60 Pro'],
      ['بي 60', 'P60'],
      ['ميت 50', 'Mate 50'],
    ],
  },
  {
    id: 'nissan-arab-models',
    name: 'Nissan',
    nameAr: 'نيسان',
    en: 'Nissan',
    ar: 'نيسان',
    models: [
      ['سني', 'Sunny'],
      ['صني', 'Sunny'],
    ],
  },
];
