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
  listing: Listing; isArabic: boolean; locationText: string; displayCurrency: string;
  premiumClasses: string; sellerKey: string; handleClick: () => void;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const ListingCardHorizontal: React.FC<ListingCardHorizontalProps> = ({
  listing, isArabic, locationText, premiumClasses, sellerKey, handleClick, handleImageError,
}) => {
  const { setSelectedSellerPhone, navigateTo } = useUI();
  const relativeDate = useMemo(() => formatRelativeDate(listing.createdAt, isArabic), [listing.createdAt, isArabic]);

  const displayImages = useMemo(() => {
    const imgs = listing.images?.length ? listing.images : (listing.imageUrl ? [listing.imageUrl] : []);
    return imgs.map(img => toOptimizedImageUrl(img, { width: 600, quality: 80 }));
  }, [listing.images, listing.imageUrl]);

  const handleSellerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!sellerKey) return;
    setSelectedSellerPhone(sellerKey);
    navigateTo('seller-profile');
  }, [sellerKey, setSelectedSellerPhone, navigateTo]);

  return (
    <div data-testid="listing-card" onClick={handleClick} className={`${premiumClasses} rounded-2xl shadow-md flex flex-col overflow-hidden cursor-pointer hover:border-primary/60 transition-all active:scale-[0.99]`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between gap-2 p-3 pb-2">
        <div className="flex items-center gap-2 cursor-pointer flex-1 min-w-0" onClick={handleSellerClick}>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-sm">{listing.sellerName?.charAt(0) || '?'}</span>
          </div>
          <span className="font-semibold text-[13px] text-ink leading-tight hover:underline truncate shrink-0 max-w-[40%]">
            {listing.sellerName}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-ink-soft min-w-0 flex-1 ms-1">
            <Icon icon="noto:round-pushpin" width={12} height={12} className="shrink-0" />
            <span className="truncate min-w-0 flex-1" dir="auto">{locationText}</span>
            {relativeDate && (
              <>
                <span className="mx-0.5 text-ink-muted shrink-0">•</span>
                <Icon icon="lucide:clock" width={11} height={11} className="shrink-0" />
                <span className="shrink-0 whitespace-nowrap">{relativeDate}</span>
              </>
            )}
          </div>
        </div>
        <div className="shrink-0 z-30">
          <BookmarkHeartButton listingId={listing.id} size="sm" />
        </div>
      </div>

      <div className="relative w-full">
        <ListingImageCollage images={displayImages} onImageError={handleImageError} />
        {listing.isPremium && (
          <div className="absolute top-2 start-2 z-10">
            <span className="bg-accent text-ink-inverse text-[11px] font-bold px-2 py-1 rounded-md shadow-md flex items-center gap-1">
              <Crown size={13} variant="Bold" color="#FFFFFF" />
              {isArabic ? 'مُميز' : 'Featured'}
            </span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <div className="text-[18px] font-extrabold text-danger mb-1">
          {formatPrice(listing.price, listing.currency, isArabic)}
        </div>
        <h3 className="font-extrabold text-[14px] leading-snug line-clamp-2 text-black dark:text-white mb-1.5" dir="auto">
          {stripEmojis(listing.title)}
        </h3>
        <div className="mb-2">
          <RequiredSpecsRow categorySlug={listing.categorySlug} subcategorySlug={listing.subcategorySlug} attributes={listing.attributes ?? []} isArabic={isArabic} />
        </div>
        <CardContactActions listing={listing} isArabic={isArabic} />
      </div>
    </div>
  );
};
