/**
 * Extract price. Priorities:
 *   1. Explicit marker: بسعر / السعر / ايجار / للإيجار (with optional unit)
 *   2. Number + currency word: "6500 دولار" / "500 دينار"
 *   3. Number + unit (excluding km contexts)
 * Fixes bug: "ماشية 87 الف كم ... السعر 12500" → 12500 (not 87000).
 */
export function extractPrice(text: string): string | undefined {
  if (!text) return undefined;
  const t = text.replace(/[\u0660-\u0669]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x30)
  );

  // Priority 1: explicit marker
  const explicit = t.match(
    /(?:بسعر|السعر|سعر|الثمن|الايجار|إيجار|ايجار|للإيجار|price|rent)\s*[:：]?\s*(\d[\d,.]*)\s*(ألف|الف|آلاف|الاف|k|K|مليون|مليونين|M)?/i
  );
  if (explicit) {
    const base = parseFloat(explicit[1].replace(/,/g, ''));
    const unit = explicit[2];
    if (!isNaN(base)) {
      let val = base;
      if (unit) {
        if (/ألف|الف|آلاف|الاف|k|K/.test(unit)) val *= 1000;
        if (/مليون|مليونين|M/.test(unit)) val *= 1_000_000;
      }
      return String(Math.round(val));
    }
  }

  // Priority 2: number + currency word
  const currency = t.match(
    /(\d[\d,.]*)\s*(?:دينار|دولار|ريال|شيكل|درهم|ليرة|jod|usd|sar|aed|dinar|dollar|riyal|shekel)/i
  );
  if (currency) {
    const n = currency[1].replace(/,/g, '');
    if (!isNaN(parseFloat(n))) return n;
  }

  // Priority 3: number + unit, but first strip km contexts
  const stripped = t.replace(
    /(?:ماشية|ماشي|ممشى|عداد|قطعت|مشيت)\s*\d[\d,.]*\s*(?:الف|ألف|آلاف|الاف|k|K)?\s*(?:كم|كيلومتر|كيلو)/gi,
    ' '
  );
  const withUnit = stripped.match(
    /(\d[\d,.]*)\s*(ألف|الف|آلاف|الاف|k|K|مليون|مليونين|M)(?![\u0600-\u06FF])/
  );
  if (withUnit) {
    const base = parseFloat(withUnit[1].replace(/,/g, ''));
    const unit = withUnit[2];
    if (!isNaN(base)) {
      let val = base;
      if (/ألف|الف|آلاف|الاف|k|K/.test(unit)) val *= 1000;
      if (/مليون|مليونين|M/.test(unit)) val *= 1_000_000;
      return String(Math.round(val));
    }
  }

  return undefined;
}
