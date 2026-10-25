export function stripEmojis(text: string): string {
  if (!text) return '';
  // Regex to match emojis and extended pictographs
  return text.replace(/[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F1E6}-\u{1F1FF}]/gu, '').replace(/\s+/g, ' ').trim();
}
