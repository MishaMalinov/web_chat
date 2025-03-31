import { useEffect } from 'react';

export default function usePreventSwipe() {
  useEffect(() => {
    const preventSwipeBack = (event) => {
      
      if (event.touches[0].clientX < 50 && event.touches[0].clientY > 60) {
        event.preventDefault();
      }
    };

    document.addEventListener('touchstart', preventSwipeBack, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventSwipeBack);
    };
  }, []);
}
