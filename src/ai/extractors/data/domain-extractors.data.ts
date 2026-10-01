// RULE-14-EXCEPTION: Static taxonomy
// Domain extractors — watches, beauty, pets, kids age
// Deterministic alias tables. Extractor lowercases both sides before match.

export interface ExtractorPattern {
  readonly canonical: string;
  readonly aliases: readonly string[];
}

export const WATCH_BRANDS: readonly ExtractorPattern[] = [
  { canonical: 'Rolex', aliases: ['رولكس', 'روليكس', 'روليكز', 'rolex'] },
  { canonical: 'Omega', aliases: ['اوميغا', 'أوميغا', 'اوميجا', 'omega'] },
  { canonical: 'Casio', aliases: ['كاسيو', 'كازيو', 'casio'] },
  { canonical: 'Seiko', aliases: ['سايكو', 'سيكو', 'seiko'] },
  { canonical: 'Citizen', aliases: ['سيتيزن', 'ستيزن', 'citizen'] },
  { canonical: 'Tissot', aliases: ['تيسو', 'تيسوت', 'tissot'] },
  { canonical: 'Rado', aliases: ['رادو', 'رادوو', 'rado'] },
  { canonical: 'Cartier', aliases: ['كارتييه', 'كارتيه', 'cartier'] },
  { canonical: 'Tag Heuer', aliases: ['تاغ هوير', 'تاج هوير', 'tag heuer'] },
  { canonical: 'Audemars Piguet', aliases: ['اوديمار', 'أوديما بيغيه', 'audemars piguet'] },
  { canonical: 'Patek Philippe', aliases: ['باتيك', 'باتيك فيليب', 'patek philippe'] },
  { canonical: 'Hublot', aliases: ['هوبلو', 'هوبلوت', 'hublot'] },
  { canonical: 'Longines', aliases: ['لونجين', 'لونجينز', 'longines'] },
  { canonical: 'Fossil', aliases: ['فوسيل', 'فوسيل ووتش', 'fossil'] },
  { canonical: 'Swatch', aliases: ['سواتش', 'سواتش ووتش', 'swatch'] },
  { canonical: 'Orient', aliases: ['اورينت', 'أورينت', 'orient'] },
  { canonical: 'Invicta', aliases: ['انفيكتا', 'إنفيكتا', 'invicta'] },
  { canonical: 'Guess', aliases: ['جيس', 'جيس ووتش', 'guess'] },
  { canonical: 'Michael Kors', aliases: ['مايكل كورس', 'مايكل كروس', 'michael kors'] },
  { canonical: 'Apple', aliases: ['ابل ووتش', 'أبل ووتش', 'apple watch'] },
  { canonical: 'Hamilton', aliases: ['هاملتون', 'هاملتن', 'hamilton'] },
  { canonical: 'Breitling', aliases: ['بريتلينغ', 'بريتلينج', 'breitling'] },
];

export const BEAUTY_BRANDS: readonly ExtractorPattern[] = [
  { canonical: 'Dior', aliases: ['ديور', 'ديور عطر', 'dior'] },
  { canonical: 'Chanel', aliases: ['شانيل', 'شانيل عطر', 'chanel'] },
  { canonical: 'Gucci', aliases: ['غوتشي', 'جوتشي', 'gucci'] },
  { canonical: 'Versace', aliases: ['فيرساتشي', 'فرساتشي', 'versace'] },
  { canonical: 'Armani', aliases: ['ارماني', 'أرماني', 'armani'] },
  { canonical: 'Lattafa', aliases: ['لطافة', 'لطافه', 'lattafa'] },
  { canonical: 'Rasasi', aliases: ['الرصاصي', 'رصاصي', 'rasasi'] },
  { canonical: 'Arabian Oud', aliases: ['العربية للعود', 'عربية العود', 'arabian oud'] },
  { canonical: 'Ajmal', aliases: ['اجمل', 'أجمل', 'ajmal'] },
  { canonical: 'Al Rehab', aliases: ['الرحاب', 'عطور الرحاب', 'al rehab'] },
  { canonical: 'Flormar', aliases: ['فلورمار', 'فلورمار مكياج', 'flormar'] },
  { canonical: 'Golden Rose', aliases: ['جولدن روز', 'قولدن روز', 'golden rose'] },
  { canonical: 'Huda Beauty', aliases: ['هدى بيوتي', 'هودا بيوتي', 'huda beauty'] },
  { canonical: 'MAC', aliases: ['ماك', 'ماك مكياج', 'mac'] },
  { canonical: 'Maybelline', aliases: ['ميبيلين', 'مايبيلين', 'maybelline'] },
  { canonical: 'Loreal', aliases: ['لوريال', 'لوريال باريس', 'loreal'] },
  { canonical: 'Nivea', aliases: ['نيفيا', 'نيڤيا', 'nivea'] },
  { canonical: 'Victoria Secret', aliases: ['فيكتوريا سيكرت', 'فكتوريا سيكريت', 'victoria secret'] },
  { canonical: 'The Ordinary', aliases: ['ذا اورديناري', 'ذي اورديناري', 'the ordinary'] },
  { canonical: 'Cetaphil', aliases: ['سيتافيل', 'ستافيل', 'cetaphil'] },
  { canonical: 'YSL', aliases: ['ايف سان لوران', 'إيف سان لوران', 'ysl'] },
  { canonical: 'Tom Ford', aliases: ['توم فورد', 'توم فورد عطر', 'tom ford'] },
  { canonical: 'Kayali', aliases: ['كايالي', 'كيالي', 'kayali'] },
  { canonical: 'Bath and Body Works', aliases: ['باث اند بودي', 'باث آند بودي', 'bath and body works'] },
  { canonical: 'Kiko', aliases: ['كيكو', 'كيكو ميلانو', 'kiko'] },
];

