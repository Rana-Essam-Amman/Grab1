import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
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

const IMG_STYLE: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', userSelect: 'none', pointerEvents: 'none' };
const BTN_STYLE: React.CSSProperties = { position: 'absolute', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', border: 'none', cursor: 'pointer' };

export const ImageLightbox: React.FC<ImageLightboxProps> = React.memo(({ images, activeIdx, onChangeIdx, onClose, isArabic, onCall, onWhatsApp, onStartChat }) => {
  const { goNext, goPrev, handleTouchStart, handleTouchEnd } = useImageSwipe({ images, activeIdx, onChangeIdx });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [goNext, goPrev, onClose]);
  if (!images || images.length === 0) return null;
  const hasActions = Boolean(onCall || onWhatsApp || onStartChat);
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  const content = (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000000' }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onClick={onClose} dir={isArabic ? 'rtl' : 'ltr'} role="dialog" aria-modal="true">
      <img src={images[activeIdx]} alt="" draggable={false} style={IMG_STYLE} />
      <button type="button" onClick={onClose} aria-label={isArabic ? 'إغلاق' : 'Close'} style={{ ...BTN_STYLE, top: 16, right: 16, width: 44, height: 44, borderRadius: 22 }}>
        <CloseCircle size={24} variant="Bold" color="#FFFFFF" />
      </button>
      {images.length > 1 && (
        <>
          <button type="button" aria-label={isArabic ? 'السابق' : 'Previous'} onClick={(e) => { stop(e); goPrev(); }} style={{ ...BTN_STYLE, top: '50%', left: 12, width: 44, height: 44, borderRadius: 22, transform: 'translateY(-50%)', fontSize: 24, fontWeight: 700 }}>‹</button>
          <button type="button" aria-label={isArabic ? 'التالي' : 'Next'} onClick={(e) => { stop(e); goNext(); }} style={{ ...BTN_STYLE, top: '50%', right: 12, width: 44, height: 44, borderRadius: 22, transform: 'translateY(-50%)', fontSize: 24, fontWeight: 700 }}>›</button>
          <div dir="ltr" style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, background: 'rgba(255,255,255,0.2)', color: '#FFFFFF', fontSize: 12, fontWeight: 700, padding: '6px 12px', borderRadius: 999, backdropFilter: 'blur(4px)' }}>{activeIdx + 1} / {images.length}</div>
        </>
      )}
      {hasActions && (
        <div onClick={stop} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, display: 'flex', gap: 8, padding: '12px 16px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          {onWhatsApp && (
            <button type="button" onClick={onWhatsApp} style={{ flex: 1, height: 48, borderRadius: 12, background: '#25D366', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
              <Whatsapp size={20} variant="Bold" color="#FFFFFF" />
              <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
            </button>
          )}
          {onStartChat && (
            <button type="button" onClick={onStartChat} style={{ flex: 1, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700, fontSize: 14, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
              <MessageText size={20} variant="Bold" color="#FFFFFF" />
              <span>{isArabic ? 'دردشة' : 'Chat'}</span>
            </button>
          )}
          {onCall && (
            <button type="button" onClick={onCall} style={{ flex: 1, height: 48, borderRadius: 12, background: '#E57E25', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
              <Call size={20} variant="Bold" color="#FFFFFF" />
              <span>{isArabic ? 'اتصال' : 'Call'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
  return createPortal(content, document.body);
});
ImageLightbox.displayName = 'ImageLightbox';
