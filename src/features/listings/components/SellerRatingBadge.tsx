import React from 'react';
import { Star1 } from 'iconsax-react';

export interface SellerRatingBadgeProps {
  readonly ratingAvg: number;
  readonly ratingCount: number;
  readonly isArabic: boolean;
  readonly size?: 'sm' | 'md';
}

const SIZE_MAP = { sm: 12, md: 16 } as const;

export const SellerRatingBadge: React.FC<SellerRatingBadgeProps> = ({
  ratingAvg, ratingCount, isArabic, size = 'sm',
}) => {
  if (ratingCount === 0) {
    return (
      <span className="text-[11px] text-ink-muted">
        {isArabic ? 'لا توجد تقييمات بعد' : 'No ratings yet'}
      </span>
    );
  }
  const rounded = Math.round(ratingAvg);
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star1
            key={i}
            size={SIZE_MAP[size]}
            variant="Bold"
            className={i <= rounded ? 'text-warning' : 'text-line'}
          />
        ))}
      </span>
      <span className="text-[11px] font-bold text-ink">
        {ratingAvg.toFixed(1)}
      </span>
      <span className="text-[11px] text-ink-muted">
        ({ratingCount})
      </span>
    </span>
  );
};
