import React from 'react';
import { ArchiveBook, Heart } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';

interface WishlistEmptyStateProps {
  isArabic: boolean;
  emptyTitle: string;
  onExplore: () => void;
}

export const WishlistEmptyState: React.FC<WishlistEmptyStateProps> = ({
  isArabic,
  emptyTitle,
  onExplore,
}) => {
  return (
    <EmptyState
      icon={
        <div className="relative flex items-center justify-center">
          <ArchiveBook size={40} variant="Linear" color="#E57E25" className="text-primary" />
          <Heart size={18} variant="Bold" color="#EF4444" className="absolute top-7" />
        </div>
      }
      title={emptyTitle}
      description={
        isArabic
          ? 'لم تقم بحفظ أي إعلان بعد. تصفح الإعلانات المتاحة واضغط على رمز القلب لحفظها هنا.'
          : 'You have not saved any listings yet. Browse available ads and tap the heart to save them here.'
      }
      action={
        <Button
          variant="primary"
          size="md"
          onClick={onExplore}
          className="rounded-full font-bold shadow-md"
        >
          {isArabic ? 'تصفح واستكشف الإعلانات' : 'Explore listings'}
        </Button>
      }
      className="my-auto py-16 bg-surface border border-border rounded-2xl mx-4 mt-8"
    />
  );
};
