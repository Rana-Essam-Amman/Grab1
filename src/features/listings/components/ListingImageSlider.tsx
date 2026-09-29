import React from 'react';

export interface ListingImageSliderProps {
  images: string[];
  activeIdx: number;
  onChangeIdx: (idx: number) => void;
  isArabic: boolean;
}

export const ListingImageSlider: React.FC<ListingImageSliderProps> = React.memo(({
  images,
  activeIdx,
  onChangeIdx,
}) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full aspect-4/3 bg-ink overflow-hidden">
      <img
        src={images[activeIdx]}
        alt="Listing image"
        className="w-full h-full object-cover transition-all duration-300"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23E5E7EB"/><text x="200" y="150" font-size="16" text-anchor="middle" fill="%234B5563">Catch</text></svg>';
        }}
      />
      {images.length > 1 && (
        <div className="absolute top-3 end-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20" dir="ltr">
          {activeIdx + 1} / {images.length}
        </div>
      )}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 backdrop-blur-xs px-3 py-1 rounded-full">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => onChangeIdx(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                i === activeIdx ? 'w-5 bg-white' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

ListingImageSlider.displayName = 'ListingImageSlider';
