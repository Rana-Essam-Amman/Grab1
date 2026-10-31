import React from 'react';
import { Skeleton } from '@/shared/ui/Skeleton';

interface ListingsFeedSkeletonProps {
  layout: 'list' | 'grid';
  count?: number;
}

/**
 * Mirrors ListingCardHorizontal.tsx (non-premium).
 * Verified against:
 *  - ListingCardHorizontal.tsx:46-96
 *  - CardContactActions.tsx:89-108
 *  - BookmarkHeartButton.tsx:37-38
 */
function ListCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl shadow-md flex flex-col overflow-hidden">
      {/* Header — p-3 pb-2 */}
      <div className="flex items-center justify-between gap-2 p-3 pb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Skeleton variant="circle" className="w-8 h-8 shrink-0" />
          <Skeleton variant="text" className="w-24 h-3.5" />
          <Skeleton variant="text" className="w-20 h-3 ms-1" />
        </div>
        <Skeleton variant="circle" className="w-[30px] h-[30px] shrink-0" />
      </div>

      {/* Image — aspect-[4/3] full-width collage */}
      <Skeleton variant="rect" className="w-full aspect-[4/3] rounded-none" />

      {/* Body — p-3 */}
      <div className="p-3 flex flex-col gap-2">
        <Skeleton variant="text" className="w-1/3 h-5" />
        <Skeleton variant="text" className="w-3/4 h-4" />
        <Skeleton variant="text" className="w-1/2 h-4" />
        <Skeleton variant="text" className="w-1/2 h-3" />

        {/* Actions — mirrors CardContactActions wrapper:
            mt-1 + pt-2 + pb-3 + border-b around 44px buttons = 69px total */}
        <div className="mt-1 pt-2 pb-3 border-b border-border">
          <Skeleton variant="rect" className="w-full h-[44px] rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/**
 * Mirrors grid ListingCard.tsx:44-78 (non-premium).
 */
function GridCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl shadow-md flex flex-col overflow-hidden">
      <Skeleton variant="rect" className="w-full aspect-square rounded-none" />

      <div className="p-3 flex flex-col gap-1.5">
        <Skeleton variant="text" className="w-1/3 h-4" />
        <Skeleton variant="text" className="w-3/4 h-3.5" />
        <Skeleton variant="text" className="w-1/2 h-3.5" />
        <Skeleton variant="text" className="w-1/2 h-3" />
        <Skeleton variant="text" className="w-2/3 h-3" />

        {/* Actions — mirrors CardContactActions wrapper */}
        <div className="mt-1 pt-2 pb-3 border-b border-border">
          <Skeleton variant="rect" className="w-full h-[44px] rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export const ListingsFeedSkeleton: React.FC<ListingsFeedSkeletonProps> = ({
  layout,
  count = 6,
}) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-5">
        {items.map((i) => <GridCardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {items.map((i) => <ListCardSkeleton key={i} />)}
    </div>
  );
};
