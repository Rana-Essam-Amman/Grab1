import type { GenericBrand, GenericModel } from '@/features/post-wizard/helpers/genericModelHelpers';

export const BEAUTY_BRANDS: readonly GenericBrand[] = [
  { slug: 'chanel', nameAr: 'شانيل', nameEn: 'Chanel' },
  { slug: 'dior', nameAr: 'ديور', nameEn: 'Dior' },
  { slug: 'ysl', nameAr: 'واي إس إل', nameEn: 'YSL' },
  { slug: 'mac', nameAr: 'ماك', nameEn: 'MAC' },
  { slug: 'nars', nameAr: 'نارس', nameEn: 'NARS' },
  { slug: 'estee_lauder', nameAr: 'إستي لودر', nameEn: 'Estée Lauder' },
  { slug: 'lancome', nameAr: 'لانكوم', nameEn: 'Lancôme' },
  { slug: 'maybelline', nameAr: 'مايبيلين', nameEn: 'Maybelline' },
  { slug: 'loreal', nameAr: 'لوريال', nameEn: 'L\'Oréal' },
  { slug: 'huda_beauty', nameAr: 'هدى بيوتي', nameEn: 'Huda Beauty' },
  { slug: 'nyx', nameAr: 'إن واي إكس', nameEn: 'NYX' },
  { slug: 'clinique', nameAr: 'كلينيك', nameEn: 'Clinique' },
  { slug: 'shiseido', nameAr: 'شيسيدو', nameEn: 'Shiseido' },
  { slug: 'clarins', nameAr: 'كلارنس', nameEn: 'Clarins' },
];

export const BEAUTY_MODELS: Record<string, readonly GenericModel[]> = {
  chanel: [{ slug: 'coco-mademoiselle', nameAr: 'كوكو مادموزيل', nameEn: 'Coco Mademoiselle' }, { slug: 'n5', nameAr: 'نمبر 5', nameEn: 'N°5' }, { slug: 'bleu-de-chanel', nameAr: 'بلو دو شانيل', nameEn: 'Bleu de Chanel' }],
  dior: [{ slug: 'sauvage', nameAr: 'سافاج', nameEn: 'Sauvage' }, { slug: 'jadore', nameAr: 'جادور', nameEn: 'J\'adore' }, { slug: 'miss-dior', nameAr: 'ميس ديور', nameEn: 'Miss Dior' }],
  ysl: [{ slug: 'black-opium', nameAr: 'بلاك أوبيوم', nameEn: 'Black Opium' }, { slug: 'libre', nameAr: 'ليبر', nameEn: 'Libre' }, { slug: 'y', nameAr: 'واي', nameEn: 'Y' }],
  mac: [{ slug: 'ruby-woo', nameAr: 'روبي وو', nameEn: 'Ruby Woo' }, { slug: 'studio-fix', nameAr: 'ستوديو فيكس', nameEn: 'Studio Fix' }, { slug: 'prep-prime', nameAr: 'بريب برايم', nameEn: 'Prep + Prime' }],
  nars: [{ slug: 'orgasm', nameAr: 'أورغازم', nameEn: 'Orgasm' }, { slug: 'radiant-creamy', nameAr: 'راديانت كريمي', nameEn: 'Radiant Creamy' }, { slug: 'audacious', nameAr: 'أوداسيوس', nameEn: 'Audacious' }],
  estee_lauder: [{ slug: 'double-wear', nameAr: 'دبل وير', nameEn: 'Double Wear' }, { slug: 'advanced-night', nameAr: 'أدفانسد نايت', nameEn: 'Advanced Night Repair' }, { slug: 'pure-color', nameAr: 'بيور كولور', nameEn: 'Pure Color' }],
  lancome: [{ slug: 'teint-idole', nameAr: 'تان إيدول', nameEn: 'Teint Idole' }, { slug: 'la-vie-est-belle', nameAr: 'لا في إي بيل', nameEn: 'La Vie Est Belle' }, { slug: 'genifique', nameAr: 'جينيفيك', nameEn: 'Génifique' }],
  maybelline: [{ slug: 'fit-me', nameAr: 'فيت مي', nameEn: 'Fit Me' }, { slug: 'superstay', nameAr: 'سوبر ستاي', nameEn: 'SuperStay' }, { slug: 'lash-sensational', nameAr: 'لاش سنسيشنال', nameEn: 'Lash Sensational' }],
  loreal: [{ slug: 'infallible', nameAr: 'إنفاليبل', nameEn: 'Infallible' }, { slug: 'revitalift', nameAr: 'ريفيتاليفت', nameEn: 'Revitalift' }, { slug: 'color-riche', nameAr: 'كولور ريش', nameEn: 'Color Riche' }],
  huda_beauty: [{ slug: 'liquid-matte', nameAr: 'ليكيد مات', nameEn: 'Liquid Matte' }, { slug: 'fauxfilter', nameAr: 'فوكسفلتر', nameEn: 'FauxFilter' }, { slug: 'nude-obsessions', nameAr: 'نيود أوبسيشنز', nameEn: 'Nude Obsessions' }],
  nyx: [{ slug: 'butter-gloss', nameAr: 'باتر غلوس', nameEn: 'Butter Gloss' }, { slug: 'soft-matte', nameAr: 'سوفت مات', nameEn: 'Soft Matte' }, { slug: 'epic-ink', nameAr: 'إبيك إنك', nameEn: 'Epic Ink' }],
  clinique: [{ slug: 'dramatically-different', nameAr: 'درامتيكالي ديفرنت', nameEn: 'Dramatically Different' }, { slug: 'moisture-surge', nameAr: 'مويستشر سيرج', nameEn: 'Moisture Surge' }, { slug: 'cheek-pop', nameAr: 'تشيك بوب', nameEn: 'Cheek Pop' }],
  shiseido: [{ slug: 'ultimune', nameAr: 'ألتيميون', nameEn: 'Ultimune' }, { slug: 'synchro-skin', nameAr: 'سينكرو سكين', nameEn: 'Synchro Skin' }, { slug: 'benefiance', nameAr: 'بينيفيانس', nameEn: 'Benefiance' }],
  clarins: [{ slug: 'double-serum', nameAr: 'دبل سيروم', nameEn: 'Double Serum' }, { slug: 'hydra-essentiel', nameAr: 'هيدرا إيسنشل', nameEn: 'Hydra-Essentiel' }, { slug: 'joli-rouge', nameAr: 'جولي روج', nameEn: 'Joli Rouge' }],
};
