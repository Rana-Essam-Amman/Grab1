import React from 'react';
import { Trash } from 'iconsax-react';

interface Props {
  photos: string[];
  isArabic: boolean;
  onRemove: (index: number) => void;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const PhotoPreviewList: React.FC<Props> = ({ photos, isArabic, onRemove, onImageError }) => {
  return (
    <>
      {photos.map((src, idx) => (
        <div
          key={idx}
          className="aspect-square rounded-2xl bg-background relative overflow-hidden border border-border group"
        >
          <img
            src={src}
            alt={`Photo ${idx + 1}`}
            className="w-full h-full object-cover"
            onError={onImageError}
          />
          <button
            onClick={() => onRemove(idx)}
            className="absolute top-1.5 end-1.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
          >
            <Trash size={13} variant="Linear" color="#FFFFFF" />
          </button>
          {idx === 0 && (
            <div className="absolute bottom-1 start-1 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
              {isArabic ? 'الرئيسية' : 'Cover'}
            </div>
          )}
        </div>
      ))}
    </>
  );
};
