import React from 'react';

interface ConfidenceDotProps {
  readonly confidence?: 'high' | 'medium' | 'low';
  readonly isArabic: boolean;
}

/**
 * Small status dot next to a field label.
 *  🟢 high   — value came from exact match in the raw text
 *  🟡 medium — value was inferred (fuzzy, or not literally present)
 *  (no dot)  — low / missing: no visual noise for empty fields
 */
export const ConfidenceDot: React.FC<ConfidenceDotProps> = ({ confidence, isArabic }) => {
  if (confidence !== 'high' && confidence !== 'medium') return null;
  const isHigh = confidence === 'high';
  const title = isHigh
    ? (isArabic ? 'مستخرج من النص' : 'Extracted from text')
    : (isArabic ? 'مُستنتج — يُنصح بالمراجعة' : 'Inferred — review recommended');
  return (
    <span
      role="img"
      aria-label={title}
      title={title}
      className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${isHigh ? 'bg-success' : 'bg-warning'}`}
    />
  );
};
