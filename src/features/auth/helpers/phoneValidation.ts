import { COUNTRY_PHONE_RULES } from './phoneRules';

export interface PhoneVerificationResult {
  isValid: boolean;
  cleaned: string;
  formattedPhone: string;
  errorMsgAr: string;
  errorMsgEn: string;
}

export const cleanAndVerifyPhone = (rawPhone: string, countryCode: string): PhoneVerificationResult => {
  let cleaned = rawPhone.replace(/[\s\-\(\)\+]/g, '').replace(/^00/, '');
  const rule = COUNTRY_PHONE_RULES[countryCode];

  if (rule) {
    for (const prefix of rule.prefixes) {
      if (cleaned.startsWith(prefix)) {
        cleaned = cleaned.slice(prefix.length);
        break;
      }
    }
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.slice(1);
    }
    const isValid = rule.pattern.test(cleaned);
    return {
      isValid,
      cleaned,
      formattedPhone: rule.format(cleaned),
      errorMsgAr: rule.errorMsgAr,
      errorMsgEn: rule.errorMsgEn,
    };
  }

  return {
    isValid: cleaned.length >= 6,
    cleaned,
    formattedPhone: cleaned,
    errorMsgAr: 'رقم هاتف غير صحيح',
    errorMsgEn: 'Invalid phone number',
  };
};

/**
 * Returns the flag emoji corresponding to a 2-letter ISO country code.
 */
export const getFlagEmoji = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export interface PhoneValidationResult {
  readonly valid: boolean;
  readonly normalized: string;
  readonly error: string | null;
}

const MIN_DIGITS = 7;
const MAX_DIGITS = 15;

export function normalizePhone(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  return hasPlus ? `+${digits}` : digits;
}

export function validatePhone(input: string): PhoneValidationResult {
  const normalized = normalizePhone(input);
  const digitsOnly = normalized.replace(/\D/g, '');
  if (!digitsOnly) return { valid: false, normalized: '', error: 'رقم الهاتف مطلوب' };
  if (digitsOnly.length < MIN_DIGITS) return { valid: false, normalized, error: 'رقم الهاتف قصير جداً' };
  if (digitsOnly.length > MAX_DIGITS) return { valid: false, normalized, error: 'رقم الهاتف طويل جداً' };
  return { valid: true, normalized, error: null };
}
