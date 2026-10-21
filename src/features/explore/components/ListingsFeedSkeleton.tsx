import React from 'react';
import { Skeleton } from '@/shared/ui/Skeleton';

interface ListingsFeedSkeletonProps {
  layout: 'list' | 'grid';
  count?: number;
}

function GridCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-2 bg-surface rounded-xl border border-border">
      <Skeleton variant="rect" className="w-full aspect-square" />
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
      <Skeleton variant="text" className="w-2/3" />
    </div>
  );
}

function ListCardSkeleton() {
  return (
    <div className="flex gap-3 p-3 bg-surface rounded-xl border border-border">
      <Skeleton variant="rect" className="w-24 h-24 shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
        <Skeleton variant="text" className="w-2/3" />
      </div>
    </div>
  );
}

export const ListingsFeedSkeleton: React.FC<ListingsFeedSkeletonProps> = ({ layout, count = 6 }) => {
  const items = Array.from({ length: count }, (_, i) => i);
  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-3.5">
        {items.map((i) => <GridCardSkeleton key={i} />)}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3.5">
      {items.map((i) => <ListCardSkeleton key={i} />)}
    </div>
  );
};
