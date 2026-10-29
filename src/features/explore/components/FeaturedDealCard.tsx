import React from 'react';
import type { Listing } from '@/types';
import { MagicStar } from 'iconsax-react';
import { Icon } from '@iconify/react';
import { toOptimizedImageUrl } from '@/shared/lib/optimizedImage';
import { formatPrice } from '@/shared/lib/formatPrice';
import { stripEmojis } from '@/shared/lib/stripEmojis';

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
  const cleanTitle = stripEmojis(listing.title);

  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl overflow-hidden bg-brand text-white shadow-lg hover:shadow-xl transition-all group active:scale-[0.99] text-end relative"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="relative h-64 w-full">
        <img
          src={toOptimizedImageUrl(listing.images?.[0] || listing.imageUrl || '', { width: 880, quality: 80 })}
          alt={cleanTitle}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="256"><rect width="400" height="256" fill="%23E5E7EB"/></svg>';
          }}
        />
        {/* Stronger gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* Featured Badge */}
        <div className="absolute top-4 start-4 px-3 py-1.5 rounded-full bg-accent text-ink-inverse text-xs font-bold flex items-center gap-1.5 shadow-md">
          <MagicStar size={14} variant="Bold" color="#E57E25" />
          <span>{isArabic ? 'صفقة مميزة' : 'Featured'}</span>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
          <h3 className="text-white font-bold text-lg leading-snug line-clamp-2 drop-shadow-md">
            {cleanTitle}
          </h3>
          
          <div className="flex items-end justify-between gap-2 mt-1">
            <p className="text-white/90 text-[13px] font-medium flex items-center gap-1 drop-shadow-sm mb-1">
              <Icon icon="noto:round-pushpin" width={14} height={14} className="shrink-0" />
              <span className="truncate">{listing.city || (isArabic ? 'موقع غير محدد' : 'Location')}</span>
            </p>
            
            <p className="text-white font-black text-2xl drop-shadow-md shrink-0">
              {formatPrice(listing.price, listing.currency, isArabic)}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
};
