import React, { useEffect, useRef } from 'react';

interface FeedLoadMoreSentinelProps {
  readonly hasMore: boolean;
  readonly isLoadingMore: boolean;
  readonly onLoadMore: () => void;
}

/**
 * Invisible sentinel that triggers loadMore when scrolled into view.
 * Standard pattern: Airbnb / Facebook / Instagram.
 */
export const FeedLoadMoreSentinel: React.FC<FeedLoadMoreSentinelProps> = ({
  hasMore,
  isLoadingMore,
  onLoadMore,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!hasMore) return;
    if (isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) onLoadMore();
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore]);

  if (!hasMore) return null;

  return (
    <div ref={ref} className="w-full py-4 flex items-center justify-center">
      {isLoadingMore ? (
        <span className="text-xs text-ink-muted">جاري التحميل...</span>
      ) : null}
    </div>
  );
};
