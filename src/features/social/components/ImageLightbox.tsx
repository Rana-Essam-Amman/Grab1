// RULE-14-EXCEPTION: UI complexity
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CloseCircle } from 'iconsax-react';

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ images, initialIndex, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialPinchDistanceRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(1);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // 1. Initial Scroll Position Fix
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Scroll to initialIndex on mount
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollLeft = initialIndex * width;
    }

    return () => {
      document.body.style.overflow = originalStyle; // 2. Restore original style
    };
  }, [initialIndex]);

  // 3. Pinch-to-Zoom logic
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistanceRef.current = distance;
      initialScaleRef.current = scale;
    } else if (e.touches.length === 1 && scale > 1) {
      setDragging(true);
      setStartPos({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const initialDist = initialPinchDistanceRef.current || distance;
      const initialScale = initialScaleRef.current || 1;
      const newScale = Math.min(Math.max((distance / initialDist) * initialScale, 1), 4);
      setScale(newScale);
      if (newScale === 1) setPosition({ x: 0, y: 0 });
    } else if (e.touches.length === 1 && dragging && scale > 1) {
      setPosition({
        x: e.touches[0].clientX - startPos.x,
        y: e.touches[0].clientY - startPos.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
    if (scale < 1.05) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleDoubleTap = () => {
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-in fade-in"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 end-4 p-2 text-white/80 hover:text-white bg-white/10 rounded-full cursor-pointer z-10"
      >
        <CloseCircle size="28" variant="Bold" color="currentColor" />
      </button>

      <div
        ref={scrollRef}
        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', touchAction: scale > 1 ? 'none' : 'pan-x' }}
        onClick={(e) => e.stopPropagation()}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="w-full h-full shrink-0 snap-center flex items-center justify-center p-4 overflow-hidden"
          >
            <img
              src={img}
              alt={`full-${i}`}
              className="max-w-full max-h-full object-contain transition-transform duration-75"
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onDoubleClick={handleDoubleTap}
            />
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
};
