import { useState, useEffect, useRef } from 'react';

export function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollDelta = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    
    // Facebook-like asymmetric thresholds: 
    // Hide easily (10px down), Show strictly (30px up) to prevent jitter
    const upThreshold = 30; 
    const downThreshold = 10; 

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;
      scrollDelta.current += diff;

      if (scrollDelta.current > downThreshold && currentScrollY > 80) {
        setIsVisible(false);
        scrollDelta.current = 0;
      } 
      else if (scrollDelta.current < -upThreshold) {
        setIsVisible(true);
        scrollDelta.current = 0;
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isVisible;
}
