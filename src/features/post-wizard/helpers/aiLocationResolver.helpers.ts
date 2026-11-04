import type { GeneratedListing } from '@/types';
import type { CategoryMatch } from '@/ai/categoryMatch';

export interface AIResultParams {
  readonly generated: GeneratedListing;
  readonly match: CategoryMatch;
  readonly raw: string;
  readonly photos: string[];
  readonly isArabic: boolean;
  readonly browseCityAr: string;
  readonly categoryForAI: string;
  readonly subForAI: string;
  readonly browseCountryCode?: string;
}

export const COMMON_AR_GOV_ALIASES: Record<string, string> = {
  'عمان': 'amman',
  'عمّان': 'amman',
  'الرياض': 'riyadh-region',
  'مكة': 'makkah-region',
  'المدينة': 'madinah-region',
  'القدس': 'jerusalem',
  'بيروت': 'beirut',
  'دمشق': 'damascus',
  'الكويت': 'al-asimah',
  'مدينة الكويت': 'al-asimah',
  'kuwait city': 'al-asimah',
};
