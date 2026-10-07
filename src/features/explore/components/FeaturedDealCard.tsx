import React from 'react';
import type { Listing } from '@/types';
import { MagicStar } from 'iconsax-react';
import { Icon } from '@iconify/react';
import { toOptimizedImageUrl } from '@/shared/lib/optimizedImage';

interface FeaturedDealCardProps {
  listing: Listing;
  isArabic: boolean;
  onClick: () => void;
}

export const FeaturedDealCard: React.FC<FeaturedDealCardProps> = ({
  listing,
  isArabic,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-3xl overflow-hidden bg-brand text-white shadow-lg hover:shadow-xl transition-shadow text-right"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="relative h-44 w-full">
        <img
          src={toOptimizedImageUrl(listing.images?.[0] || listing.imageUrl || '', { width: 880, quality: 78 })}
          alt={listing.title}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="176"><rect width="400" height="176" fill="%23E5E7EB"/></svg>';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-accent text-ink-inverse text-xs font-bold flex items-center gap-1 shadow-md">
          <MagicStar size={14} variant="Bold" color="#E57E25" />
          <span>{isArabic ? 'صفقة مميزة' : 'Featured'}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-base leading-tight line-clamp-2 mb-2">
            {listing.title}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-white/85 text-xs flex items-center gap-1">
              <Icon icon="noto:round-pushpin" width={14} height={14} />
              <span>{listing.city || (isArabic ? 'موقع' : 'Location')}</span>
            </p>
            <p className="text-accent font-bold text-lg">
              {listing.price}{' '}
              <span className="text-xs font-medium text-white/80">{listing.currency}</span>
            </p>
          </div>
        </div>
      </div>
    </button>
  );
};
