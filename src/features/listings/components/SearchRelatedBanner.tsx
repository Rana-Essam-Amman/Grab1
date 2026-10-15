import React from 'react';

interface SearchRelatedBannerProps {
  readonly banner: string | null;
  readonly relatedHeader: string | null;
}

export const SearchRelatedBanner: React.FC<SearchRelatedBannerProps> = ({
  banner,
  relatedHeader,
}) => {
  if (!banner && !relatedHeader) return null;

  return (
    <div className="px-4 pt-3" data-testid="search-related-banner">
      {banner && (
        <div className="text-sm font-bold text-ink" data-testid="search-related-empty">
          {banner}
        </div>
      )}
      {relatedHeader && (
        <div className="mt-1 text-xs text-ink-muted" data-testid="search-related-header">
          {relatedHeader}
        </div>
      )}
    </div>
  );
};
