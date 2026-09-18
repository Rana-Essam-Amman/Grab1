import React from 'react';
import { Card } from '@/shared/ui/Card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ListingSellerCardProps {
  sellerName: string;
  sellerPhone: string;
  isArabic: boolean;
  onClick: () => void;
}

export const ListingSellerCard: React.FC<ListingSellerCardProps> = React.memo(({ sellerName, isArabic, onClick }) => {
  const ChevronIcon = isArabic ? ChevronLeft : ChevronRight;

  return (
    <Card
      variant="default"
      onClick={onClick}
      className="p-3.5 flex items-center justify-between shadow-2xs cursor-pointer active:scale-[0.99] transition-transform"
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-background flex items-center justify-center font-bold text-base text-primary border border-border">
          {sellerName ? sellerName.charAt(0) : '?'}
        </div>
        <div>
          <div className="text-sm font-bold text-ink">{sellerName}</div>
        </div>
      </div>
      <ChevronIcon size={18} className="text-ink-muted" />
    </Card>
  );
});

ListingSellerCard.displayName = 'ListingSellerCard';
