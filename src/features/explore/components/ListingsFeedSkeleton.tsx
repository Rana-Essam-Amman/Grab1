import React from 'react';
import { Skeleton } from '@/shared/ui/Skeleton';

interface ListingsFeedSkeletonProps {
  layout: 'list' | 'grid';
  count?: number;
}

/**
 * Mirrors ListingCardHorizontal.tsx structure:
 *  - Header:  p-3 pb-2, avatar w-8 h-8 + seller name + location + bookmark
 *  - Image:   full-width aspect-[4/3] collage
 *  - Body:    p-3, price (text-[18px]) + title (2 lines) + specs + actions
 * Outer card: rounded-2xl shadow-md border border-border overflow-hidden
 */
function ListCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl shadow-md border border-border flex flex-col overflow-hidden">
      {/* Header — mirrors p-3 pb-2 row */}
      <div className="flex items-center justify-between gap-2 p-3 pb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Skeleton variant="circle" className="w-8 h-8 shrink-0" />
          <Skeleton variant="text" className="w-24 h-3.5" />
          <Skeleton variant="text" className="w-20 h-3 ms-1" />
        </div>
        <Skeleton variant="circle" className="w-6 h-6 shrink-0" />
      </div>

      {/* Image — mirrors aspect-[4/3] full-width collage */}
      <Skeleton variant="rect" className="w-full aspect-[4/3] rounded-none" />

      {/* Body — mirrors p-3 block */}
      <div className="p-3 flex flex-col gap-2">
        <Skeleton variant="text" className="w-1/3 h-5" />
        <Skeleton variant="text" className="w-3/4 h-4" />
        <Skeleton variant="text" className="w-1/2 h-3" />
        <Skeleton variant="rect" className="w-full h-9 mt-1 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Mirrors grid ListingCard: full-bleed aspect-square image + body block.
 * NOTE: grid body padding is best-effort — verify visually after deploy.
 */
function GridCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl shadow-md border border-border flex flex-col overflow-hidden">
      <Skeleton variant="rect" className="w-full aspect-square rounded-none" />
      <div className="p-2.5 flex flex-col gap-1.5">
        <Skeleton variant="text" className="w-2/3 h-4" />
        <Skeleton variant="text" className="w-1/2 h-3" />
        <Skeleton variant="text" className="w-3/4 h-3" />
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
