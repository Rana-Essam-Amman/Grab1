import { useUI } from '@/hooks/useUI';
import React, { useMemo, useCallback } from 'react';
import { Listing } from '@/types';
import { BookmarkHeartButton } from './BookmarkHeartButton';
import { Location, Eye } from 'iconsax-react';
import { getSanitizedRegionalLocation } from '@/data/locations';
import { getSanitizedCurrency } from '@/data/countries';
import { Badge } from '@/shared/ui/Badge';
import { ListingCardHorizontal } from './ListingCardHorizontal';

interface ListingCardProps {
  listing: Listing;
  layout?: 'grid' | 'horizontal';
}

function ListingCardComponent({ listing, layout = 'grid' }: ListingCardProps) {
  const { setSelectedListingId, navigateTo, isArabic } = useUI();

  const sanitizedLoc = useMemo(
    () =>
      getSanitizedRegionalLocation(
        listing.countryCode,
        listing.city,
        listing.neighborhood,
        isArabic ? 'ar' : 'en'
      ),
    [listing.countryCode, listing.city, listing.neighborhood, isArabic]
  );

  const displayCurrency = useMemo(
    () => getSanitizedCurrency(listing.countryCode, listing.currency),
    [listing.countryCode, listing.currency]
  );

  const locationText = useMemo(
    () =>
      sanitizedLoc.neighborhood
        ? `${sanitizedLoc.neighborhood}, ${sanitizedLoc.city}`
        : sanitizedLoc.city,
    [sanitizedLoc]
  );

  const handleClick = useCallback(() => {
    setSelectedListingId(listing.id);
    navigateTo('listing-detail');
  }, [listing.id, setSelectedListingId, navigateTo]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23E5E7EB"/><text x="50" y="55" font-size="12" text-anchor="middle" fill="%234B5563">Catch</text></svg>';
  }, []);

  const premiumClasses = listing.isPremium
    ? 'border-primary/40 bg-primary/5 shadow-sm relative overflow-hidden'
    : 'border-border bg-surface';

  if (layout === 'horizontal') {
    return (
      <ListingCardHorizontal
        listing={listing}
        isArabic={isArabic}
        locationText={locationText}
        displayCurrency={displayCurrency}
        premiumClasses={premiumClasses}
        handleClick={handleClick}
        handleImageError={handleImageError}
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`${premiumClasses} rounded-2xl overflow-hidden border flex flex-col cursor-pointer hover:border-primary/60 transition-all shadow-xs group`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="w-full aspect-4/3 bg-background relative overflow-hidden">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          onError={handleImageError}
        />
        {listing.isPremium && (
          <div className="absolute top-2 end-2 z-10">
            <Badge variant="warning" size="sm">
              {isArabic ? 'مُميز ✨' : 'Featured ✨'}
            </Badge>
          </div>
        )}
        <div className={`absolute top-2 ${listing.isPremium ? 'end-16' : 'end-2'}`}>
          <BookmarkHeartButton listingId={listing.id} size="md" />
        </div>
      </div>
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <div className="text-[15px] font-bold text-ink line-clamp-1" dir="auto">{listing.title}</div>
          <div className="flex items-center gap-1 text-xs text-ink-soft font-medium mt-1">
            <Location variant="Bold" size={12} color="#94A3B8" className="shrink-0" />
            <span className="truncate" dir="auto">{locationText}</span>
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-3 pt-2 border-t border-border">
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
}

export const ListingCard = React.memo(ListingCardComponent);
