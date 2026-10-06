import React, { useState, useCallback } from 'react';
import { Sheet } from '@/shared/ui/Sheet';
import { Star1 } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';

export interface WriteReviewSheetProps {
  readonly open: boolean;
  readonly isArabic: boolean;
  readonly sellerName: string;
  readonly isSubmitting: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (rating: number, comment: string) => void;
}

export const WriteReviewSheet: React.FC<WriteReviewSheetProps> = ({
  open, isArabic, sellerName, isSubmitting, onClose, onSubmit,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = useCallback(() => {
    if (rating < 1 || rating > 5) return;
    onSubmit(rating, comment.trim());
  }, [rating, comment, onSubmit]);

  return (
    <Sheet open={open} onClose={onClose} title={isArabic ? 'قيّم البائع' : 'Rate this seller'}>
      <div className="flex flex-col gap-4 pb-2" dir={isArabic ? 'rtl' : 'ltr'}>
        <p className="text-sm text-ink-soft">
          {isArabic ? `كيف كانت تجربتك مع ${sellerName}؟` : `How was your experience with ${sellerName}?`}
        </p>

        <div className="flex items-center justify-center gap-2 py-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              aria-label={`${i} stars`}
              className="cursor-pointer active:scale-95 transition-transform"
            >
              <Star1 size={32} variant="Bold"
                className={i <= rating ? 'text-warning' : 'text-line'} />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 500))}
          placeholder={isArabic ? 'أضف تعليقاً (اختياري)...' : 'Add a comment (optional)...'}
          rows={3}
          dir="auto"
          className="w-full p-3 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:border-accent resize-none"
        />

        <Button variant="primary" size="lg" fullWidth onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting
            ? (isArabic ? 'جاري الإرسال...' : 'Submitting...')
            : (isArabic ? 'إرسال التقييم' : 'Submit review')}
        </Button>
      </div>
    </Sheet>
  );
};
