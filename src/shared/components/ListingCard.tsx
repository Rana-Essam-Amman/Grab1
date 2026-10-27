import { useUI } from '@/hooks/useUI';
import React, { useMemo, useCallback } from 'react';
import { Listing } from '@/types';
import { Icon } from '@iconify/react';
import { getSanitizedRegionalLocation } from '@/data/locations';
import { ListingCardImage } from './ListingCardImage';
import { ListingCardHorizontal } from './ListingCardHorizontal';
import { RequiredSpecsRow } from '@/features/listings/components/RequiredSpecsRow';
import { formatPrice } from '@/shared/lib/formatPrice';
import { formatRelativeDate } from '@/shared/lib/formatDate';
import { stripEmojis } from '@/shared/lib/stripEmojis';
import { CardContactActions } from './CardContactActions';

interface ListingCardProps {
  listing: Listing;
  layout?: 'grid' | 'horizontal';
}

function ListingCardComponent({ listing, layout = 'grid' }: ListingCardProps) {
  const { setSelectedListingId, navigateTo, isArabic } = useUI();

  const sanitizedLoc = useMemo(
    () => getSanitizedRegionalLocation(listing.countryCode, listing.city, listing.neighborhood, isArabic ? 'ar' : 'en', { allowUnknown: true }),
    [listing.countryCode, listing.city, listing.neighborhood, isArabic]
  );

  const formattedPrice = useMemo(() => formatPrice(listing.price, listing.currency, isArabic), [listing.price, listing.currency, isArabic]);
  const relativeDate = useMemo(() => formatRelativeDate(listing.createdAt, isArabic), [listing.createdAt, isArabic]);

  const locationText = useMemo(() => (sanitizedLoc.neighborhood ? `${sanitizedLoc.neighborhood}, ${sanitizedLoc.city}` : sanitizedLoc.city), [sanitizedLoc]);

  const sellerKey = useMemo(() => listing.userId || listing.sellerPhone || '', [listing.sellerPhone, listing.userId]);

  const handleClick = useCallback(() => {
    setSelectedListingId(listing.id);
    navigateTo('listing-detail');
  }, [listing.id, setSelectedListingId, navigateTo]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23E5E7EB"/><path d="M35 65 L50 45 L65 65 Z" fill="%239CA3AF"/><circle cx="65" cy="35" r="6" fill="%239CA3AF"/></svg>';
  }, []);

  const premiumClasses = listing.isPremium ? 'border-primary/40 bg-primary/5 shadow-sm relative overflow-hidden' : 'border-border bg-surface';

  if (layout === 'horizontal') {
    return <ListingCardHorizontal listing={listing} isArabic={isArabic} locationText={locationText} displayCurrency={listing.currency || ''} premiumClasses={premiumClasses} sellerKey={sellerKey} handleClick={handleClick} handleImageError={handleImageError} />;
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      className={`${premiumClasses} rounded-2xl overflow-hidden border flex flex-col cursor-pointer hover:border-primary/60 transition-all shadow-md group active:scale-[0.98]`}
      dir={isArabic ? 'rtl' : 'ltr'}
      data-testid="listing-card"
    >
      <ListingCardImage imageUrl={listing.imageUrl} title={listing.title} isPremium={listing.isPremium} listingId={listing.id} isArabic={isArabic} onImageError={handleImageError} />
      
      <div className="p-3 flex flex-col flex-1">
        <div className="text-[18px] font-extrabold text-danger mb-1">
          {formattedPrice || (isArabic ? 'السعر غير محدد' : 'Price not specified')}
        </div>

        <div className="text-[15px] font-bold text-ink leading-tight line-clamp-2 mb-1.5" dir="auto">
          {stripEmojis(listing.title)}
        </div>
        
        <div className="flex items-center gap-1 text-[11px] text-ink-soft font-medium mb-2">
          <Icon icon="noto:round-pushpin" width={12} height={12} className="shrink-0" />
          <span className="truncate" dir="auto">{locationText}</span>
        </div>

        <RequiredSpecsRow categorySlug={listing.categorySlug} subcategorySlug={listing.subcategorySlug} attributes={listing.attributes ?? []} isArabic={isArabic} />
        
        <CardContactActions listing={listing} isArabic={isArabic} />
      </div>
    </div>
  );
}

export const ListingCard = React.memo(ListingCardComponent);
