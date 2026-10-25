import { useEffect, useRef, useState } from 'react';

export function useKeyboardSync() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    let lastHeight = window.innerHeight;
    let isMounted = true;

    const computeKeyboard = () => {
      if (!isMounted) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!isMounted) return;
        const currentHeight = vv.height;
        const diff = lastHeight - currentHeight;
        if (Math.abs(diff) > 100) {
          setKeyboardHeight(Math.max(0, diff));
          lastHeight = currentHeight;
        }
      });
    };

    const scrollY = window.scrollY;
    const original = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    const preventScroll = () => { window.scrollTo(0, scrollY); };

    window.addEventListener('scroll', preventScroll, { passive: false });
    vv.addEventListener('resize', computeKeyboard);
    vv.addEventListener('scroll', computeKeyboard);
    computeKeyboard();

    return () => {
      isMounted = false;
      vv.removeEventListener('resize', computeKeyboard);
      vv.removeEventListener('scroll', computeKeyboard);
      window.removeEventListener('scroll', preventScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.style.position = original.position;
      document.body.style.top = original.top;
      document.body.style.width = original.width;
      document.body.style.overflow = original.overflow;
      window.scrollTo(0, scrollY);
    };
  }, []);

  return keyboardHeight;
}
