import React from 'react';
import { Star1, User } from 'iconsax-react';
import { Card } from '@/shared/ui/Card';
import type { SellerReview } from '../services/sellerReviewsService';

export interface ReviewListProps {
  readonly reviews: readonly SellerReview[];
  readonly isArabic: boolean;
}

function formatDate(iso: string, isArabic: boolean): string {
  try {
    return new Date(iso).toLocaleDateString(isArabic ? 'ar-JO' : 'en-GB', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch { return ''; }
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, isArabic }) => {
  if (reviews.length === 0) return null;
  return (
    <div className="flex flex-col gap-2.5">
      {reviews.map((r) => (
        <Card key={r.id} variant="default" className="p-3.5 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-canvas border border-border flex items-center justify-center shrink-0">
                <User size={14} variant="Bold" className="text-ink-muted" />
              </div>
              <span className="text-[11px] text-ink-muted">{formatDate(r.createdAt, isArabic)}</span>
            </div>
            <span className="inline-flex items-center gap-0.5 shrink-0">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star1 key={i} size={11} variant="Bold"
                  className={i <= r.rating ? 'text-warning' : 'text-line'} />
              ))}
            </span>
          </div>
          {r.comment && (
            <p className="text-xs text-ink-soft leading-relaxed" dir="auto">{r.comment}</p>
          )}
        </Card>
      ))}
    </div>
  );
};
