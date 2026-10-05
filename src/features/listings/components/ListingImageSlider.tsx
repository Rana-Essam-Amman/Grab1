import React, { useState } from 'react';
import { useImageSwipe } from '../hooks/useImageSwipe';
import { ImageLightbox } from './ImageLightbox';

export interface ListingImageSliderProps {
  images: string[];
  activeIdx: number;
  onChangeIdx: (idx: number) => void;
  isArabic: boolean;
  readonly onCall?: () => void;
  readonly onWhatsApp?: () => void;
  readonly onStartChat?: () => void;
}

const FALLBACK_SRC =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23E5E7EB"/><text x="200" y="150" font-size="16" text-anchor="middle" fill="%234B5563">FOX</text></svg>';

const ARROW_BASE =
  'hidden md:flex absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-xs items-center justify-center text-white text-xl font-bold hover:bg-black/70 transition-colors cursor-pointer z-10';

export const ListingImageSlider: React.FC<ListingImageSliderProps> = React.memo(({
  images, activeIdx, onChangeIdx, isArabic,
  onCall, onWhatsApp, onStartChat,
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const { goNext, goPrev, handleTouchStart, handleTouchEnd } =
    useImageSwipe({ images, activeIdx, onChangeIdx });

  if (!images || images.length === 0) return null;
  const showControls = images.length > 1;

  return (
    <>
    <div
      className="relative w-full aspect-[4/3] bg-ink overflow-hidden select-none touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={images[activeIdx]}
        alt="Listing image"
        draggable={false}
        onClick={() => setIsLightboxOpen(true)}
        className="w-full h-full object-cover transition-all duration-300 cursor-zoom-in"
        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_SRC; }}
      />

      {showControls && (
        <>
          <button type="button" aria-label={isArabic ? 'السابق' : 'Previous'} onClick={goPrev} className={`${ARROW_BASE} start-2`}>‹</button>
          <button type="button" aria-label={isArabic ? 'التالي' : 'Next'} onClick={goNext} className={`${ARROW_BASE} end-2`}>›</button>

          <div className="absolute top-3 end-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 pointer-events-none" dir="ltr">
            {activeIdx + 1} / {images.length}
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 backdrop-blur-xs px-3 py-1 rounded-full">
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
