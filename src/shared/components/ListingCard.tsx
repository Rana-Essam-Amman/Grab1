import { useUI } from '@/hooks/useUI';
import React, { useMemo, useCallback } from 'react';
import { Listing } from '@/types';
import { Icon } from '@iconify/react';
import { getSanitizedRegionalLocation } from '@/data/locations';
import { getListingFields } from '@/data/listingFields';
import { ListingCardImage } from './ListingCardImage';
import { ListingCardHorizontal } from './ListingCardHorizontal';
import { ListingCardSellerRow } from '@/features/listings/components/ListingCardSellerRow';
import { RequiredSpecsRow } from '@/features/listings/components/RequiredSpecsRow';
import { TagChips } from '@/features/listings/components/TagChips';
import { pickSpecs } from '@/features/listings';
import { ListingSpecsRow } from './ListingSpecsRow';
import { formatPrice } from '@/shared/lib/formatPrice';
import { formatRelativeDate } from '@/shared/lib/formatDate';

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

  const conditionVal = useMemo(() => {
    const c = listing.attributes?.find((a) => a.key === 'condition' || a.key === 'حالة' || a.label === 'الحالة' || a.label === 'Condition');
    return c?.value || null;
  }, [listing.attributes]);

  const locationText = useMemo(() => (sanitizedLoc.neighborhood ? `${sanitizedLoc.neighborhood}, ${sanitizedLoc.city}` : sanitizedLoc.city), [sanitizedLoc]);

  const requiredKeys = useMemo(() => {
    const fields = getListingFields(listing.categorySlug, listing.subcategorySlug);
    return new Set(fields.filter((f) => f.required).map((f) => f.key));
  }, [listing.categorySlug, listing.subcategorySlug]);

  const specs = useMemo(() => pickSpecs(listing.attributes?.filter((a) => !requiredKeys.has(a.key)), 5, listing.title), [listing.attributes, listing.title, requiredKeys]);
  const sellerKey = useMemo(() => listing.sellerPhone || listing.userId || '', [listing.sellerPhone, listing.userId]);

  const isVerifiedSeller = useMemo(() => {
    const itemObj = listing as unknown as Record<string, unknown>;
    return Boolean(itemObj.sellerVerified || itemObj.isVerified || listing.isDemo);
  }, [listing]);

  const handleClick = useCallback(() => {
    setSelectedListingId(listing.id);
    navigateTo('listing-detail');
  }, [listing.id, setSelectedListingId, navigateTo]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); }
  }, [handleClick]);

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
      onKeyDown={handleKeyDown}
      className={`${premiumClasses} rounded-2xl overflow-hidden border flex flex-col cursor-pointer hover:border-primary/60 transition-all shadow-xs group active:scale-[0.98]`}
      dir={isArabic ? 'rtl' : 'ltr'}
      data-testid="listing-card"
    >
      <ListingCardImage imageUrl={listing.imageUrl} title={listing.title} isPremium={listing.isPremium} listingId={listing.id} isArabic={isArabic} onImageError={handleImageError} />
      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-1">
          <div className="text-[15px] font-bold text-ink line-clamp-2" dir="auto">{listing.title}</div>
          {conditionVal && <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">{conditionVal}</span>}
        </div>
        <div className="flex items-center justify-between gap-1 text-xs text-ink-soft font-medium mt-1 mb-2">
          <div className="flex items-center gap-1 truncate">
            <Icon icon="noto:round-pushpin" width={12} height={12} className="shrink-0" />
            <span className="truncate" dir="auto">{locationText}</span>
          </div>
          {relativeDate && (
            <div className="flex items-center gap-1 shrink-0 text-[11px] text-ink-muted">
              <Icon icon="lucide:clock" width={11} height={11} className="shrink-0" />
              <span>{relativeDate}</span>
            </div>
          )}
        </div>
        <RequiredSpecsRow categorySlug={listing.categorySlug} subcategorySlug={listing.subcategorySlug} attributes={listing.attributes ?? []} isArabic={isArabic} />
        <TagChips listing={listing} isArabic={isArabic} compact />
        {specs.length > 0 && <ListingSpecsRow specs={specs} compact />}
        <div className="flex items-center mt-3 pt-2 border-t border-border gap-1.5">
          <div className="price-tag text-base font-bold text-danger shrink-0">
            <span>{formattedPrice || (isArabic ? 'السعر غير محدد' : 'Price not specified')}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-3 py-2 bg-canvas flex items-center justify-between">
        <ListingCardSellerRow sellerName={listing.sellerName} sellerKey={sellerKey} />
        {isVerifiedSeller && (
          <div className="flex items-center gap-1 text-[11px] text-primary font-bold shrink-0">
            <Icon icon="ic:round-verified" width={14} height={14} className="text-primary shrink-0" />
            <span>{isArabic ? 'موثوق' : 'Verified'}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export const ListingCard = React.memo(ListingCardComponent);
