// RULE-14-EXCEPTION: Country/currency reference
import { CountryDef } from '../types';

export const countries: CountryDef[] = [
  {
    code: 'JO',
    nameEn: 'Jordan',
    nameAr: 'الأردن',
    flagUrl: 'https://flagcdn.com/w40/jo.png',
    currencies: [
      { code: 'JOD', nameEn: 'Jordanian Dinar', nameAr: 'دينار أردني' },
    ],
  },
  {
    code: 'LB',
    nameEn: 'Lebanon',
    nameAr: 'لبنان',
    flagUrl: 'https://flagcdn.com/w40/lb.png',
    currencies: [
      { code: 'USD', nameEn: 'US Dollar', nameAr: 'دولار أمريكي' },
      { code: 'LBP', nameEn: 'Lebanese Pound', nameAr: 'ليرة لبنانية' },
    ],
  },
  {
    code: 'PS',
    nameEn: 'Palestine',
    nameAr: 'فلسطين',
    flagUrl: 'https://flagcdn.com/w40/ps.png',
    currencies: [
      { code: 'ILS', nameEn: 'Shekel', nameAr: 'شيكل' },
      { code: 'JOD', nameEn: 'Jordanian Dinar', nameAr: 'دينار أردني' },
      { code: 'USD', nameEn: 'US Dollar', nameAr: 'دولار أمريكي' },
    ],
  },
  {
    code: 'SY',
    nameEn: 'Syria',
    nameAr: 'سوريا',
    flagUrl: 'https://flagcdn.com/w40/sy.png',
    currencies: [
      { code: 'SYP', nameEn: 'Syrian Pound', nameAr: 'ليرة سورية' },
      { code: 'USD', nameEn: 'US Dollar', nameAr: 'دولار أمريكي' },
    ],
  },
  {
    code: 'SA',
    nameEn: 'Saudi Arabia',
    nameAr: 'السعودية',
    flagUrl: 'https://flagcdn.com/w40/sa.png',
    currencies: [
      { code: 'SAR', nameEn: 'Saudi Riyal', nameAr: 'ريال سعودي' },
    ],
  },
];

export const ALLOWED_CURRENCIES: Record<string, string[]> = {
  JO: ['JOD'],
  LB: ['USD', 'LBP'],
  PS: ['ILS', 'JOD', 'USD'],
  SY: ['SYP', 'USD'],
  SA: ['SAR'],
};

export function getSanitizedCurrency(countryCode: string, currency?: string): string {
  const allowed = ALLOWED_CURRENCIES[countryCode] || ALLOWED_CURRENCIES.JO;
  if (currency && allowed.includes(currency.toUpperCase())) {
    return currency.toUpperCase();
  }
  return allowed[0];
}

export function countryByCode(code: string): CountryDef {
  return countries.find((c) => c.code === code) || countries[0];
}
