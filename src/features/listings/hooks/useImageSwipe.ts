import { useRef, useCallback } from 'react';
import type { TouchEvent } from 'react';

const SWIPE_THRESHOLD = 50;

export interface UseImageSwipeParams {
  readonly images: readonly string[];
  readonly activeIdx: number;
  readonly onChangeIdx: (idx: number) => void;
}

export function useImageSwipe({ images, activeIdx, onChangeIdx }: UseImageSwipeParams) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const count = images.length;

  const goNext = useCallback(() => {
    if (count === 0) return;
    onChangeIdx((activeIdx + 1) % count);
  }, [activeIdx, count, onChangeIdx]);

  const goPrev = useCallback(() => {
    if (count === 0) return;
    onChangeIdx((activeIdx - 1 + count) % count);
  }, [activeIdx, count, onChangeIdx]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const sx = touchStartX.current;
    const sy = touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    if (sx === null || sy === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) < Math.abs(dy)) return;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dx < 0) goNext(); else goPrev();
  }, [goNext, goPrev]);

  return { goNext, goPrev, handleTouchStart, handleTouchEnd };
}
