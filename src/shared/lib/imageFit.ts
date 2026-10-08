/**
 * Adaptive image fit for marketplace cards.
 * Mirrors Instagram's bounded-contain logic (Android Blog, 2021).
 *
 * Landscape / square (ratio >= 1)      → object-cover (fills frame)
 * Normal portrait (0.33 <= ratio < 1)  → object-contain (shows fully)
 * Extreme portrait (ratio < 0.33)      → object-cover (avoids sliver render)
 *
 * FROZEN — see docs/CARD_IMAGE_PATTERN.md before modifying.
 */
export const EXTREME_PORTRAIT_RATIO = 0.33;

export type ImageFitClass = 'object-cover' | 'object-contain';

export function pickImageFitClass(ratio: number): ImageFitClass {
  if (ratio >= 1) return 'object-cover';
  if (ratio >= EXTREME_PORTRAIT_RATIO) return 'object-contain';
  return 'object-cover';
}

export function ratioOf(width: number, height: number): number {
  if (!width || !height) return 1;
  return width / height;
}
