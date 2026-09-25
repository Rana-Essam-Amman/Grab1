export function extractSize(text: string): string | undefined {
  if (!text || !text.trim()) return undefined;

  const storageMatch = text.match(/\b(\d+(?:TB|GB|MB))\b/i);
  if (storageMatch) return storageMatch[1].toUpperCase();

  const letterMatch = text.match(/\b(XXXL|XXL|XL|XS|XXS|S|M|L)\b/i);
  if (letterMatch) return letterMatch[1].toUpperCase();

  const numericMatch = text.match(/\b(3[6-9]|4[0-9]|5[0-2])\b/);
  if (numericMatch) return numericMatch[1];

  return undefined;
}
