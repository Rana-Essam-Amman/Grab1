import React from 'react';
import { Add } from 'iconsax-react';

export interface AiThumbnailStripProps {
  images: string[];
  onRemove: (index: number) => void;
}

export const AiThumbnailStrip: React.FC<AiThumbnailStripProps> = ({ images, onRemove }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1.5 shrink-0 scrollbar-none mb-1.5">
      {images.map((imgSrc, idx) => (
        <div key={idx} className="w-12 h-12 rounded-xl relative overflow-hidden shrink-0 border border-neutral-100">
          <img src={imgSrc} alt="uploaded" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(idx);
            }}
            className="absolute top-0.5 start-0.5 w-3.5 h-3.5 rounded-full bg-black/60 text-white flex items-center justify-center text-[8px] hover:bg-danger transition-colors cursor-pointer"
          >
            <Add size={8} variant="Linear" color="#FFFFFF" className="rotate-45" />
          </button>
        </div>
      ))}
    </div>
  );
};
