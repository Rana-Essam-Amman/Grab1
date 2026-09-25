import React, { useRef, useState, useCallback } from 'react';
import { Listing } from '@/types';
import { FeaturedDealCard } from './FeaturedDealCard';

export interface FeaturedDealsCarouselProps {
  readonly listings: readonly Listing[];
  readonly isArabic: boolean;
  readonly onListingClick: (id: string) => void;
}

export const FeaturedDealsCarousel: React.FC<FeaturedDealsCarouselProps> = ({
  listings, isArabic, onListingClick,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const slides = Array.from(el.children) as HTMLElement[];
    const containerRect = el.getBoundingClientRect();
    let closest = 0;
    let minDist = Infinity;
    slides.forEach((slide, i) => {
      const rect = slide.getBoundingClientRect();
      const dist = Math.abs(rect.left - containerRect.left);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActiveIdx(closest);
  }, []);

  if (listings.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
      >
        {listings.map((listing) => (
          <div key={listing.id} className="w-full shrink-0 snap-start">
            <FeaturedDealCard
              listing={listing}
              isArabic={isArabic}
              onClick={() => onListingClick(listing.id)}
            />
          </div>
        ))}
      </div>

      {listings.length > 1 && (
        <div className="flex justify-center items-center gap-1.5">
          {listings.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIdx ? 'w-5 bg-primary' : 'w-1.5 bg-border'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
