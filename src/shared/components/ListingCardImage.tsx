import React from 'react';
import { Crown } from 'iconsax-react';
import { Badge } from '@/shared/ui/Badge';
import { BookmarkHeartButton } from './BookmarkHeartButton';
import { toOptimizedImageUrl } from '@/shared/lib/optimizedImage';

const buildSrc = (src: string): string =>
  toOptimizedImageUrl(src, { width: 800, quality: 75 });

const buildSrcSet = (src: string): string =>
  [
    `${toOptimizedImageUrl(src, { width: 400, quality: 75 })} 400w`,
    `${toOptimizedImageUrl(src, { width: 800, quality: 75 })} 800w`,
    `${toOptimizedImageUrl(src, { width: 1200, quality: 75 })} 1200w`,
  ].join(', ');

const IMG_SIZES = '(max-width: 440px) 50vw, 220px';

export interface ListingCardImageProps {
  readonly imageUrl: string;
  readonly title: string;
  readonly isPremium?: boolean;
  readonly listingId: string;
  readonly isArabic: boolean;
  // Kept for caller compatibility; overlay lives in the card body now.
  readonly sellerName?: string;
  readonly sellerKey?: string;
  readonly onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  readonly priority?: boolean;
}

export const ListingCardImage: React.FC<ListingCardImageProps> = ({
  imageUrl, title, isPremium, listingId, isArabic, onImageError, priority = false,
}) => (
  <div className="w-full aspect-square bg-background relative overflow-hidden">
    <img
      src={buildSrc(imageUrl)}
      srcSet={buildSrcSet(imageUrl)}
      sizes={IMG_SIZES}
      alt={title}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className="w-full h-full object-cover object-center transition-transform duration-300"
      onError={onImageError}
    />
    {isPremium && (
      <div className="absolute top-2 end-2 z-10">
        <Badge variant="warning" size="sm" className="flex items-center gap-1">
          <span>{isArabic ? 'مُميز' : 'Featured'}</span>
          <Crown size={12} variant="Bold" color="#E57E25" />
        </Badge>
      </div>
    )}
    <div className={isPremium ? 'absolute top-2 end-16' : 'absolute top-2 end-2'}>
      <BookmarkHeartButton listingId={listingId} size="md" />
    </div>
  </div>
);
