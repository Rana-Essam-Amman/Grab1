export interface GoldenCase {
  readonly id: string;
  readonly input: string;
  readonly categorySlug: string;
  readonly expectedFacts: {
    readonly [key: string]: string | boolean | undefined;
  };
  readonly notes?: string;
}

export const GOLDEN_CASES_V2: readonly GoldenCase[] = [
  {
    id: 'services-plumber-amman',
    input: 'سباك في عمان خبرة 10 سنوات صيانة صحية ومواسير',
    categorySlug: 'services',
    expectedFacts: { trade: 'سباك', exp: '10', city: 'عمان' },
  },
  {
    id: 'services-electrician-riyadh',
    input: 'كهربائي منازل في عمان خبرة 5 سنين تركيب وتصليح',
    categorySlug: 'services',
    expectedFacts: { trade: 'كهربائي', exp: '5', city: 'عمان' },
  },
  {
    id: 'services-painter-irbid-indic',
    input: 'دهان في إربد خبرة 8 سنوات دهانات وصباغة',
    categorySlug: 'services',
    expectedFacts: { trade: 'دهان', exp: '8', city: 'إربد' },
  },
  {
    id: 'handymen-ac-amman',
    input: 'فني مكيفات عمان تصليح وتنظيف وتعبئة غاز 15 دينار',
    categorySlug: 'handymen',
    expectedFacts: { trade: 'فني تكييف', city: 'عمان', price: '15' },
  },
  {
    id: 'handymen-tiles-jubaiha',
    input: 'مبلط في عمان خبرة 12 سنة تركيب سيراميك ورخام',
    categorySlug: 'handymen',
    expectedFacts: { trade: 'بلاط', exp: '12', city: 'عمان' },
  },
  {
    id: 'handymen-locksmith-abdoun',
    input: 'أقفالجي فتح أبواب وتغيير أقفال بسعر 20 دينار',
    categorySlug: 'handymen',
    expectedFacts: { price: '20' },
  },
  {
    id: 'watches-rolex-brand-only',
    input: 'ساعة رولكس اصلية مستعملة بحالة ممتازة بسعر 4500 دينار',
    categorySlug: 'watches',
    expectedFacts: { brand: 'Rolex', price: '4500' },
  },
  {
    id: 'watches-omega-seamaster',
    input: 'أوميغا سيماستر أوتوماتيك كحلي بسعر 1800 دولار',
    categorySlug: 'watches',
    expectedFacts: { brand: 'Omega', color: 'كحلي', price: '1800' },
  },
  {
    id: 'watches-casio-gshock',
    input: 'كاسيو جي شوك سوداء ضد الماء بسعر 45 دينار',
    categorySlug: 'watches',
    expectedFacts: { brand: 'Casio', color: 'أسود', price: '45' },
  },
  {
    id: 'computers-monitor-samsung',
    input: 'شاشة سامسونج 27 بوصة 4K بحالة ممتازة بسعر 120 دينار',
    categorySlug: 'computers',
    expectedFacts: { make: 'سامسونج', price: '120' },
  },
  {
    id: 'electronics-audio-sony',
    input: 'سماعة سوني لاسلكية سوداء عزل صوت بسعر 85 دينار',
    categorySlug: 'electronics',
    expectedFacts: { make: 'سوني', color: 'أسود', price: '85' },
  },
  {
    id: 'electronics-gaming-playstation',
    input: 'بلايستيشن 5 مع يدين و3 ألعاب بسعر 380 دينار',
    categorySlug: 'electronics',
    expectedFacts: { make: 'سوني', price: '380' },
  },
  {
    id: 'fashion-shirt-nike',
    input: 'بلوزة نايك رياضية مقاس L لون أبيض جديدة بسعر 15 دينار',
    categorySlug: 'fashion',
    expectedFacts: { make: 'نايك', size: 'L', color: 'أبيض', price: '15' },
  },
  {
    id: 'fashion-abaya-jeddah',
    input: 'عباية سوداء تطريز يدوي بسعر 200 ريال',
    categorySlug: 'fashion',
    expectedFacts: { color: 'أسود', price: '200' },
  },
  {
    id: 'beauty-perfume-dior',
    input: 'عطر ديور سوااج 100 مل أصلي بسعر 75 دينار',
    categorySlug: 'beauty',
    expectedFacts: { brand: 'Dior', price: '75' },
  },
  {
    id: 'beauty-cosmetics-mac',
    input: 'مكياج ماك حمرة ورج أصلية بسعر 25 دينار',
    categorySlug: 'beauty',
    expectedFacts: { brand: 'MAC', price: '25' },
  },
  {
    id: 'kids-stroller-sweifieh',
    input: 'عربة أطفال شيكو بحالة ممتازة بسعر 40 دينار',
    categorySlug: 'kids',
    expectedFacts: { price: '40' },
  },
  {
    id: 'pets-cat-shirazi',
    input: 'قط شيرازي أبيض عمره 3 شهور لعوب ونظيف بسعر 80 دينار',
    categorySlug: 'pets',
    expectedFacts: { breed: 'شيرازي', color: 'أبيض', age: '3', price: '80' },
  },
  {
    id: 'books-magazine-1998',
    input: 'مجلات ميكي قديمة عدد 10 إصدار 1998 بحالة جيدة 15 دينار',
    categorySlug: 'books',
    expectedFacts: { year: '1998', price: '15' },
  },
  {
    id: 'krakeeb-vintage-1970',
    input: 'راديو قديم خشبي يعمل بشكل ممتاز موديل 1970 بسعر 50 دينار',
    categorySlug: 'krakeeb',
    expectedFacts: { year: '1970', price: '50' },
  },
];
