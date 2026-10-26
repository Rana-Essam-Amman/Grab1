const EMOJI_REGEX = /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F1E6}-\u{1F1FF}]/gu;

export function stripEmojis(text: string): string {
  if (!text) return '';
  return text.replace(EMOJI_REGEX, '').replace(/\s+/g, ' ').trim();
}

export function stripEmojisFromInput(text: string): string {
  if (!text) return '';
  return text.replace(EMOJI_REGEX, '');
}
