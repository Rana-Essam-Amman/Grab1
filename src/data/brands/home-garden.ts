import type { GenericBrand, GenericModel } from '@/features/post-wizard/helpers/genericModelHelpers';

export const HOME_GARDEN_BRANDS: readonly GenericBrand[] = [
  { slug: 'weber', nameAr: 'ويبر', nameEn: 'Weber' },
  { slug: 'napoleon', nameAr: 'نابليون', nameEn: 'Napoleon' },
  { slug: 'traeger', nameAr: 'تريجر', nameEn: 'Traeger' },
  { slug: 'big_green_egg', nameAr: 'بيغ غرين إيغ', nameEn: 'Big Green Egg' },
  { slug: 'broil_king', nameAr: 'برويل كينغ', nameEn: 'Broil King' },
  { slug: 'fiskars', nameAr: 'فيسكارز', nameEn: 'Fiskars' },
  { slug: 'gardena', nameAr: 'غاردينا', nameEn: 'Gardena' },
  { slug: 'husqvarna', nameAr: 'هوسكفارنا', nameEn: 'Husqvarna' },
  { slug: 'stihl', nameAr: 'ستيهل', nameEn: 'Stihl' },
  { slug: 'bosch', nameAr: 'بوش', nameEn: 'Bosch' },
  { slug: 'makita', nameAr: 'ماكيتا', nameEn: 'Makita' },
  { slug: 'kettler', nameAr: 'كيتلر', nameEn: 'Kettler' },
  { slug: 'hartman', nameAr: 'هارتمان', nameEn: 'Hartman' },
];

export const HOME_GARDEN_MODELS: Record<string, readonly GenericModel[]> = {
  weber: [{ slug: 'spirit', nameAr: 'سبيريت', nameEn: 'Spirit' }, { slug: 'genesis', nameAr: 'جينيسيس', nameEn: 'Genesis' }, { slug: 'kettle', nameAr: 'كيتل', nameEn: 'Kettle' }],
  napoleon: [{ slug: 'rogue', nameAr: 'روغ', nameEn: 'Rogue' }, { slug: 'prestige', nameAr: 'بريستيج', nameEn: 'Prestige' }, { slug: 'travelq', nameAr: 'ترافيل كيو', nameEn: 'TravelQ' }],
  traeger: [{ slug: 'pro', nameAr: 'برو', nameEn: 'Pro' }, { slug: 'ironwood', nameAr: 'آيرونوود', nameEn: 'Ironwood' }, { slug: 'timberline', nameAr: 'تيمبرلاين', nameEn: 'Timberline' }],
  big_green_egg: [{ slug: 'large', nameAr: 'لارج', nameEn: 'Large' }, { slug: 'medium', nameAr: 'ميديوم', nameEn: 'Medium' }, { slug: 'mini', nameAr: 'ميني', nameEn: 'Mini' }],
  broil_king: [{ slug: 'baron', nameAr: 'بارون', nameEn: 'Baron' }, { slug: 'regal', nameAr: 'ريغال', nameEn: 'Regal' }, { slug: 'signet', nameAr: 'سيغنت', nameEn: 'Signet' }],
  fiskars: [{ slug: 'xact', nameAr: 'إكساكت', nameEn: 'Xact' }, { slug: 'solid', nameAr: 'سوليد', nameEn: 'Solid' }, { slug: 'powergear', nameAr: 'باور غير', nameEn: 'PowerGear' }],
  gardena: [{ slug: 'comfort', nameAr: 'كومفورت', nameEn: 'Comfort' }, { slug: 'combisystem', nameAr: 'كومبي سيستم', nameEn: 'Combisystem' }, { slug: 'smart', nameAr: 'سمارت', nameEn: 'Smart' }],
  husqvarna: [{ slug: 'automower', nameAr: 'أوتومور', nameEn: 'Automower' }, { slug: 'husqvarna-chainsaw', nameAr: 'تشينسو', nameEn: 'Chainsaw' }, { slug: 'husqvarna-trimmer', nameAr: 'تريمر', nameEn: 'Trimmer' }],
  stihl: [{ slug: 'chainsaw', nameAr: 'تشينسو', nameEn: 'Chainsaw' }, { slug: 'trimmer', nameAr: 'تريمر', nameEn: 'Trimmer' }, { slug: 'blower', nameAr: 'بلور', nameEn: 'Blower' }],
  bosch: [{ slug: 'advancedrotak', nameAr: 'أدفانسد روتاك', nameEn: 'AdvancedRotak' }, { slug: 'easycut', nameAr: 'إيزي كت', nameEn: 'EasyCut' }, { slug: 'axt', nameAr: 'إيه إكس تي', nameEn: 'AXT' }],
  makita: [{ slug: 'dlm', nameAr: 'دي إل إم', nameEn: 'DLM' }, { slug: 'dur', nameAr: 'دي يو آر', nameEn: 'DUR' }, { slug: 'dub', nameAr: 'دي يو بي', nameEn: 'DUB' }],
  kettler: [{ slug: 'basic-plus', nameAr: 'بيسك بلس', nameEn: 'Basic Plus' }, { slug: 'easy-go', nameAr: 'إيزي غو', nameEn: 'Easy Go' }, { slug: 'avantgarde', nameAr: 'أفانتغارد', nameEn: 'Avantgarde' }],
  hartman: [{ slug: 'dubai', nameAr: 'دبي', nameEn: 'Dubai' }, { slug: 'vienna', nameAr: 'فيينا', nameEn: 'Vienna' }, { slug: 'sophia', nameAr: 'صوفيا', nameEn: 'Sophia' }],
};
