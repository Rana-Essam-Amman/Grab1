/**
 * Extract 4-digit year (1950-2029) from text.
 * Prefers year after "موديل"/"سنة" if present.
 */
export function extractYear(text: string): string | undefined {
  if (!text) return undefined;
  const t = text.replace(/[\u0660-\u0669]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x30)
  );

  const labeled = t.match(
    /(?:موديل|سنة|سنه|model|year)\s*[:：]?\s*((?:19[5-9]\d)|(?:20[0-2]\d))/
  );
  if (labeled) return labeled[1];

  const bare = t.match(/\b((?:19[5-9]\d)|(?:20[0-2]\d))\b/);
  return bare ? bare[1] : undefined;
}
