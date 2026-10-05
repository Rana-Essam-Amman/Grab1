import React from 'react';
import { Trash } from 'iconsax-react';

interface Props {
  photos: string[];
  isArabic: boolean;
  onRemove: (index: number) => void;
  onSetCover?: (index: number) => void;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const PhotoPreviewList: React.FC<Props> = ({ photos, isArabic, onRemove, onSetCover, onImageError }) => {
  return (
    <>
      {photos.map((src, idx) => (
        <div
          key={idx}
          onClick={() => {
            if (idx > 0) onSetCover?.(idx);
          }}
          className={`aspect-square rounded-2xl bg-canvas relative overflow-hidden border border-line group ${
            idx > 0 ? 'cursor-pointer hover:border-accent/60 transition-colors' : ''
          }`}
        >
          <img
            src={src}
            alt={`Photo ${idx + 1}`}
            className="w-full h-full object-cover"
            onError={onImageError}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(idx);
            }}
            aria-label={isArabic ? 'حذف الصورة' : 'Remove photo'}
            className="absolute top-1.5 end-1.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
          >
            <Trash size={13} variant="Linear" color="#FFFFFF" />
          </button>
          {idx === 0 && (
            <div className="absolute bottom-1 start-1 bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
              {isArabic ? 'الرئيسية' : 'Cover'}
            </div>
          )}
        </div>
      ))}
    </>
  );
};
