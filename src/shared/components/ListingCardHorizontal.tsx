import React from 'react';
import { Listing } from '@/types';
import { BookmarkHeartButton } from './BookmarkHeartButton';
import { Location, Eye } from 'iconsax-react';
import { Badge } from '@/shared/ui/Badge';

interface ListingCardHorizontalProps {
  listing: Listing;
  isArabic: boolean;
  locationText: string;
  displayCurrency: string;
  premiumClasses: string;
  handleClick: () => void;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const ListingCardHorizontal: React.FC<ListingCardHorizontalProps> = ({
  listing,
  isArabic,
  locationText,
  displayCurrency,
  premiumClasses,
  handleClick,
  handleImageError,
}) => {
  return (
    <div
      onClick={handleClick}
      className={`${premiumClasses} rounded-2xl p-3 border flex gap-3 cursor-pointer hover:border-primary/60 transition-all shadow-xs`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="w-24 h-24 rounded-xl overflow-hidden bg-background relative shrink-0">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        {listing.isPremium && (
          <div className="absolute top-1.5 start-1.5 z-10">
            <Badge variant="warning" size="sm">
              {isArabic ? 'مُميز ✨' : 'Featured ✨'}
            </Badge>
          </div>
        )}
        <div className="absolute top-1.5 end-1.5">
          <BookmarkHeartButton listingId={listing.id} size="sm" />
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="text-[15px] font-bold text-ink truncate" dir="auto">{listing.title}</div>
          <div className="flex items-center gap-1 text-xs text-ink-soft font-medium mt-1">
            <Location variant="Bold" size={12} color="#94A3B8" className="shrink-0" />
            <span className="truncate" dir="auto">{locationText}</span>
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <div className="price-tag text-base">
            <span dir="ltr">
              {listing.price} <span className="text-xs font-bold text-danger">{displayCurrency}</span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-ink-soft font-semibold">
            <Eye variant="Bold" size={12} color="#94A3B8" />
            <span>{listing.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
