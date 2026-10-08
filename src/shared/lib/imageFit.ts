/**
 * Adaptive image fit for marketplace cards.
 *
 * Handles EXIF-flipped portrait images: phones store portrait photos as
 * landscape pixels + EXIF rotate flag (1080×1440 → 1440×1080 + flag).
 * Supabase Transform strips EXIF, so browser sees ratio ~1.33 on what
 * the user considers a portrait photo. Threshold 1.4 keeps those contained.
 *
 * Landscape (ratio >= 1.4)          → object-cover (fills frame)
 * Portrait/square/mild (0.33..1.4)  → object-contain (shows fully)
 * Extreme portrait (ratio < 0.33)   → object-cover (avoids sliver render)
 *
 * FROZEN — see docs/CARD_IMAGE_PATTERN.md before modifying.
 */
export const EXTREME_PORTRAIT_RATIO = 0.33;
export const WIDE_LANDSCAPE_RATIO = 1.4;

export type ImageFitClass = 'object-cover' | 'object-contain';

export function pickImageFitClass(ratio: number): ImageFitClass {
  if (ratio >= WIDE_LANDSCAPE_RATIO) return 'object-cover';
  if (ratio >= EXTREME_PORTRAIT_RATIO) return 'object-contain';
  return 'object-cover';
}

export function ratioOf(width: number, height: number): number {
  if (!width || !height) return 1;
  return width / height;
}
