/**
 * Layer 6 — Validator
 *
 * Final guard before a generated listing leaves the expert system. Enforces:
 *   1. No invented numbers: every digit sequence in output must appear in
 *      the source facts (as a string or a component of one).
 *   2. No forbidden phrases: phone numbers, WhatsApp, external contacts.
 *   3. No leftover slot markers.
 *   4. No empty paragraphs.
 *
 * Returns { valid, reason }. Never throws.
 */

export interface ValidationResult {
  readonly valid: boolean;
  readonly reason?: string;
}

export interface ValidatorFacts {
  readonly [key: string]: string | boolean | undefined;
}

const FORBIDDEN_PATTERNS: readonly RegExp[] = [
  /واتس\s*اب|واتساب|whatsapp/i,
  /\b05\d{8}\b/,                    // JO/LB mobile
  /\b07\d{9}\b/,                    // SA mobile
  /\b\+?\d{10,}\b/,                 // any 10+ digit sequence
  /\bwww\.[a-z0-9.-]+/i,
  /@[a-z0-9.-]+\.(com|net|org|jo|lb|sa|ps|sy)/i,
];

const SLOT_MARKER = /\{[a-zA-Z0-9_]+\}/;

/** Collect every string fact as normalized text for number matching. */
function collectFactText(facts: ValidatorFacts): string {
  const parts: string[] = [];
  for (const v of Object.values(facts)) {
    if (typeof v === 'string') parts.push(v);
    else if (typeof v === 'boolean') parts.push(v ? 'yes' : 'no');
  }
  return parts.join(' ');
}

/** Extract all digit sequences (length >= 2) from text. */
function digitsOf(text: string): string[] {
  const out: string[] = [];
  const re = /\d{2,}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) out.push(m[0]);
  return out;
}

/**
 * A number is "known" if it appears verbatim in any fact, OR if it appears
 * as a substring of any fact string (handles "15,000" vs "15000" vs "15 الف").
 */
function numberIsKnown(num: string, factText: string): boolean {
  if (factText.includes(num)) return true;
  const stripped = num.replace(/[,.\s]/g, '');
  if (stripped && factText.replace(/[,.\s]/g, '').includes(stripped)) return true;
  return false;
}

export function validateListing(
  title: string,
  paragraphs: readonly string[],
  facts: ValidatorFacts
): ValidationResult {
  // 1. Non-empty
  if (!title.trim()) return { valid: false, reason: 'empty title' };
  for (let i = 0; i < paragraphs.length; i++) {
    if (!paragraphs[i].trim()) return { valid: false, reason: `empty paragraph ${i + 1}` };
  }

  const combined = [title, ...paragraphs].join('\n');

  // 2. No slot markers left behind
  if (SLOT_MARKER.test(combined)) {
    return { valid: false, reason: 'unfilled slot marker' };
  }

  // 3. No forbidden phrases
  for (const pat of FORBIDDEN_PATTERNS) {
    if (pat.test(combined)) {
      return { valid: false, reason: `forbidden pattern: ${pat.source}` };
    }
  }

  // 4. No invented numbers
  const factText = collectFactText(facts);
  const nums = digitsOf(combined);
  for (const n of nums) {
    if (!numberIsKnown(n, factText)) {
      return { valid: false, reason: `invented number: ${n}` };
    }
  }

  return { valid: true };
}
