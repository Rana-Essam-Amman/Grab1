import { useUI } from '@/hooks/useUI';
import React, { useMemo, useCallback } from 'react';
import { Listing } from '@/types';
import { Icon } from '@iconify/react';
import { getSanitizedRegionalLocation } from '@/data/locations';
import { getSanitizedCurrency } from '@/data/countries';
import { ListingCardImage } from './ListingCardImage';
import { ListingCardHorizontal } from './ListingCardHorizontal';
import { pickSpecs } from '@/features/listings/helpers/pickSpecs';
import { ListingSpecsRow } from './ListingSpecsRow';

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

  const specs = useMemo(() => pickSpecs(listing.attributes, 3, listing.title), [listing.attributes, listing.title]);

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
      className={`${premiumClasses} rounded-2xl overflow-hidden border flex flex-col cursor-pointer hover:border-primary/60 transition-all shadow-xs group active:scale-[0.98]`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <ListingCardImage
        imageUrl={listing.imageUrl}
        title={listing.title}
        isPremium={listing.isPremium}
        listingId={listing.id}
        isArabic={isArabic}
        onImageError={handleImageError}
      />
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <div className="text-[15px] font-bold text-ink line-clamp-1" dir="auto">{listing.title}</div>
          <div className="flex items-center gap-1 text-xs text-ink-soft font-medium mt-1 mb-2">
            <Icon icon="noto:round-pushpin" width={12} height={12} className="shrink-0" />
            <span className="truncate" dir="auto">{locationText}</span>
          </div>
          {specs.length > 0 && <ListingSpecsRow specs={specs} compact />}
        </div>
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border gap-1.5">
          <div className="price-tag text-base shrink-0">
            <span dir="ltr">
              {listing.price} <span className="text-xs font-bold text-danger">{displayCurrency}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const ListingCard = React.memo(ListingCardComponent);
