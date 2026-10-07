import React from 'react';
import { Eye } from 'iconsax-react';
import type { Listing } from '@/types';
import { Icon } from '@iconify/react';
import { toOptimizedImageUrl } from '@/shared/lib/optimizedImage';

interface TrendingSectionProps {
  listings: Listing[];
  isArabic: boolean;
  onListingClick: (id: string) => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  listings,
  isArabic,
  onListingClick,
}) => {
  if (listings.length === 0) return null;

  return (
    <div className="flex flex-col gap-3" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-bold text-ink flex items-center gap-1.5">
          <Icon icon="fluent-emoji:chart-increasing" width={20} height={20} />
          {isArabic ? 'الأكثر رواجاً' : 'Trending Now'}
        </h2>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {listings.map((listing) => (
          <button
            key={listing.id}
            onClick={() => onListingClick(listing.id)}
            className="flex-shrink-0 w-40 rounded-2xl bg-surface border border-line shadow-sm hover:shadow-md transition-shadow overflow-hidden text-right"
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            <div className="relative h-28 w-full">
              <img
                src={toOptimizedImageUrl(listing.imageUrl, { width: 400, quality: 75 })}
                alt={listing.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="112"><rect width="160" height="112" fill="%23E5E7EB"/></svg>';
                }}
              />
            </div>
            <div className="p-2.5">
              <h3 className="text-xs font-semibold text-ink line-clamp-2 mb-1.5 min-h-[2rem]">
                {listing.title}
              </h3>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-accent font-bold text-sm">
                  {listing.price}
                </span>
                <span className="flex items-center gap-0.5 text-ink-muted">
                  <Eye variant="Bold" size={10} color="#94A3B8" />
                  {listing.views}
                </span>
              </div>
              <div className="flex items-center gap-0.5 text-ink-muted text-[10px] mt-1">
                <Icon icon="noto:round-pushpin" width={10} height={10} />
                <span className="truncate">{listing.city}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