export const PET_BREEDS: readonly ExtractorPattern[] = [
  { canonical: 'شيرازي', aliases: ['شيرازي', 'قط شيرازي', 'persian', 'persian cat'] },
  { canonical: 'هملايا', aliases: ['هملايا', 'هيمالايا', 'himalayan'] },
  { canonical: 'سيامي', aliases: ['سيامي', 'قط سيامي', 'siamese'] },
  { canonical: 'سكوتش فولد', aliases: ['سكوتش فولد', 'سكوتش', 'scottish fold'] },
  { canonical: 'بريتش شورت هير', aliases: ['بريتش', 'بريتش شورت هير', 'british shorthair'] },
  { canonical: 'مين كون', aliases: ['مين كون', 'ماين كون', 'maine coon'] },
  { canonical: 'بنغال', aliases: ['بنغال', 'قط بنغالي', 'bengal'] },
  { canonical: 'سفنكس', aliases: ['سفنكس', 'قط سفنكس', 'sphynx'] },
  { canonical: 'هاسكي', aliases: ['هاسكي', 'هسكي', 'husky', 'siberian husky'] },
  { canonical: 'جيرمن شيبرد', aliases: ['جيرمن', 'جيرمان شيبرد', 'german shepherd'] },
  { canonical: 'جولدن ريتريفر', aliases: ['جولدن', 'جولدي', 'golden retriever'] },
  { canonical: 'لابرادور', aliases: ['لابرادور', 'لاب', 'labrador'] },
  { canonical: 'بيتبول', aliases: ['بيتبول', 'بتبول', 'pitbull'] },
  { canonical: 'روتوايلر', aliases: ['روتوايلر', 'روت وايلر', 'rottweiler'] },
  { canonical: 'بوميرانيان', aliases: ['بوميرانيان', 'بومرينيان', 'pomeranian'] },
  { canonical: 'سلوقي', aliases: ['سلوقي', 'كلب سلوقي', 'saluki'] },
  { canonical: 'مالتيز', aliases: ['مالتيز', 'مالطي', 'maltese'] },
  { canonical: 'كانيش', aliases: ['كانيش', 'بودل', 'poodle'] },
  { canonical: 'كوكتيل', aliases: ['كوكتيل', 'كوكاتيل', 'cockatiel'] },
  { canonical: 'بادجي', aliases: ['بادجي', 'بدجي', 'budgie'] },
  { canonical: 'كاسكو', aliases: ['كاسكو', 'ببغاء رمادي', 'african grey'] },
  { canonical: 'كناري', aliases: ['كناري', 'كنار', 'canary'] },
  { canonical: 'سمكة ذهبية', aliases: ['سمكة ذهبية', 'سمك ذهبي', 'goldfish'] },
  { canonical: 'جابي', aliases: ['جابي', 'سمكة جابي', 'guppy'] },
  { canonical: 'فايتر', aliases: ['فايتر', 'سمك فايتر', 'betta', 'betta splendens'] },
  { canonical: 'كوي', aliases: ['كوي', 'سمك كوي', 'koi'] },
];

export const KIDS_AGE_PATTERNS: readonly RegExp[] = [
  /(\d{1,2}\s*[-–—]\s*\d{1,2})\s*(?:شهر|أشهر|اشهر|شهور)/,
  /(\d{1,2}\s*[-–—]\s*\d{1,2})\s*(?:سنة|سنوات|سنين|عام|اعوام|أعوام)/,
  /من\s*(\d{1,2}\s*(?:الى|إلى|الي)\s*\d{1,2})\s*(?:شهر|أشهر|اشهر|شهور)/,
  /من\s*(\d{1,2}\s*(?:الى|إلى|الي)\s*\d{1,2})\s*(?:سنة|سنوات|سنين|عام|اعوام|أعوام)/,
  /(?:عمره|عمرها|عمر)\s*(\d{1,2})\s*(?:شهر|أشهر|اشهر|شهور|سنة|سنوات|سنين)/,
  /(\d{1,2})\s*(?:شهر|أشهر|اشهر|شهور)/,
  /(\d{1,2})\s*(?:سنة|سنوات|سنين|عام)/,
  /([٠-٩]{1,2}\s*[-–—]\s*[٠-٩]{1,2})\s*(?:شهر|أشهر|اشهر|شهور)/,
  /([٠-٩]{1,2}\s*[-–—]\s*[٠-٩]{1,2})\s*(?:سنة|سنوات|سنين)/,
  /(\d{1,2}\s*[-–]\s*\d{1,2})\s*(?:months|month|mo|years|yrs|yr)/i,
  /(\d{1,2})\s*(?:months|month|years|yrs)/i,
];
