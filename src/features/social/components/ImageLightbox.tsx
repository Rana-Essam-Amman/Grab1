import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CloseCircle } from 'iconsax-react';

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ images, initialIndex, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-in fade-in" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 end-4 p-2 text-white/80 hover:text-white bg-white/10 rounded-full cursor-pointer z-10">
        <CloseCircle size="28" variant="Bold" color="currentColor" />
      </button>
      <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }} onClick={e => e.stopPropagation()}>
        {images.map((img, i) => (
          <div key={i} className="w-full h-full shrink-0 snap-center flex items-center justify-center p-4">
            <img src={img} alt={`full-${i}`} className="max-w-full max-h-full object-contain" />
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
};
