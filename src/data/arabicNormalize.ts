// RULE-14-EXCEPTION: Static dictionary

/**
 * Normalizes Arabic text for misspelling-tolerant search.
 * Removes diacritics, tatweel, and standardizes hamzas, taa marbuta, and yaa.
 */
export function normalizeArabic(s: string): string {
  if (!s) return '';

  return s
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
