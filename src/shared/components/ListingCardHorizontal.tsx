import React, { useMemo } from 'react';
import { Listing } from '@/types';
import { BookmarkHeartButton } from './BookmarkHeartButton';
import { Crown } from 'iconsax-react';
import { Icon } from '@iconify/react';
import { Badge } from '@/shared/ui/Badge';
import { pickSpecs } from '@/features/listings/helpers/pickSpecs';
import { ListingSpecsRow } from './ListingSpecsRow';

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
  const specs = useMemo(() => pickSpecs(listing.attributes, 5, listing.title), [listing.attributes, listing.title]);

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
            <Badge variant="warning" size="sm" className="flex items-center gap-1">
              <span>{isArabic ? 'مُميز' : 'Featured'}</span>
              <Crown size={12} variant="Bold" color="currentColor" className="text-accent" />
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
          <div className="flex items-center gap-1 text-xs text-ink-soft font-medium mt-1 mb-2">
            <Icon icon="noto:round-pushpin" width={12} height={12} className="shrink-0" />
            <span className="truncate" dir="auto">{locationText}</span>
          </div>
          {specs.length > 0 && <ListingSpecsRow specs={specs} compact />}
        </div>
        <div className="flex items-center justify-between mt-2 gap-1.5">
          <div className="price-tag text-base shrink-0">
            <span dir="ltr">
              {listing.price} <span className="text-xs font-bold text-danger">{displayCurrency}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
