import React, { useEffect } from 'react';
import { CloseCircle } from 'iconsax-react';
import { useImageSwipe } from '../hooks/useImageSwipe';

export interface ImageLightboxProps {
  images: string[];
  activeIdx: number;
  onChangeIdx: (idx: number) => void;
  onClose: () => void;
  isArabic: boolean;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = React.memo(({
  images, activeIdx, onChangeIdx, onClose, isArabic,
}) => {
  const { goNext, goPrev, handleTouchStart, handleTouchEnd } =
    useImageSwipe({ images, activeIdx, onChangeIdx });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [goNext, goPrev, onClose]);

  if (!images || images.length === 0) return null;

  const stop = (e: React.MouseEvent) => e.stopPropagation();
  const arrowBtn =
    'absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold hover:bg-white/25 transition-colors z-10';

  return (
    <div
      className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={onClose}
      dir={isArabic ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={isArabic ? 'إغلاق' : 'Close'}
        className="absolute top-4 end-4 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/25 transition-colors z-10"
      >
        <CloseCircle size={24} variant="Bold" color="#FFFFFF" />
      </button>

      <img
        src={images[activeIdx]}
        alt={`Image ${activeIdx + 1}`}
        className="max-w-full max-h-full object-contain select-none"
        draggable={false}
        onClick={stop}
      />

      {images.length > 1 && (
        <>
          <button type="button" onClick={(e) => { stop(e); goPrev(); }}
            aria-label={isArabic ? 'السابق' : 'Previous'}
            className={`${arrowBtn} start-3`}>‹</button>
          <button type="button" onClick={(e) => { stop(e); goNext(); }}
            aria-label={isArabic ? 'التالي' : 'Next'}
            className={`${arrowBtn} end-3`}>›</button>

          <div className="absolute top-5 start-5 bg-white/15 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full" dir="ltr">
            {activeIdx + 1} / {images.length}
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full" onClick={stop}>
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChangeIdx(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${i === activeIdx ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
});

ImageLightbox.displayName = 'ImageLightbox';
