import React from 'react';
import { Crown } from 'iconsax-react';
import { Badge } from '@/shared/ui/Badge';
import { BookmarkHeartButton } from './BookmarkHeartButton';

export interface ListingCardImageProps {
  readonly imageUrl: string;
  readonly title: string;
  readonly isPremium?: boolean;
  readonly listingId: string;
  readonly isArabic: boolean;
  readonly onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const ListingCardImage: React.FC<ListingCardImageProps> = ({
  imageUrl, title, isPremium, listingId, isArabic, onImageError,
}) => (
  <div className="w-full aspect-4/3 bg-background relative overflow-hidden">
    <img
      src={imageUrl}
      alt={title}
      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
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
