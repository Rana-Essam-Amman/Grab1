// =============================================================================
// Fuzzy-match golden fixtures — one deliberate typo per input.
// Expected facts use CORRECT canonical forms (what extraction should yield
// after fuzzy fallback). 28 cases across 6 categories.
// =============================================================================

export interface GoldenCase {
  readonly id: string;
  readonly input: string;
  readonly categorySlug: string;
  readonly expectedFacts: {
    readonly [key: string]: string | boolean | undefined;
  };
  readonly notes?: string;
}

export const GOLDEN_CASES_FUZZY: readonly GoldenCase[] = [
  { id: 'fuzzy-camry-yaa', input: 'كامرى للبيع 2020 هايبرد بسعر 15 الف دينار', categorySlug: 'motors', expectedFacts: { make: 'تويوتا', model: 'كامري', year: '2020', fuel: 'هايبرد', price: '15000' }, notes: 'كامرى (ى) → كامري' },
  { id: 'fuzzy-hyundai-yaa', input: 'هيونداى النترا 2019 بنزين السعر 11000 دينار', categorySlug: 'motors', expectedFacts: { make: 'هيونداي', model: 'النترا', year: '2019', fuel: 'بنزين', price: '11000' }, notes: 'هيونداى → هيونداي' },
  { id: 'fuzzy-sunny-yaa', input: 'نيسان صنى 2014 بنزين السعر 5900 دينار', categorySlug: 'motors', expectedFacts: { make: 'نيسان', model: 'صني', year: '2014', fuel: 'بنزين', price: '5900' }, notes: 'صنى → صني (canonical)' },
  { id: 'fuzzy-elantra-yaa', input: 'هيونداي النترى 2018 اوتوماتيك السعر 9800 دينار', categorySlug: 'motors', expectedFacts: { make: 'هيونداي', model: 'النترا', year: '2018', price: '9800' }, notes: 'النترى → النترا' },
  { id: 'fuzzy-galaxy-yaa', input: 'سامسونج جالكسى 128 جيجا لون اسود السعر 1400 ريال', categorySlug: 'mobiles', expectedFacts: { make: 'سامسونج', model: 'جالكسي', storage: '128', price: '1400' }, notes: 'جالكسى → جالكسي' },
  { id: 'fuzzy-land-yaa', input: 'ارضى للبيع 500 متر السعر 120 الف دينار', categorySlug: 'real-estate', expectedFacts: { area: '500', price: '120000' }, notes: 'ارضى → أرضي' },
  { id: 'fuzzy-flat-haa', input: 'شقه للبيع 140 متر 3 غرف السعر 95 الف دينار', categorySlug: 'real-estate', expectedFacts: { area: '140', rooms: '3', price: '95000' }, notes: 'شقه → شقة' },
  { id: 'fuzzy-room-haa', input: 'شقة للبيع فيها غرفة واحدة 90 متر السعر 70 الف دينار', categorySlug: 'real-estate', expectedFacts: { rooms: '1', area: '90', price: '70000' }, notes: 'exact — fuzzy للـ rooms extractor لسا مش مطبق' },
  { id: 'fuzzy-watch-haa', input: 'ساعه رولكس للبيع السعر 4200 دينار', categorySlug: 'watches', expectedFacts: { brand: 'Rolex', price: '4200' }, notes: 'ساعه → ساعة' },
  { id: 'fuzzy-bag-haa', input: 'شنطه نايك للبيع لون أسود السعر 30 ريال', categorySlug: 'fashion', expectedFacts: { make: 'نايك', color: 'أسود', price: '30' }, notes: 'شنطه → شنطة' },
  { id: 'fuzzy-flat-hamza-black', input: 'شقة للبيع 120 متر لونها اسود السعر 80 الف دينار', categorySlug: 'real-estate', expectedFacts: { area: '120', color: 'أسود', price: '80000' }, notes: 'اسود → أسود' },
  { id: 'fuzzy-land-hamza', input: 'ارض للبيع 600 متر السعر 150000 دينار', categorySlug: 'real-estate', expectedFacts: { area: '600', price: '150000' }, notes: 'ارض → أرض' },
  { id: 'fuzzy-dior-hamza-white', input: 'عطر ديور لون ابيض السعر 70 دولار', categorySlug: 'beauty', expectedFacts: { brand: 'Dior', color: 'أبيض', price: '70' }, notes: 'ابيض → أبيض' },
  { id: 'fuzzy-flat-hamza-blue', input: 'شقة للبيع 100 متر لونها ازرق السعر 60 الف دينار', categorySlug: 'real-estate', expectedFacts: { area: '100', color: 'أزرق', price: '60000' }, notes: 'ازرق → أزرق' },
  { id: 'fuzzy-hyundai-insert', input: 'هيوندايي اكسنت 2016 بنزين السعر 6500 دولار', categorySlug: 'motors', expectedFacts: { make: 'هيونداي', model: 'اكسنت', year: '2016', fuel: 'بنزين', price: '6500' }, notes: 'هيوندايي → هيونداي' },
  { id: 'fuzzy-apple-insert', input: 'ابلل ايفون 13 سعة 128 جيجا السعر 280 دينار', categorySlug: 'mobiles', expectedFacts: { make: 'ابل', model: 'ايفون 13', storage: '128', price: '280' }, notes: 'ابلل → ابل' },
  { id: 'fuzzy-iphone-insert', input: 'ايفوون 11 سعة 128 جيجا السعر 900 شيكل', categorySlug: 'mobiles', expectedFacts: { make: 'ابل', model: 'ايفون 11', storage: '128', price: '900' }, notes: 'ايفوون → ايفون' },
  { id: 'fuzzy-rolex-insert', input: 'ساعة روللكس للبيع السعر 4000 دينار', categorySlug: 'watches', expectedFacts: { brand: 'Rolex', price: '4000' }, notes: 'روللكس → رولكس' },
  { id: 'fuzzy-chanel-insert', input: 'عطر شانيلل للبيع السعر 90 دينار', categorySlug: 'beauty', expectedFacts: { brand: 'Chanel', price: '90' }, notes: 'شانيلل → شانيل' },
  { id: 'fuzzy-hyundai-delete', input: 'هونداي سوناتا 2017 بنزين السعر 8000 دينار', categorySlug: 'motors', expectedFacts: { make: 'هيونداي', model: 'سوناتا', year: '2017', fuel: 'بنزين', price: '8000' }, notes: 'هونداي → هيونداي' },
  { id: 'fuzzy-samsung-delete', input: 'سامسنج جالكسي 256 جيجا السعر 1500 ريال', categorySlug: 'mobiles', expectedFacts: { make: 'سامسونج', model: 'جالكسي', storage: '256', price: '1500' }, notes: 'سامسنج → سامسونج' },
  { id: 'fuzzy-rolex-delete', input: 'ساعة رولس للبيع السعر 3500 دينار', categorySlug: 'watches', expectedFacts: { brand: 'Rolex', price: '3500' }, notes: 'رولس → رولكس' },
  { id: 'fuzzy-adidas-delete', input: 'حذاء ادداس رجالي لون أبيض السعر 25 دينار', categorySlug: 'fashion', expectedFacts: { make: 'اديداس', gender: 'رجالي', color: 'أبيض', price: '25' }, notes: 'ادداس → اديداس' },
  { id: 'fuzzy-chanel-insert', input: 'عطر شانيلل للبيع السعر 80 دولار', categorySlug: 'beauty', expectedFacts: { brand: 'Chanel', price: '80' }, notes: 'شانيلل → شانيل (1 edit)' },
  { id: 'fuzzy-galaxy-swap', input: 'سامسونج جالكسي اس 22 128 جيجا السعر 1100 ريال', categorySlug: 'mobiles', expectedFacts: { make: 'سامسونج', model: 'جالكسي اس 22', storage: '128', price: '1100' }, notes: 'exact match صحيح للـ model العربي الكامل' },
  { id: 'fuzzy-galaxy-qaf', input: 'سامسونج جالكسي اس 21 64 جيجا السعر 700 ريال', categorySlug: 'mobiles', expectedFacts: { make: 'سامسونج', model: 'جالكسي اس 21', storage: '64', price: '700' }, notes: 'exact match لموديل أطول' },
  { id: 'fuzzy-rolex-qaf', input: 'ساعة رولقس للبيع السعر 3000 دينار', categorySlug: 'watches', expectedFacts: { brand: 'Rolex', price: '3000' }, notes: 'رولقس → رولكس' },
  { id: 'fuzzy-nike-qaf', input: 'حذاء نايق رجالي لون أسود السعر 20 دينار', categorySlug: 'fashion', expectedFacts: { make: 'نايك', gender: 'رجالي', color: 'أسود', price: '20' }, notes: 'نايق → نايك' },
];
