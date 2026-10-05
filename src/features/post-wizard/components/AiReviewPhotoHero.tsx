import React, { useState } from 'react';
import { Camera, Trash, Add } from 'iconsax-react';

interface AiReviewPhotoHeroProps {
  readonly isArabic: boolean;
  readonly photos: readonly string[];
  readonly onAddPhotos: () => void;
  readonly onRemovePhoto: (index: number) => void;
}

export const AiReviewPhotoHero: React.FC<AiReviewPhotoHeroProps> = ({
  isArabic, photos, onAddPhotos, onRemovePhoto,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const hasPhotos = photos.length > 0;

  return (
    <div className="relative w-full h-[280px] bg-canvas overflow-hidden">
      {hasPhotos ? (
        <img
          src={photos[activeIdx]}
          alt=""
          className="w-full h-full object-cover"
        />
      ) : (
        <button
          type="button"
          onClick={onAddPhotos}
          className="w-full h-full flex flex-col items-center justify-center gap-2 text-ink-muted cursor-pointer"
        >
          <Camera size={40} variant="Linear" />
          <span className="text-xs font-bold">{isArabic ? 'أضف صورة' : 'Add photo'}</span>
        </button>
      )}

      {hasPhotos && (
        <>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 inset-x-4 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onAddPhotos}
              className="flex items-center gap-1.5 rounded-full bg-surface/95 backdrop-blur px-3 py-1.5 shadow-sm hover:bg-surface transition-colors cursor-pointer"
            >
              <Add size={12} variant="Bold" color="#1a2238" />
              <span className="text-[11px] font-bold text-ink">
                {isArabic ? 'صور' : 'Photos'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onRemovePhoto(activeIdx)}
              className="w-8 h-8 rounded-full bg-surface/95 backdrop-blur flex items-center justify-center shadow-sm hover:bg-surface transition-colors cursor-pointer"
              aria-label="Remove photo"
            >
              <Trash size={14} variant="Bold" color="#EF4444" />
            </button>
          </div>
        </>
      )}

      {photos.length > 1 && (
        <div className="absolute top-4 inset-x-0 flex justify-center gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIdx ? 'w-5 bg-surface' : 'w-1.5 bg-surface/50'
              }`}
              aria-label={`Photo ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
