import React, { useMemo } from 'react';
import { Listing } from '@/types';
import { BookmarkHeartButton } from './BookmarkHeartButton';
import { Icon } from '@iconify/react';
import { RequiredSpecsRow } from '@/features/listings/components/RequiredSpecsRow';
import { toOptimizedImageUrl } from '@/shared/lib/optimizedImage';
import { formatPrice } from '@/shared/lib/formatPrice';
import { formatRelativeDate } from '@/shared/lib/formatDate';
import { stripEmojis } from '@/shared/lib/stripEmojis';
import { ListingImageCollage } from './ListingImageCollage';

interface ListingCardHorizontalProps {
  listing: Listing;
  isArabic: boolean;
  locationText: string;
  displayCurrency: string;
  premiumClasses: string;
  sellerKey: string;
  handleClick: () => void;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const ListingCardHorizontal: React.FC<ListingCardHorizontalProps> = ({
  listing,
  isArabic,
  locationText,
  premiumClasses,
  sellerKey,
  handleClick,
  handleImageError,
}) => {
  const relativeDate = useMemo(() => formatRelativeDate(listing.createdAt, isArabic), [listing.createdAt, isArabic]);

  const displayImages = useMemo(() => {
    if (listing.images && listing.images.length > 0) {
      return listing.images.map(img => toOptimizedImageUrl(img, { width: 600, quality: 80 }));
    }
    return listing.imageUrl ? [toOptimizedImageUrl(listing.imageUrl, { width: 600, quality: 80 })] : [];
  }, [listing.images, listing.imageUrl]);

  return (
    <div
      data-testid="listing-card"
      onClick={handleClick}
      className={`${premiumClasses} rounded-2xl mb-4 shadow-md flex flex-col overflow-hidden cursor-pointer hover:border-primary/60 transition-all active:scale-[0.99]`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center gap-2.5 p-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-primary font-bold text-base">{listing.sellerName?.charAt(0) || '?'}</span>
        </div>
        <div className="flex flex-col flex-1">
          <span className="font-semibold text-[15px] text-ink leading-tight">{listing.sellerName}</span>
          <div className="flex items-center gap-1 text-[13px] text-ink-muted mt-0.5">
            <Icon icon="noto:round-pushpin" width={12} height={12} className="shrink-0" />
            <span>{locationText}</span>
            {relativeDate && (
              <>
                <span>•</span>
                <span>{relativeDate}</span>
              </>
            )}
          </div>
        </div>
        <div className="shrink-0 z-10">
          <BookmarkHeartButton listingId={listing.id} size="sm" />
        </div>
      </div>

      <div className="px-3 pb-3">
        <div className="bg-canvas p-2.5 rounded-lg mb-2">
          <h3 className="font-bold text-[15px] leading-tight line-clamp-2 text-ink" dir="auto">
            {stripEmojis(listing.title)}
          </h3>
        </div>
        <RequiredSpecsRow
          categorySlug={listing.categorySlug}
          subcategorySlug={listing.subcategorySlug}
          attributes={listing.attributes ?? []}
          isArabic={isArabic}
        />
      </div>

      <ListingImageCollage images={displayImages} onImageError={handleImageError} />

      <div className="px-3 py-3 border-t border-border mt-1 flex justify-between items-center bg-surface">
        <span className="text-[22px] font-extrabold text-danger">
          {formatPrice(listing.price, listing.currency, isArabic)}
        </span>
      </div>
    </div>
  );
};
