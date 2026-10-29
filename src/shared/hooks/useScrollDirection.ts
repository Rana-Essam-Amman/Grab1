import { useState, useEffect, useRef } from 'react';

export function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollDelta = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const upThreshold = 30;
    const downThreshold = 10;

    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;
      scrollDelta.current += diff;

      if (scrollDelta.current > downThreshold && currentScrollY > 80) {
        setIsVisible(false);
        scrollDelta.current = 0;
      } else if (scrollDelta.current < -upThreshold) {
        setIsVisible(true);
        scrollDelta.current = 0;
      }
      lastScrollY.current = currentScrollY;
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScroll);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isVisible;
}
