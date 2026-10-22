import type { GenericBrand, GenericModel } from '@/features/post-wizard/helpers/genericModelHelpers';

export const PETS_BRANDS: readonly GenericBrand[] = [
  { slug: 'royal_canin', nameAr: 'رويال كانين', nameEn: 'Royal Canin' },
  { slug: 'pedigree', nameAr: 'بيديجري', nameEn: 'Pedigree' },
  { slug: 'whiskas', nameAr: 'ويسكس', nameEn: 'Whiskas' },
  { slug: 'purina', nameAr: 'بورينا', nameEn: 'Purina' },
  { slug: 'hills', nameAr: 'هيلز', nameEn: 'Hill\'s' },
  { slug: 'eukanuba', nameAr: 'يوكانوبا', nameEn: 'Eukanuba' },
  { slug: 'ferplast', nameAr: 'فيربلاست', nameEn: 'Ferplast' },
  { slug: 'trixie', nameAr: 'تريكسي', nameEn: 'Trixie' },
  { slug: 'petmate', nameAr: 'بيتميت', nameEn: 'Petmate' },
];

export const PETS_MODELS: Record<string, readonly GenericModel[]> = {
  royal_canin: [{ slug: 'maxi', nameAr: 'ماكسي', nameEn: 'Maxi' }, { slug: 'medium', nameAr: 'ميديوم', nameEn: 'Medium' }, { slug: 'indoor', nameAr: 'إندور', nameEn: 'Indoor' }],
  pedigree: [{ slug: 'pedigree-adult', nameAr: 'أدولت', nameEn: 'Adult' }, { slug: 'pedigree-puppy', nameAr: 'ببي', nameEn: 'Puppy' }, { slug: 'dentastix', nameAr: 'دنتاستيكس', nameEn: 'Dentastix' }],
  whiskas: [{ slug: 'whiskas-adult', nameAr: 'أدولت', nameEn: 'Adult' }, { slug: 'kitten', nameAr: 'كيتن', nameEn: 'Kitten' }, { slug: 'temptations', nameAr: 'تمبتيشنز', nameEn: 'Temptations' }],
  purina: [{ slug: 'pro-plan', nameAr: 'برو بلان', nameEn: 'Pro Plan' }, { slug: 'one', nameAr: 'وان', nameEn: 'ONE' }, { slug: 'felix', nameAr: 'فيليكس', nameEn: 'Felix' }],
  hills: [{ slug: 'science-diet', nameAr: 'ساينس دايت', nameEn: 'Science Diet' }, { slug: 'prescription', nameAr: 'بريسكريبشن', nameEn: 'Prescription Diet' }, { slug: 'ideal-balance', nameAr: 'آيديال بالانس', nameEn: 'Ideal Balance' }],
  eukanuba: [{ slug: 'eukanuba-adult', nameAr: 'أدولت', nameEn: 'Adult' }, { slug: 'puppy', nameAr: 'ببي', nameEn: 'Puppy' }, { slug: 'senior', nameAr: 'سينيور', nameEn: 'Senior' }],
  ferplast: [{ slug: 'atlas', nameAr: 'أتلاس', nameEn: 'Atlas' }, { slug: 'swing', nameAr: 'سوينغ', nameEn: 'Swing' }, { slug: 'comfy', nameAr: 'كومفي', nameEn: 'Comfy' }],
  trixie: [{ slug: 'be-nordic', nameAr: 'بي نورديك', nameEn: 'Be Nordic' }, { slug: 'transport', nameAr: 'ترانسبورت', nameEn: 'Transport' }, { slug: 'scratching', nameAr: 'سكراتشينغ', nameEn: 'Scratching' }],
  petmate: [{ slug: 'kennel', nameAr: 'كينيل', nameEn: 'Kennel' }, { slug: 'litter', nameAr: 'ليتر', nameEn: 'Litter' }, { slug: 'feeder', nameAr: 'فيدر', nameEn: 'Feeder' }],
};
