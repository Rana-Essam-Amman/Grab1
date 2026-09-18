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
    errorMsgAr: 'يجب أن يتكون الرقم من 9 خانات ويبدأ بـ 79 أو 78 أو 77 (مثال: 791234567 أو 0791234567)',
    errorMsgEn: 'Phone must start with 79, 78, or 77 and consist of 9 digits (e.g., 791234567 or 0791234567)',
  },
  LB: {
    prefixes: ['961'],
    pattern: /^\d{7,8}$/,
    format: (d) => `+961 ${d}`,
    errorMsgAr: 'رقم هاتف لبناني غير صحيح (يجب أن يتكون من 7 إلى 8 أرقام)',
    errorMsgEn: 'Invalid Lebanese phone number (must be 7 to 8 digits)',
  },
  PS: {
    prefixes: ['970', '972'],
    pattern: /^(59|56)\d{7}$/,
    format: (d) => `+970 ${d}`,
    errorMsgAr: 'يجب أن يتكون الرقم من 9 خانات ويبدأ بـ 59 أو 56 (مثال: 599123456)',
    errorMsgEn: 'Phone must start with 59 or 56 and consist of 9 digits (e.g., 599123456)',
  },
  SY: {
    prefixes: ['963'],
    pattern: /^9\d{7,8}$/,
    format: (d) => `+963 ${d}`,
    errorMsgAr: 'يجب أن يبدأ الرقم بـ 9 ويتكون من 8 إلى 9 أرقام (مثال: 944123456)',
    errorMsgEn: 'Phone must start with 9 and consist of 8 to 9 digits (e.g., 944123456)',
  },
  SA: {
    prefixes: ['966'],
    pattern: /^5\d{8}$/,
    format: (d) => `+966 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`,
    errorMsgAr: 'يجب أن يتكون الرقم من 9 أرقام ويبدأ بـ 5 (مثال: 512345678 أو 0512345678)',
    errorMsgEn: 'Phone must start with 5 and consist of 9 digits (e.g., 512345678 or 0512345678)',
  },
};
