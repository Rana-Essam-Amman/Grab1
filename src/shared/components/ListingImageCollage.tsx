import React from 'react';

interface ListingImageCollageProps {
  readonly images: string[];
  readonly onImageError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const ListingImageCollage: React.FC<ListingImageCollageProps> = ({ images, onImageError }) => {
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="w-full relative aspect-[4/3] bg-canvas">
        <img src={images[0]} alt="listing" className="absolute inset-0 w-full h-full object-cover" loading="lazy" onError={onImageError} />
      </div>
    );
  }
  if (images.length === 2) {
    return (
      <div className="w-full aspect-[4/3] bg-canvas grid grid-cols-2 gap-1">
        <div className="relative w-full h-full">
          <img src={images[0]} alt="listing-0" className="absolute inset-0 w-full h-full object-cover" loading="lazy" onError={onImageError} />
        </div>
        <div className="relative w-full h-full">
          <img src={images[1]} alt="listing-1" className="absolute inset-0 w-full h-full object-cover" loading="lazy" onError={onImageError} />
        </div>
      </div>
    );
  }
  if (images.length === 3) {
    return (
      <div className="w-full aspect-[4/3] bg-canvas grid grid-cols-2 grid-rows-2 gap-1">
        <div className="relative w-full h-full row-span-2">
          <img src={images[0]} alt="listing-0" className="absolute inset-0 w-full h-full object-cover" loading="lazy" onError={onImageError} />
        </div>
        <div className="relative w-full h-full">
          <img src={images[1]} alt="listing-1" className="absolute inset-0 w-full h-full object-cover" loading="lazy" onError={onImageError} />
        </div>
        <div className="relative w-full h-full">
          <img src={images[2]} alt="listing-2" className="absolute inset-0 w-full h-full object-cover" loading="lazy" onError={onImageError} />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full aspect-[4/3] bg-canvas grid grid-cols-2 grid-rows-2 gap-1 relative">
      {images.slice(0, 4).map((img, i) => (
        <div key={i} className="relative w-full h-full">
          <img src={img} alt={`listing-${i}`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" onError={onImageError} />
        </div>
      ))}
      {images.length > 4 && (
        <div className="absolute bottom-2 end-2 bg-black/75 text-white text-[12px] font-bold px-2 py-1 rounded-md z-20 shadow-sm">
          +{images.length - 4}
        </div>
      )}
    </div>
  );
};
