import React, { useState, useEffect } from 'react';
import { Crown } from 'iconsax-react';
import { Badge } from '@/shared/ui/Badge';
import { BookmarkHeartButton } from '@/shared/components/BookmarkHeartButton';
import { ImageLightbox } from './ImageLightbox';
import { ListingImageNav } from './ListingImageNav';
import { useImageSwipe } from '../hooks/useImageSwipe';
import { toOptimizedImageUrl } from '@/shared/lib/optimizedImage';
import { getClampedRatio, DEFAULT_RATIO } from '../helpers/imageRatioHelper';
import { ListingImageFallback } from './ListingImageFallback';

export interface ListingImageSliderProps {
  readonly images: string[];
  readonly title?: string;
  readonly isPremium?: boolean;
  readonly listingId?: string;
  readonly isArabic: boolean;
  readonly activeIdx: number;
  readonly onChangeIdx: (idx: number) => void;
  readonly onCall?: () => void;
  readonly onWhatsApp?: () => void;
  readonly onStartChat?: () => void;
}

export const ListingImageSlider: React.FC<ListingImageSliderProps> = React.memo(({
  images, title, isPremium, listingId, isArabic, activeIdx, onChangeIdx, onCall, onWhatsApp, onStartChat,
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [ratio, setRatio] = useState<number>(DEFAULT_RATIO);
  const [imgError, setImgError] = useState(false);
  const { goNext, goPrev, handleTouchStart, handleTouchEnd } = useImageSwipe({ images, activeIdx, onChangeIdx });

  useEffect(() => {
    setImgError(false);
  }, [activeIdx, images[activeIdx]]);

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full aspect-[4/3] bg-muted flex items-center justify-center text-muted-foreground">
        <ListingImageFallback isArabic={isArabic} messageAr="لا توجد صور" messageEn="No images" />
      </div>
    );
  }

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setRatio(getClampedRatio(img.naturalWidth, img.naturalHeight));
  };

  return (
    <>
      <div
        className="relative w-full bg-black overflow-hidden select-none touch-pan-y transition-[aspect-ratio] duration-300"
        style={{ aspectRatio: `${ratio}` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {imgError ? (
          <ListingImageFallback isArabic={isArabic} messageAr="تعذر تحميل الصورة" messageEn="Failed to load image" />
        ) : (
          <img
            key={images[activeIdx]}
            src={toOptimizedImageUrl(images[activeIdx], { width: 1200, quality: 82 })}
            alt={`${title || 'Listing'} - ${activeIdx + 1}`}
            onLoad={handleLoad}
            onError={() => setImgError(true)}
            loading={activeIdx === 0 ? 'eager' : 'lazy'}
            decoding="async"
            {...(activeIdx === 0 ? { fetchPriority: 'high' as const } : {})}
            className="w-full h-full object-cover object-center cursor-zoom-in"
            onClick={() => setIsLightboxOpen(true)}
          />
        )}
        {isPremium && (
          <div className="absolute top-3 start-3 z-20">
            <Badge variant="warning" size="md" className="flex items-center gap-1 shadow-sm">
              <span>{isArabic ? 'مُميز' : 'Featured'}</span>
              <Crown size={14} variant="Bold" color="#E57E25" />
            </Badge>
          </div>
        )}
        {listingId && (
          <div className="absolute top-3 end-3 z-20">
            <BookmarkHeartButton listingId={listingId} size="lg" />
          </div>
        )}
        <ListingImageNav
          count={images.length}
          activeIdx={activeIdx}
          isArabic={isArabic}
          onPrev={goPrev}
          onNext={goNext}
          onSelect={onChangeIdx}
        />
      </div>

      {isLightboxOpen && (
        <ImageLightbox
          images={images}
          activeIdx={activeIdx}
          onChangeIdx={onChangeIdx}
          onClose={() => setIsLightboxOpen(false)}
          isArabic={isArabic}
          onCall={onCall}
          onWhatsApp={onWhatsApp}
          onStartChat={onStartChat}
        />
      )}
    </>
  );
});

ListingImageSlider.displayName = 'ListingImageSlider';
