export function normalize(text: string): string {
  return text
    .replace(/[\u064B-\u0652\u0670]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x30))
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function collapse(text: string): string {
  return normalize(text).replace(/\s/g, '');
}
