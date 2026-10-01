// RULE-14-EXCEPTION: Static dictionary

/**
 * Normalizes Arabic text for misspelling-tolerant search.
 * Removes diacritics, tatweel, and standardizes hamzas, taa marbuta, and yaa.
 */
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

function digitToLatin(match: string): string {
  const a = ARABIC_DIGITS.indexOf(match);
  if (a !== -1) return String(a);
  const p = PERSIAN_DIGITS.indexOf(match);
  if (p !== -1) return String(p);
  return match;
}

export function normalizeArabic(s: string): string {
  if (!s) return '';

  return s
    .replace(/[٠-٩۰-۹]/g, digitToLatin) // Arabic + Persian digits → Latin
    .replace(/[،؛؟]/g, (c) => ({ '،': ',', '؛': ';', '؟': '?' }[c] || c)) // Arabic punctuation → Latin
    .normalize('NFD') // Decompose accented characters (café → cafe + accent)
    .replace(/[\u0300-\u036f]/g, '') // Strip Latin combining marks (é → e, Ä → A)
    .normalize('NFC') // Recompose back to NFC so that Arabic Hamza combinations are restored
    .toLowerCase()
    .replace(/[\u064B-\u0652]/g, '') // Remove Arabic diacritics
    .replace(/\u0640/g, '') // Remove tatweel
    .replace(/[أإآ]/g, 'ا') // Normalize Alif
    .replace(/ى/g, 'ي') // Normalize Yaa
    .replace(/ة/g, 'ه') // Normalize Taa Marbuta
    .replace(/ؤ/g, 'و') // Normalize Waw with Hamza
    .replace(/ئ/g, 'ي') // Normalize Yaa with Hamza
    .replace(/\s+/g, ' ') // Collapse spaces
    .trim();
}
