import React, { useMemo } from 'react';
import { Listing } from '@/types';
import { BookmarkHeartButton } from './BookmarkHeartButton';
import { Crown } from 'iconsax-react';
import { Icon } from '@iconify/react';
import { Badge } from '@/shared/ui/Badge';
import { RequiredSpecsRow } from '@/features/listings/components/RequiredSpecsRow';
import { ListingCardSellerRow } from '@/features/listings/components/ListingCardSellerRow';
import { toOptimizedImageUrl } from '@/shared/lib/optimizedImage';
import { formatPrice } from '@/shared/lib/formatPrice';
import { formatRelativeDate } from '@/shared/lib/formatDate';
import { stripEmojis } from '@/shared/lib/stripEmojis';

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

  return (
    <div
      data-testid="listing-card"
      onClick={handleClick}
      className={`${premiumClasses} rounded-2xl border overflow-hidden cursor-pointer hover:border-primary/60 transition-all shadow-xs group active:scale-[0.98]`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="p-3 flex gap-3 items-start">
        <div className="w-[120px] h-[120px] rounded-xl overflow-hidden bg-surface relative shrink-0 border border-border/50">
          <img
            src={toOptimizedImageUrl(listing.imageUrl, { width: 400, quality: 80 })}
            alt={listing.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
          />
          {listing.isPremium && (
            <div className="absolute top-1.5 start-1.5 z-10">
              <Badge variant="warning" size="sm" className="flex items-center gap-1 shadow-sm">
                <span>{isArabic ? 'مُميز' : 'Featured'}</span>
                <Crown size={12} variant="Bold" color="currentColor" className="text-accent" />
              </Badge>
            </div>
          )}
          <div className="absolute top-1.5 end-1.5">
            <BookmarkHeartButton listingId={listing.id} size="sm" />
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[120px] py-0.5">
          <div>
            <div className="text-[15px] font-bold text-ink leading-tight line-clamp-2" dir="auto">
              {stripEmojis(listing.title)}
            </div>

            <div className="flex items-center justify-between gap-1 text-[11px] text-ink-soft font-medium mt-1.5 mb-2">
              <div className="flex items-center gap-1 truncate">
                <Icon icon="noto:round-pushpin" width={12} height={12} className="shrink-0" />
                <span className="truncate" dir="auto">{locationText}</span>
              </div>
              {relativeDate && (
                <div className="flex items-center gap-1 shrink-0 text-ink-muted">
                  <Icon icon="lucide:clock" width={11} height={11} className="shrink-0" />
                  <span>{relativeDate}</span>
                </div>
              )}
            </div>

            <RequiredSpecsRow
              categorySlug={listing.categorySlug}
              subcategorySlug={listing.subcategorySlug}
              attributes={listing.attributes ?? []}
              isArabic={isArabic}
            />
          </div>

          <div className="flex items-center mt-2 gap-1.5">
            <div className="text-[18px] font-extrabold text-primary shrink-0">
              <span>{formatPrice(listing.price, listing.currency, isArabic)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-3 py-2 bg-canvas">
        <ListingCardSellerRow sellerName={listing.sellerName} sellerKey={sellerKey} />
      </div>
    </div>
  );
};