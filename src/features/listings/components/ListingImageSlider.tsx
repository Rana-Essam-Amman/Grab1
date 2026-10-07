import React, { useState } from 'react';
import { ArrowLeft2, ArrowRight2, Crown } from 'iconsax-react';
import { Badge } from '@/shared/ui/Badge';
import { BookmarkHeartButton } from '@/shared/components/BookmarkHeartButton';
import { ImageLightbox } from './ImageLightbox';
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

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label={isArabic ? 'الصورة السابقة' : 'Previous image'}
              onClick={goPrev}
              className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3' : 'left-3'} w-9 h-9 rounded-full bg-black/50 backdrop-blur-xs text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer z-20`}
            >
              {isArabic ? <ArrowRight2 size={20} /> : <ArrowLeft2 size={20} />}
            </button>
            <button
              type="button"
              aria-label={isArabic ? 'الصورة التالية' : 'Next image'}
              onClick={goNext}
              className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-3' : 'right-3'} w-9 h-9 rounded-full bg-black/50 backdrop-blur-xs text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer z-20`}
            >
              {isArabic ? <ArrowLeft2 size={20} /> : <ArrowRight2 size={20} />}
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 backdrop-blur-xs px-3 py-1 rounded-full z-20">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to image ${i + 1}`}
                  onClick={() => onChangeIdx(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${i === activeIdx ? 'w-5 bg-white' : 'w-2 bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
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
