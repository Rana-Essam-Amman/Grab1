import { normalizeArabic } from '@/shared/lib/arabicNormalize';
import type { MarketCode } from './geo.types';

export const MARKET_EXACT_IDENTIFIERS: Record<MarketCode, ReadonlySet<string>> = {
  JO: new Set([
    'jo', 'jor', '400', 'jordan', 'hashemite kingdom of jordan',
    normalizeArabic('الأردن'), normalizeArabic('الاردن'),
    normalizeArabic('المملكة الأردنية الهاشمية'), normalizeArabic('المملكة الاردنية الهاشمية'),
  ]),
  SA: new Set([
    'sa', 'sau', '682', 'saudi arabia', 'kingdom of saudi arabia', 'saudi', 'k.s.a.', 'ksa',
    normalizeArabic('السعودية'), normalizeArabic('السعوديه'),
    normalizeArabic('المملكة العربية السعودية'), normalizeArabic('المملكه العربيه السعوديه'),
  ]),
  PS: new Set([
    'ps', 'pse', '275', 'palestine', 'state of palestine', 'occupied palestinian territory',
    normalizeArabic('فلسطين'), normalizeArabic('دولة فلسطين'), normalizeArabic('دوله فلسطين'),
    normalizeArabic('الضفة الغربية'), normalizeArabic('قطاع غزة'),
  ]),
  LB: new Set([
    'lb', 'lbn', '422', 'lebanon', 'lebanese republic',
    normalizeArabic('لبنان'), normalizeArabic('الجمهورية اللبنانية'), normalizeArabic('الجمهوريه اللبنانيه'),
  ]),
  SY: new Set([
    'sy', 'syr', '760', 'syria', 'syrian arab republic',
    normalizeArabic('سوريا'), normalizeArabic('سورية'),
    normalizeArabic('الجمهورية العربية السورية'), normalizeArabic('الجمهوريه العربيه السوريه'),
  ]),
  KW: new Set([
    'kw', 'kwt', '414', 'kuwait', 'state of kuwait',
    normalizeArabic('الكويت'), normalizeArabic('دولة الكويت'), normalizeArabic('دوله الكويت'),
  ]),
};

export function normalizeCountryString(str: string): string {
  const cleaned = str
    .trim()
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return normalizeArabic(cleaned);
}
