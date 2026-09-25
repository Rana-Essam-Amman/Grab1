import React from 'react';
import { MagicStar } from 'iconsax-react';

interface AiReviewAIBadgeProps {
  readonly isArabic: boolean;
  readonly completed: number;
  readonly total: number;
}

export const AiReviewAIBadge: React.FC<AiReviewAIBadgeProps> = ({ isArabic, completed, total }) => {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="rounded-2xl bg-gradient-to-br from-brand/10 to-brand/5 border border-brand/20 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand/15 flex items-center justify-center shrink-0">
          <MagicStar size={20} variant="Bold" color="#E57E25" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-ink">
            {isArabic ? 'الذكاء الاصطناعي جهّز إعلانك' : 'AI prepared your listing'}
          </p>
          <p className="text-xs text-ink-muted mt-0.5">
            {isArabic ? `${completed} من ${total} حقول` : `${completed} of ${total} fields`}
            <span className="sr-only">{isArabic ? `${completed}/${total} حقول مكتملة` : `${completed}/${total} fields complete`}</span>
          </p>
        </div>
        <span className="text-lg font-black text-brand">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-brand/10 overflow-hidden">
        <div
          className="h-full bg-brand rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
