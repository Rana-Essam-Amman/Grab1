import React from 'react';
import { CloseCircle, ExportSquare } from 'iconsax-react';
import { Listing } from '@/types';
import { Button } from '@/shared/ui/Button';

interface ShareModalHeaderProps {
  isArabic: boolean;
  listing: Listing;
  displayCurrency: string;
  onClose: () => void;
}

export const ShareModalHeader: React.FC<ShareModalHeaderProps> = ({
  isArabic,
  listing,
  displayCurrency,
  onClose,
}) => {
  return (
    <>
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <ExportSquare variant="Bold" size={18} color="#E57E25" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#0F172A]">
              {isArabic ? 'مشاركة الإعلان' : 'Share Classified Listing'}
            </h3>
            <p className="text-xs text-[#64748B] font-medium">
              {isArabic ? 'انشر الإعلان مع أصدقائك عبر المنصات' : 'Spread the word across your favorite networks'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] transition-colors cursor-pointer flex items-center justify-center p-0"
          aria-label={isArabic ? 'إغلاق' : 'Close'}
        >
          <CloseCircle variant="Bold" size={16} color="currentColor" />
        </Button>
      </div>

      <div className="my-4 p-3 flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl">
        <div className="flex items-center gap-3 overflow-hidden pe-2">
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-11 h-11 rounded-xl object-cover shrink-0 border border-border"
          />
          <div className="min-w-0">
            <div className="text-xs font-bold text-ink truncate">{listing.title}</div>
            <div className="text-xs font-extrabold text-danger mt-0.5">
              {listing.price} {displayCurrency}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
