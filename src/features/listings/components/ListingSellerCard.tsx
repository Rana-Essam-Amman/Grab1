import React from 'react';
import { Card } from '@/shared/ui/Card';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';

export interface ListingSellerCardProps {
  sellerName: string;
  sellerPhone: string;
  isArabic: boolean;
  onClick: () => void;
}

export const ListingSellerCard: React.FC<ListingSellerCardProps> = React.memo(({ sellerName, isArabic, onClick }) => {
  const ChevronIcon = isArabic ? ArrowLeft2 : ArrowRight2;

  return (
    <Card
      variant="default"
      onClick={onClick}
      className="p-3.5 flex items-center justify-between bg-surface border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-accent/40 cursor-pointer active:scale-[0.99] transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center font-black text-lg text-accent border border-accent/30 shrink-0">
          {sellerName ? sellerName.charAt(0) : '?'}
        </div>
        <div className="flex flex-col min-w-0">
          <div className="text-sm font-bold text-ink truncate">{sellerName}</div>
          <div className="text-[11px] text-ink-muted">
            {isArabic ? 'عرض الملف الشخصي' : 'View profile'}
          </div>
        </div>
      </div>
      <ChevronIcon size={18} variant="Bold" color="currentColor" className="text-ink shrink-0" />
    </Card>
  );
});

ListingSellerCard.displayName = 'ListingSellerCard';
