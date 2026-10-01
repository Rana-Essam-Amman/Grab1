/**
 * Extract mileage (km). Handles: "ماشية 80 الف", "العداد 120000",
 * "80k km", "50,000 كم".
 */
export function extractMileage(text: string): string | undefined {
  if (!text) return undefined;
  const t = text.replace(/[\u0660-\u0669]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x30)
  );

  // "ماشية/العداد/ماشي 80 الف/آلاف/k"
  const labeledUnit = t.match(
    /(?:ماشية|ماشي|ممشى|ممشيه|العداد|عداد|قطعت|مشيت|mileage|km)\s*(\d[\d,.]*)\s*(ألف|الف|آلاف|الاف|k|K)?/i
  );
  if (labeledUnit) {
    const base = parseFloat(labeledUnit[1].replace(/,/g, ''));
    const unit = labeledUnit[2];
    if (!isNaN(base)) {
      let val = base;
      if (unit && /ألف|الف|آلاف|الاف|k|K/.test(unit)) val *= 1000;
      return String(Math.round(val));
    }
  }

  // bare "80,000 كم"
  const withKm = t.match(/(\d[\d,.]*)\s*(?:كم|كيلو|km)\b/i);
  if (withKm) {
    const n = withKm[1].replace(/,/g, '');
    if (!isNaN(parseFloat(n))) return n;
  }

  return undefined;
}
