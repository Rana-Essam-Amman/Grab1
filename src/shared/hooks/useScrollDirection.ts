import { useState, useEffect, useRef } from 'react';

export function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollDelta = useRef(0);

  useEffect(() => {
    const threshold = 15; // 15px حركة مطلوبة عشان نخفي أو نظهر (منع الحساسية)

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // احسب المسافة اللي المستخدم سحبها من آخر مرة
      const diff = currentScrollY - lastScrollY.current;
      scrollDelta.current += diff;

      // لو المستخدم سحب لتحت أكتر من 15 بكسل (وعده 80 بكسل من فوق)
      if (scrollDelta.current > threshold && currentScrollY > 80) {
        setIsVisible(false);
        scrollDelta.current = 0; // رجع العداد صفر
      } 
      // لو المستخدم طلع لفوق أكتر من 15 بكسل
      else if (scrollDelta.current < -threshold) {
        setIsVisible(true);
        scrollDelta.current = 0; // رجع العداد صفر
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isVisible;
}
