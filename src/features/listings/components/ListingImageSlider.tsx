import React, { useState } from 'react';
import { Crown } from 'iconsax-react';
import { Badge } from '@/shared/ui/Badge';
import { BookmarkHeartButton } from '@/shared/components/BookmarkHeartButton';
import { ImageLightbox } from './ImageLightbox';
import { ListingImageNav } from './ListingImageNav';
import { useImageSwipe } from '../hooks/useImageSwipe';

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
  images,
  title,
  isPremium,
  listingId,
  isArabic,
  activeIdx,
  onChangeIdx,
  onCall,
  onWhatsApp,
  onStartChat,
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const { goNext, goPrev, handleTouchStart, handleTouchEnd } = useImageSwipe({ images, activeIdx, onChangeIdx });

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full aspect-[4/3] bg-muted flex items-center justify-center text-muted-foreground">
        {isArabic ? 'لا توجد صور' : 'No images'}
      </div>
    );
  }

  return (
    <>
      <div
        className="relative w-full aspect-[4/3] bg-black overflow-hidden select-none touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Blurred backdrop — same image, fills the frame, creates a full-bleed feel */}
        <img
          src={images[activeIdx]}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60 pointer-events-none"
        />

        {/* Main image — fully visible, no crop */}
        <img
          src={images[activeIdx]}
          alt={`${title || 'Listing'} - ${activeIdx + 1}`}
          className="relative w-full h-full object-contain z-10 transition-all duration-300 cursor-zoom-in"
          onClick={() => setIsLightboxOpen(true)}
        />

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
