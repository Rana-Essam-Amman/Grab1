import React, { useMemo, useCallback } from 'react';
import { Listing } from '@/types';
import { BookmarkHeartButton } from './BookmarkHeartButton';
import { Icon } from '@iconify/react';
import { Crown } from 'iconsax-react';
import { RequiredSpecsRow } from '@/features/listings/components/RequiredSpecsRow';
import { toOptimizedImageUrl } from '@/shared/lib/optimizedImage';
import { formatPrice } from '@/shared/lib/formatPrice';
import { formatRelativeDate } from '@/shared/lib/formatDate';
import { stripEmojis } from '@/shared/lib/stripEmojis';
import { CardContactActions } from './CardContactActions';
import { ListingImageCollage } from './ListingImageCollage';
import { useUI } from '@/hooks/useUI';

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
  const { setSelectedSellerPhone, navigateTo } = useUI();

  const relativeDate = useMemo(() => formatRelativeDate(listing.createdAt, isArabic), [listing.createdAt, isArabic]);

  const displayImages = useMemo(() => {
    if (listing.images && listing.images.length > 0) {
      return listing.images.map(img => toOptimizedImageUrl(img, { width: 600, quality: 80 }));
    }
    return listing.imageUrl ? [toOptimizedImageUrl(listing.imageUrl, { width: 600, quality: 80 })] : [];
  }, [listing.images, listing.imageUrl]);

  const handleSellerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!sellerKey) return;
    setSelectedSellerPhone(sellerKey);
    navigateTo('seller-profile');
  }, [sellerKey, setSelectedSellerPhone, navigateTo]);

  return (
    <div
      data-testid="listing-card"
      onClick={handleClick}
      className={`${premiumClasses} rounded-2xl shadow-md flex flex-col overflow-hidden cursor-pointer hover:border-primary/60 transition-all active:scale-[0.99]`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Header: Seller Info & Heart */}
      <div className="flex items-center justify-between gap-2 p-2.5 pb-1.5">
        <div className="flex items-center gap-2 cursor-pointer flex-1" onClick={handleSellerClick}>
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-xs">{listing.sellerName?.charAt(0) || '?'}</span>
          </div>
          <span className="font-semibold text-[12px] text-ink leading-tight hover:underline">{listing.sellerName}</span>
        </div>
        <div className="shrink-0 z-30">
          <BookmarkHeartButton listingId={listing.id} size="sm" />
        </div>
      </div>

      {/* Image Collage with Premium Badge */}
      <div className="relative w-full">
        <ListingImageCollage images={displayImages} onImageError={handleImageError} />
        {listing.isPremium && (
          <div className="absolute top-2 start-2 z-10">
            <span className="bg-accent text-ink-inverse text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-md flex items-center gap-1">
              <Crown size={12} variant="Bold" color="#FFFFFF" />
              {isArabic ? 'مُميز' : 'Featured'}
            </span>
          </div>
        )}
      </div>

      {/* Body: Price, Title, Specs, Location */}
      <div className="p-2.5 flex flex-col flex-1">
        <div className="text-[18px] font-extrabold text-danger mb-1">
          {formatPrice(listing.price, listing.currency, isArabic)}
        </div>

        <h3 className="font-bold text-[14px] leading-snug line-clamp-2 text-ink mb-2" dir="auto">
          {stripEmojis(listing.title)}
        </h3>

        <div className="mb-2">
          <RequiredSpecsRow
            categorySlug={listing.categorySlug}
            subcategorySlug={listing.subcategorySlug}
            attributes={listing.attributes ?? []}
            isArabic={isArabic}
          />
        </div>

        <div className="flex items-center justify-between gap-1 text-[11px] text-ink-soft mb-1.5">
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

        {/* Contact Actions */}
        <CardContactActions listing={listing} isArabic={isArabic} />
      </div>
    </div>
  );
};
