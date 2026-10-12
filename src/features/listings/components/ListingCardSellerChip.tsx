import React, { useCallback } from 'react';
import { User } from 'iconsax-react';
import type { Listing } from '@/types';
import { useUI } from '@/hooks/useUI';

interface ListingCardSellerChipProps {
  readonly listing: Listing;
}

/**
 * Small clickable seller label rendered inside ListingCard.
 *
 * Uses userId when present (new listings) and sellerPhone otherwise
 * (legacy listings), matching the resolution order in useListingDetail.
 * stopPropagation prevents the parent card's onClick from firing — the
 * user navigates to the seller profile, not the listing detail.
 */
export const ListingCardSellerChip: React.FC<ListingCardSellerChipProps> = ({
  listing,
}) => {
  const { setSelectedSellerPhone, navigateTo } = useUI();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const key = listing.userId || listing.sellerPhone;
      if (!key) return;
      setSelectedSellerPhone(key);
      navigateTo('seller-profile');
    },
    [listing.userId, listing.sellerPhone, setSelectedSellerPhone, navigateTo],
  );

  if (!listing.sellerName) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      data-testid="listing-card-seller"
      className="flex items-center gap-1 text-xs text-brand font-bold mt-0.5 hover:underline cursor-pointer max-w-full min-w-0"
      aria-label={listing.sellerName}
    >
      <User size={12} variant="Linear" className="shrink-0" />
      <span className="truncate" dir="auto">{listing.sellerName}</span>
    </button>
  );
};
