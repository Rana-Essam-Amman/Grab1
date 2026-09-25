import React from 'react';
import { Camera, Trash } from 'iconsax-react';

interface AiReviewHeroProps {
  readonly isArabic: boolean;
  readonly photos: readonly string[];
  readonly onAddPhotos: () => void;
  readonly onRemovePhoto: (index: number) => void;
}

export const AiReviewHero: React.FC<AiReviewHeroProps> = ({
  isArabic,
  photos,
  onAddPhotos,
  onRemovePhoto,
}) => {
  return (
    <div className="relative w-full aspect-[4/3] bg-surface-raised overflow-hidden">
      {photos.length > 0 ? (
        <div className="relative w-full h-full">
          <img
            src={photos[0]}
            alt="Listing hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          <button
            type="button"
            onClick={() => onRemovePhoto(0)}
            className="absolute top-4 end-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            title={isArabic ? 'حذف الصورة' : 'Remove photo'}
          >
            <Trash size={18} variant="Bold" color="#FFFFFF" />
          </button>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-ink-muted">
          <Camera size={40} variant="Linear" />
          <span className="text-xs font-semibold">
            {isArabic ? 'لا توجد صور' : 'No photos'}
          </span>
        </div>
      )}

      {/* Gallery Strip / Add button */}
      <div className="absolute bottom-4 start-4 end-4 flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        <button
          type="button"
          onClick={onAddPhotos}
          className="h-12 px-3.5 rounded-xl bg-white/90 text-ink text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-md hover:bg-white transition-colors"
        >
          <Camera size={16} variant="Bold" color="#E57E25" />
          <span>{isArabic ? 'إضافة صور' : 'Add Photos'}</span>
        </button>

        {photos.slice(1).map((photo, idx) => {
          const actualIndex = idx + 1;
          return (
            <div
              key={actualIndex}
              className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/40 shadow-sm group"
            >
              <img
                src={photo}
                alt={`Photo ${actualIndex + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemovePhoto(actualIndex)}
                className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash size={14} variant="Bold" color="#FFFFFF" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
