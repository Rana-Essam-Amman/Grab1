export interface CountryPhoneRule {
  prefixes: string[];
  pattern: RegExp;
  format: (digits: string) => string;
  errorMsgAr: string;
  errorMsgEn: string;
}

export const COUNTRY_PHONE_RULES: Record<string, CountryPhoneRule> = {
  JO: {
    prefixes: ['962'],
    pattern: /^(79|78|77)\d{7}$/,
    format: (d) => `+962 ${d.slice(0, 2)} ${d.slice(2, 6)} ${d.slice(6)}`,
    errorMsgAr: 'رقم غير صحيح. أدخل رقماً صحيحاً للأردن',
    errorMsgEn: 'Invalid number. Enter a valid Jordan phone.',
  },
  LB: {
    prefixes: ['961'],
    pattern: /^(3\d{6}|(70|71|76|78|79|81)\d{6})$/,
    format: (d) => `+961 ${d}`,
    errorMsgAr: 'رقم غير صحيح. أدخل رقماً صحيحاً للبنان',
    errorMsgEn: 'Invalid number. Enter a valid Lebanon phone.',
  },
  PS: {
    prefixes: ['970', '972'],
    pattern: /^(59|58|56)\d{7}$/,
    format: (d) => `+970 ${d}`,
    errorMsgAr: 'رقم غير صحيح. أدخل رقماً صحيحاً لفلسطين',
    errorMsgEn: 'Invalid number. Enter a valid Palestine phone.',
  },
  SY: {
    prefixes: ['963'],
    pattern: /^9\d{8}$/,
    format: (d) => `+963 ${d}`,
    errorMsgAr: 'رقم غير صحيح. أدخل رقماً صحيحاً لسوريا',
    errorMsgEn: 'Invalid number. Enter a valid Syria phone.',
  },
  SA: {
    prefixes: ['966'],
    pattern: /^5\d{8}$/,
    format: (d) => `+966 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`,
    errorMsgAr: 'رقم غير صحيح. أدخل رقماً صحيحاً للسعودية',
    errorMsgEn: 'Invalid number. Enter a valid Saudi phone.',
  },
};
