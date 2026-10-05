import React from 'react';
import { BookmarkHeartButton } from '@/shared/components';
import { ArrowLeft, ArrowRight, Share, Warning2, Trash } from 'iconsax-react';

export interface ListingDetailHeaderProps {
  isArabic: boolean;
  onBack: () => void;
  onShare: () => void;
  onReport: () => void;
  onDelete: () => void;
  isOwner: boolean;
  listingId: string;
}

export const ListingDetailHeader: React.FC<ListingDetailHeaderProps> = React.memo(({ isArabic, onBack, onShare, onReport, onDelete, isOwner, listingId }) => {
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  return (
    <div className="px-4 py-3 bg-brand border-b border-white/10 sticky top-0 z-30 flex items-center justify-between">
      <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer" aria-label={isArabic ? 'رجوع' : 'Back'}>
        <BackIcon size={18} variant="Bold" color="#FFFFFF" />
      </button>
      <div className="flex items-center gap-2">
        <BookmarkHeartButton listingId={listingId} size="md" />
        <button onClick={onShare} className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer" aria-label={isArabic ? 'مشاركة' : 'Share'}>
          <Share size={18} variant="Bold" color="#3B82F6" />
        </button>
        <button onClick={onReport} className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer" aria-label={isArabic ? 'إبلاغ' : 'Report'}>
          <Warning2 size={18} variant="Bold" color="#DC2626" />
        </button>
        {isOwner && (
          <button onClick={onDelete} className="w-9 h-9 rounded-full bg-danger/10 flex items-center justify-center text-danger hover:bg-danger/20 transition-colors cursor-pointer" aria-label={isArabic ? 'حذف الإعلان' : 'Delete listing'} title={isArabic ? 'حذف الإعلان' : 'Delete listing'}>
            <Trash size={18} variant="Bold" color="#FFFFFF" />
          </button>
        )}
      </div>
    </div>
  );
});

ListingDetailHeader.displayName = 'ListingDetailHeader';
