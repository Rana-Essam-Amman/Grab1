import React, { useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import { Avatar } from '@/shared/ui/Avatar';

interface ListingCardSellerRowProps {
  readonly sellerName: string;
  readonly sellerKey: string;
}

/**
 * Seller row rendered inside the card body (not over the image).
 *
 * Shows a small avatar + the seller's name. Clicking navigates to
 * seller-profile with the seller's phone (preferred, unique per listing)
 * or userId (fallback). stopPropagation keeps the card onClick isolated.
 */
export const ListingCardSellerRow: React.FC<ListingCardSellerRowProps> = ({
  sellerName,
  sellerKey,
}) => {
  const { setSelectedSellerPhone, navigateTo } = useUI();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!sellerKey) return;
      setSelectedSellerPhone(sellerKey);
      navigateTo('seller-profile');
    },
    [sellerKey, setSelectedSellerPhone, navigateTo],
  );

  if (!sellerName || !sellerKey) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      data-testid="listing-card-seller"
      aria-label={sellerName}
      className="flex items-center gap-1.5 min-w-0 max-w-full cursor-pointer group/seller"
    >
      <Avatar
        fallback={sellerName.charAt(0).toUpperCase()}
        size="xs"
        className="border border-brand/40 bg-brand/10 text-brand shrink-0"
      />
      <span
        className="text-xs font-bold text-ink truncate group-hover/seller:text-brand group-hover/seller:underline"
        dir="auto"
      >
        {sellerName}
      </span>
    </button>
  );
};
