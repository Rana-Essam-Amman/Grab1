import type { GenericBrand, GenericModel } from '@/features/post-wizard/helpers/genericModelHelpers';

export const FURNITURE_BRANDS: readonly GenericBrand[] = [
  { slug: 'ikea', nameAr: 'ايكيا', nameEn: 'IKEA' },
  { slug: 'home_centre', nameAr: 'هوم سنتر', nameEn: 'Home Centre' },
  { slug: 'pottery_barn', nameAr: 'بوتري بارن', nameEn: 'Pottery Barn' },
  { slug: 'west_elm', nameAr: 'ويست إلم', nameEn: 'West Elm' },
  { slug: 'ashley', nameAr: 'آشلي', nameEn: 'Ashley' },
  { slug: 'natuzzi', nameAr: 'ناتوزي', nameEn: 'Natuzzi' },
  { slug: 'bo_concept', nameAr: 'بو كونسبت', nameEn: 'BoConcept' },
  { slug: 'herman_miller', nameAr: 'هيرمان ميلر', nameEn: 'Herman Miller' },
  { slug: 'steelcase', nameAr: 'ستيل كيس', nameEn: 'Steelcase' },
  { slug: 'haworth', nameAr: 'هاورث', nameEn: 'Haworth' },
];

export const FURNITURE_MODELS: Record<string, readonly GenericModel[]> = {
  ikea: [{ slug: 'kallax', nameAr: 'كالاكس', nameEn: 'Kallax' }, { slug: 'malm', nameAr: 'مالم', nameEn: 'Malm' }, { slug: 'billy', nameAr: 'بيلي', nameEn: 'Billy' }, { slug: 'poang', nameAr: 'بوانغ', nameEn: 'Poäng' }, { slug: 'friheten', nameAr: 'فريهيتن', nameEn: 'Friheten' }],
  home_centre: [{ slug: 'sofa-set', nameAr: 'طقم كنب', nameEn: 'Sofa Set' }, { slug: 'dining-table', nameAr: 'طاولة سفرة', nameEn: 'Dining Table' }, { slug: 'wardrobe', nameAr: 'خزانة', nameEn: 'Wardrobe' }],
  pottery_barn: [{ slug: 'farmhouse', nameAr: 'فارمهاوس', nameEn: 'Farmhouse' }, { slug: 'chesterfield', nameAr: 'تشيسترفيلد', nameEn: 'Chesterfield' }, { slug: 'benchwright', nameAr: 'بنشرايت', nameEn: 'Benchwright' }],
  west_elm: [{ slug: 'mid-century', nameAr: 'ميد سينشري', nameEn: 'Mid-Century' }, { slug: 'andes', nameAr: 'أنديز', nameEn: 'Andes' }, { slug: 'harmony', nameAr: 'هارموني', nameEn: 'Harmony' }],
  ashley: [{ slug: 'darcy', nameAr: 'دارسي', nameEn: 'Darcy' }, { slug: 'signature', nameAr: 'سيغنتشر', nameEn: 'Signature' }, { slug: 'modern', nameAr: 'مودرن', nameEn: 'Modern' }],
  natuzzi: [{ slug: 'editions', nameAr: 'إيديشنز', nameEn: 'Editions' }, { slug: 'italia', nameAr: 'إيطاليا', nameEn: 'Italia' }, { slug: 're-vive', nameAr: 'ري فايف', nameEn: 'Re-vive' }],
  bo_concept: [{ slug: 'osaka', nameAr: 'أوساكا', nameEn: 'Osaka' }, { slug: 'carmo', nameAr: 'كارمو', nameEn: 'Carmo' }, { slug: 'modena', nameAr: 'مودينا', nameEn: 'Modena' }],
  herman_miller: [{ slug: 'aeron', nameAr: 'أيرون', nameEn: 'Aeron' }, { slug: 'embody', nameAr: 'إمبودي', nameEn: 'Embody' }, { slug: 'sayl', nameAr: 'سايل', nameEn: 'Sayl' }],
  steelcase: [{ slug: 'leap', nameAr: 'ليب', nameEn: 'Leap' }, { slug: 'gesture', nameAr: 'جيستشر', nameEn: 'Gesture' }, { slug: 'series-1', nameAr: 'سيريز 1', nameEn: 'Series 1' }],
  haworth: [{ slug: 'fern', nameAr: 'فيرن', nameEn: 'Fern' }, { slug: 'zody', nameAr: 'زودي', nameEn: 'Zody' }, { slug: 'very', nameAr: 'فيري', nameEn: 'Very' }],
};
