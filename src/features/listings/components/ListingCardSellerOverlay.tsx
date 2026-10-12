import React, { useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import { Avatar } from '@/shared/ui/Avatar';

interface ListingCardSellerOverlayProps {
  readonly sellerName: string;
  readonly sellerKey: string;
}

/**
 * Avatar + seller name overlay rendered on top of a listing image.
 *
 * Positioned bottom-start of the image container. stopPropagation prevents
 * the parent card's onClick from firing — clicking the seller navigates to
 * the seller profile, not to the listing detail.
 */
export const ListingCardSellerOverlay: React.FC<ListingCardSellerOverlayProps> = ({
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
      className="absolute bottom-2 start-2 z-10 flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur-sm ps-0.5 pe-2.5 py-0.5 text-white text-xs font-bold max-w-[80%] hover:bg-black/70 active:scale-[0.97] transition-all cursor-pointer"
    >
      <Avatar
        fallback={sellerName.charAt(0).toUpperCase()}
        size="xs"
        className="border-none bg-white/90 text-ink"
      />
      <span className="truncate" dir="auto">{sellerName}</span>
    </button>
  );
};
