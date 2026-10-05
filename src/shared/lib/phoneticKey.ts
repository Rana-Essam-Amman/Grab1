/**
 * Phonetic consonant-skeleton key for cross-script search.
 *
 * "عبدون"  → "bdn"    "Abdoun" → "bdn"    "Abdoon" → "bdn"
 * "دابوق"  → "dbk"    "Dabouq" → "dbk"
 * "رولكس"  → "rlks"   "Rolex"  → "rlks"
 * "الجبيهة"→ "jbh"    "Jubeiha"→ "jbh"
 * "فيـلا"  → "fl"     "villa"  → "fl"
 *
 * Lossy on purpose — false positives are far cheaper than false negatives.
 * Never throws. Returns "" for empty/invalid input.
 */

import { normalizeArabic } from '@/data/arabicNormalize';

const AR_TO_LATIN: Readonly<Record<string, string>> = {
  ا: 'a', ب: 'b', ت: 't', ث: 't',
  ج: 'j', ح: 'h', خ: 'k',
  د: 'd', ذ: 'd', ر: 'r', ز: 'z',
  س: 's', ش: 's', ص: 's', ض: 'd',
  ط: 't', ظ: 'd', ع: 'a', غ: 'g',
  ف: 'f', ق: 'k', ك: 'k', ل: 'l',
  م: 'm', ن: 'n', ه: 'h', و: 'u', ي: 'i',
};

function arabicToLatin(s: string): string {
  let out = '';
  for (const ch of s) out += AR_TO_LATIN[ch] ?? ch;
  return out;
}

function canonicalizeLatin(s: string): string {
  return s
    .replace(/ph/g, 'f')
    .replace(/ck/g, 'k')
    .replace(/kh/g, 'k')
    .replace(/gh/g, 'g')
    .replace(/th/g, 't')
    .replace(/dh/g, 'd')
    .replace(/sh/g, 's')
    .replace(/ch/g, 's')
    .replace(/x/g, 'ks')
    .replace(/v/g, 'f')
    .replace(/p/g, 'b')
    .replace(/q/g, 'k')
    .replace(/c(?!h)/g, 'k')
    .replace(/(.)\1+/g, '$1');
}

/** Strip Arabic definite article "ال" for consistent keys. */
function stripDefiniteArticle(s: string): string {
  return s.startsWith('ال') && s.length > 3 ? s.slice(2) : s;
}

export function phoneticKey(input: string): string {
  if (!input) return '';
  const norm = normalizeArabic(input);
  const stripped = stripDefiniteArticle(norm);
  const latin = arabicToLatin(stripped);
  const canon = canonicalizeLatin(latin);
  const consonants = canon.replace(/[aeiouwy]/g, '');
  return consonants.replace(/[^a-z0-9]/g, '');
}
