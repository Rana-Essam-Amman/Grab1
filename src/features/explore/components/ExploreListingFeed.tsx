import React, { useRef, useMemo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useUI } from '@/hooks/useUI';
import { Listing } from '@/types';
import { ListingCard } from '@/shared/components';
import { ExploreEmptyFeedState } from './ExploreEmptyFeedState';
import { FeedLoadMoreSentinel } from './FeedLoadMoreSentinel';

interface ExploreListingFeedProps {
  listings: Listing[];
  feedLayout: 'list' | 'grid';
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
  readonly activeSearchText?: string;
  readonly onPostWithSearch?: () => void;
  readonly onExpandSearch?: () => void;
  readonly hasMore?: boolean;
  readonly isLoadingMore?: boolean;
  readonly onLoadMore?: () => void;
}

export const ExploreListingFeed: React.FC<ExploreListingFeedProps> = ({
  listings, feedLayout, hasActiveFilters = false, onResetFilters = () => {},
  activeSearchText, onPostWithSearch, onExpandSearch,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore = () => {},
}) => {
  const { isArabic } = useUI();
  const parentRef = useRef<HTMLDivElement | null>(null);
  const isVirtualized = listings.length >= 100;

  const rowCount = useMemo(() => (feedLayout === 'grid' ? Math.ceil(listings.length / 2) : listings.length), [listings.length, feedLayout]);
  const estimatedRowHeight = useMemo(() => (feedLayout === 'grid' ? 290 : 130), [feedLayout]);

  const getScrollElement = useCallback(() => parentRef.current, []);
  const estimateSize = useCallback(() => estimatedRowHeight, [estimatedRowHeight]);

  const rowVirtualizer = useVirtualizer({
    count: rowCount, getScrollElement, estimateSize, overscan: 4, enabled: isVirtualized,
  });

  if (listings.length === 0) {
    return (
      <ExploreEmptyFeedState
        isArabic={isArabic}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={onResetFilters}
        activeSearchText={activeSearchText}
        onPostWithSearch={onPostWithSearch}
        onExpandSearch={onExpandSearch}
      />
    );
  }

  if (!isVirtualized) {
    return (
      <div className="flex flex-col gap-3.5">
        <div className={feedLayout === 'grid' ? 'grid grid-cols-2 gap-3.5' : 'flex flex-col gap-3.5'}>
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} layout={feedLayout === 'list' ? 'horizontal' : 'grid'} />
          ))}
        </div>
        <FeedLoadMoreSentinel hasMore={hasMore} isLoadingMore={isLoadingMore} onLoadMore={onLoadMore} />
      </div>
    );
  }

  return (
    <div ref={parentRef} dir={isArabic ? 'rtl' : 'ltr'} className="w-full max-h-[72vh] overflow-y-auto overflow-x-hidden scroll-smooth" style={{ contain: 'strict' }}>
      <div className="w-full relative" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        {rowVirtualizer.getVirtualItems().map((vRow) => {
          if (feedLayout === 'grid') {
            const item1 = listings[vRow.index * 2];
            const item2 = listings[vRow.index * 2 + 1];
            return (
              <div key={vRow.key} data-index={vRow.index} ref={rowVirtualizer.measureElement} className="absolute top-0 start-0 w-full grid grid-cols-2 gap-3.5 pb-3.5" style={{ transform: `translateY(${vRow.start}px)` }}>
                {item1 && <ListingCard key={item1.id} listing={item1} layout="grid" />}
                {item2 && <ListingCard key={item2.id} listing={item2} layout="grid" />}
              </div>
            );
          }
          const item = listings[vRow.index];
          return item ? (
            <div key={vRow.key} data-index={vRow.index} ref={rowVirtualizer.measureElement} className="absolute top-0 start-0 w-full pb-3.5" style={{ transform: `translateY(${vRow.start}px)` }}>
              <ListingCard key={item.id} listing={item} layout="horizontal" />
            </div>
          ) : null;
        })}
      </div>
      <FeedLoadMoreSentinel hasMore={hasMore} isLoadingMore={isLoadingMore} onLoadMore={onLoadMore} />
    </div>
  );
};
