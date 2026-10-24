export const MIN_RATIO = 3 / 4;
export const MAX_RATIO = 16 / 9;
export const DEFAULT_RATIO = 4 / 3;

export function getClampedRatio(naturalWidth: number, naturalHeight: number): number {
  if (!naturalWidth || !naturalHeight) return DEFAULT_RATIO;
  const natural = naturalWidth / naturalHeight;
  return Math.max(MIN_RATIO, Math.min(MAX_RATIO, natural));
}
