/**
 * Extract price. Unit-bearing numbers WIN over plain numbers.
 * Fixes bug: "بسعر 15 الف" → 15 (should be 15000).
 * Handles: "15 الف"→15000, "70k"→70000, "1.5 مليون"→1500000, "بسعر 250"→250.
 */
export function extractPrice(text: string): string | undefined {
  if (!text) return undefined;
  const t = text.replace(/[\u0660-\u0669]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x30)
  );

  // Priority 1: number + unit word
  const withUnit = t.match(
    /(\d[\d,.]*)\s*(ألف|الف|آلاف|الاف|k|K|مليون|مليونين|M)\b/
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

  // Priority 2: explicit marker + plain number
  const explicit = t.match(/(?:بسعر|سعر|price)\s*(\d[\d,.]*)/i);
  if (explicit) {
    const n = explicit[1].replace(/,/g, '');
    if (n && !isNaN(parseFloat(n))) return n;
  }

  return undefined;
}
