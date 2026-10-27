import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      // Hide when scrolling down past 80px, show when scrolling up
      if (currentY > lastY && currentY > 80) {
        setIsVisible(false);
      } else if (currentY < lastY) {
        setIsVisible(true);
      }
      lastY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isVisible;
}
