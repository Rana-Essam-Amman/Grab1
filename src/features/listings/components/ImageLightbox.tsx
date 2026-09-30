import React, { useEffect } from 'react';
import { CloseCircle, Call, Whatsapp, MessageText } from 'iconsax-react';
import { useImageSwipe } from '../hooks/useImageSwipe';
export interface ImageLightboxProps {
  images: string[];
  activeIdx: number;
  onChangeIdx: (idx: number) => void;
  onClose: () => void;
  isArabic: boolean;
  readonly onCall?: () => void;
  readonly onWhatsApp?: () => void;
  readonly onStartChat?: () => void;
}
const IMG_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  userSelect: 'none',
  pointerEvents: 'none',
};
const BTN = 'rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white';
export const ImageLightbox: React.FC<ImageLightboxProps> = React.memo(({
  images, activeIdx, onChangeIdx, onClose, isArabic,
  onCall, onWhatsApp, onStartChat,
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
  const hasActions = Boolean(onCall || onWhatsApp || onStartChat);
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-[200] bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={onClose}
      dir={isArabic ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
    >
      <img src={images[activeIdx]} alt="" draggable={false} style={IMG_STYLE} />
      <button type="button" onClick={onClose} aria-label={isArabic ? 'إغلاق' : 'Close'}
        style={{ position: 'absolute', top: 16, right: 16, zIndex: 20 }}
        className={`${BTN} w-11 h-11`}>
        <CloseCircle size={24} variant="Bold" color="#FFFFFF" />
      </button>

      {images.length > 1 && (
        <>
          <button type="button" aria-label={isArabic ? 'السابق' : 'Previous'}
            onClick={(e) => { stop(e); goPrev(); }}
            style={{ position: 'absolute', top: '50%', left: 12, transform: 'translateY(-50%)', zIndex: 20 }}
            className={`${BTN} w-11 h-11 text-2xl font-bold`}>‹</button>
          <button type="button" aria-label={isArabic ? 'التالي' : 'Next'}
            onClick={(e) => { stop(e); goNext(); }}
            style={{ position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)', zIndex: 20 }}
            className={`${BTN} w-11 h-11 text-2xl font-bold`}>›</button>
          <div dir="ltr"
            style={{ position: 'absolute', top: 20, left: 20, zIndex: 20 }}
            className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
            {activeIdx + 1} / {images.length}
          </div>
        </>
      )}
      {hasActions && (
        <div onClick={stop}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 }}
          className="flex items-center gap-2 px-4 py-3 bg-black/60 backdrop-blur-md">
          {onWhatsApp && (
            <button type="button" onClick={onWhatsApp}
              className="flex-1 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center gap-2 font-bold text-sm">
              <Whatsapp size={20} variant="Bold" color="#FFFFFF" />
              <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
            </button>
          )}
          {onStartChat && (
            <button type="button" onClick={onStartChat}
              className="flex-1 h-12 rounded-xl bg-white/15 text-white flex items-center justify-center gap-2 font-bold text-sm border border-white/20">
              <MessageText size={20} variant="Bold" color="#FFFFFF" />
              <span>{isArabic ? 'دردشة' : 'Chat'}</span>
            </button>
          )}
          {onCall && (
            <button type="button" onClick={onCall}
              className="flex-1 h-12 rounded-xl bg-[#E57E25] text-white flex items-center justify-center gap-2 font-bold text-sm">
              <Call size={20} variant="Bold" color="#FFFFFF" />
              <span>{isArabic ? 'اتصال' : 'Call'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
});

ImageLightbox.displayName = 'ImageLightbox';
