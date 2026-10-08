import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { WriteReviewSheet } from './WriteReviewSheet';
import { submitSellerReview } from '../services/sellerReviewsService';

export interface ListingRateSellerButtonProps {
  readonly listingId: string;
  readonly sellerName: string;
  readonly sellerUserId?: string;
  readonly sellerPhone?: string;
  readonly isArabic: boolean;
}

export const ListingRateSellerButton: React.FC<ListingRateSellerButtonProps> = ({
  listingId,
  sellerName,
  sellerUserId,
  sellerPhone,
  isArabic,
}) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = Boolean(
    user &&
      ((user.id && sellerUserId && user.id === sellerUserId) ||
        (user.phone && sellerPhone && user.phone === sellerPhone))
  );
  const canRate = Boolean(user && !isOwner && listingId);

  const handleSubmit = useCallback(
    async (rating: number, comment: string) => {
      setIsSubmitting(true);
      const { error } = await submitSellerReview(listingId, rating, comment);
      setIsSubmitting(false);
      if (error) {
        toast.error(isArabic ? 'فشل إرسال التقييم' : 'Failed to submit review');
        return;
      }
      setOpen(false);
      toast.success(isArabic ? 'شكراً لتقييمك ✓' : 'Thanks for your review ✓');
    },
    [listingId, isArabic]
  );

  if (!canRate) return null;

  return (
    <>
      <Button
        id="listing-rate-seller"
        variant="outline"
        size="sm"
        fullWidth
        onClick={() => setOpen(true)}
      >
        {isArabic ? 'قيّم البائع' : 'Rate seller'}
      </Button>
      <WriteReviewSheet
        open={open}
        isArabic={isArabic}
        sellerName={sellerName}
        isSubmitting={isSubmitting}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};
