import { useCallback, useRef } from 'react';

interface UseLongPressOptions {
  readonly onLongPress: () => void;
  readonly delay?: number;
  readonly moveTolerance?: number;
}

interface LongPressHandlers {
  readonly onTouchStart: (e: React.TouchEvent) => void;
  readonly onTouchEnd: (e: React.TouchEvent) => void;
  readonly onTouchMove: (e: React.TouchEvent) => void;
  readonly onContextMenu: (e: React.MouseEvent) => void;
}

/**
 * Long-press detection with cancel-on-move.
 *
 * - Fires `onLongPress` after `delay` ms of continuous press.
 * - Cancels if the pointer moves more than `moveTolerance` px (scroll guard).
 * - Handles right-click on desktop (contextmenu) as an alternate trigger.
 * - RTL-safe (no directional assumptions).
 *
 * Google-level: threshold 500ms matches iOS HIG / Material Design.
 */
export function useLongPress({
  onLongPress,
  delay = 500,
  moveTolerance = 10,
}: UseLongPressOptions): LongPressHandlers {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startRef.current = null;
  }, []);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      startRef.current = { x: t.clientX, y: t.clientY };
      timerRef.current = setTimeout(() => {
        onLongPress();
        clear();
      }, delay);
    },
    [delay, onLongPress, clear]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const t = e.touches[0];
      if (!t || !startRef.current) return;
      const dx = Math.abs(t.clientX - startRef.current.x);
      const dy = Math.abs(t.clientY - startRef.current.y);
      if (dx > moveTolerance || dy > moveTolerance) clear();
    },
    [moveTolerance, clear]
  );

  const onTouchEnd = useCallback(() => clear(), [clear]);

  const onContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onLongPress();
    },
    [onLongPress]
  );

  return { onTouchStart, onTouchEnd, onTouchMove, onContextMenu };
}
