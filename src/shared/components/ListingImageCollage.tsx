import React from 'react';
import { toOptimizedImageUrl } from '@/shared/lib/optimizedImage';

const buildSrc = (src: string): string =>
  toOptimizedImageUrl(src, { width: 800, quality: 80 });

const buildSrcSet = (src: string): string =>
  [
    `${toOptimizedImageUrl(src, { width: 400, quality: 80 })} 400w`,
    `${toOptimizedImageUrl(src, { width: 800, quality: 80 })} 800w`,
    `${toOptimizedImageUrl(src, { width: 1200, quality: 80 })} 1200w`,
  ].join(', ');

const IMG_SIZES = '(max-width: 440px) 100vw, 440px';

interface ListingImageCollageProps {
  readonly images: string[];
  readonly onImageError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  readonly priority?: boolean;
}

export const ListingImageCollage: React.FC<ListingImageCollageProps> = ({ images, onImageError, priority = false }) => {
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="w-full relative aspect-[4/3] bg-canvas">
        <img src={buildSrc(images[0])} srcSet={buildSrcSet(images[0])} sizes={IMG_SIZES} alt="listing" className="absolute inset-0 w-full h-full object-cover" loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} onError={onImageError} />
      </div>
    );
  }
  if (images.length === 2) {
    return (
      <div className="w-full aspect-[4/3] bg-canvas grid grid-cols-2 gap-1">
        <div className="relative w-full h-full">
          <img src={buildSrc(images[0])} srcSet={buildSrcSet(images[0])} sizes={IMG_SIZES} alt="listing-0" className="absolute inset-0 w-full h-full object-cover" loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} onError={onImageError} />
        </div>
        <div className="relative w-full h-full">
          <img src={buildSrc(images[1])} srcSet={buildSrcSet(images[1])} sizes={IMG_SIZES} alt="listing-1" className="absolute inset-0 w-full h-full object-cover" loading={priority ? "eager" : "lazy"} onError={onImageError} />
        </div>
      </div>
    );
  }
  if (images.length === 3) {
    return (
      <div className="w-full aspect-[4/3] bg-canvas grid grid-cols-2 grid-rows-2 gap-1">
        <div className="relative w-full h-full row-span-2">
          <img src={buildSrc(images[0])} srcSet={buildSrcSet(images[0])} sizes={IMG_SIZES} alt="listing-0" className="absolute inset-0 w-full h-full object-cover" loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} onError={onImageError} />
        </div>
        <div className="relative w-full h-full">
          <img src={buildSrc(images[1])} srcSet={buildSrcSet(images[1])} sizes={IMG_SIZES} alt="listing-1" className="absolute inset-0 w-full h-full object-cover" loading={priority ? "eager" : "lazy"} onError={onImageError} />
        </div>
        <div className="relative w-full h-full">
          <img src={buildSrc(images[2])} srcSet={buildSrcSet(images[2])} sizes={IMG_SIZES} alt="listing-2" className="absolute inset-0 w-full h-full object-cover" loading={priority ? "eager" : "lazy"} onError={onImageError} />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full aspect-[4/3] bg-canvas grid grid-cols-2 grid-rows-2 gap-1 relative">
      {images.slice(0, 4).map((img, i) => (
        <div key={i} className="relative w-full h-full">
          <img src={buildSrc(img)} srcSet={buildSrcSet(img)} sizes={IMG_SIZES} alt={`listing-${i}`} className="absolute inset-0 w-full h-full object-cover" loading={priority ? "eager" : "lazy"} fetchPriority={priority && i === 0 ? "high" : undefined} onError={onImageError} />
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
