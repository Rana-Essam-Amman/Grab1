import React from 'react';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';

export interface ListingImageNavProps {
  readonly count: number;
  readonly activeIdx: number;
  readonly isArabic: boolean;
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly onSelect: (idx: number) => void;
}

export const ListingImageNav: React.FC<ListingImageNavProps> = ({
  count,
  activeIdx,
  isArabic,
  onPrev,
  onNext,
  onSelect,
}) => {
  if (count <= 1) return null;

  return (
    <>
      <button
        type="button"
        aria-label={isArabic ? 'الصورة السابقة' : 'Previous image'}
        onClick={onPrev}
        className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3' : 'left-3'} w-9 h-9 rounded-full bg-black/50 backdrop-blur-xs text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer z-20`}
      >
        {isArabic ? <ArrowRight2 size={20} /> : <ArrowLeft2 size={20} />}
      </button>

      <button
        type="button"
        aria-label={isArabic ? 'الصورة التالية' : 'Next image'}
        onClick={onNext}
        className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-3' : 'right-3'} w-9 h-9 rounded-full bg-black/50 backdrop-blur-xs text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer z-20`}
      >
        {isArabic ? <ArrowLeft2 size={20} /> : <ArrowRight2 size={20} />}
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 backdrop-blur-xs px-3 py-1 rounded-full z-20">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to image ${i + 1}`}
            onClick={() => onSelect(i)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              i === activeIdx ? 'w-5 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </>
  );
};
