
import { useEffect, RefObject } from 'react';

export const useSwipeNavigation = (
  elementRef: RefObject<HTMLElement>,
  onSwipe: (direction: 'left' | 'right') => void
) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let isScrolling = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isScrolling = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startX || !startY) return;

      endX = e.touches[0].clientX;
      endY = e.touches[0].clientY;

      const diffX = Math.abs(endX - startX);
      const diffY = Math.abs(endY - startY);

      // Determine if user is scrolling vertically
      if (diffY > diffX && diffY > 10) {
        isScrolling = true;
      }

      // Prevent horizontal swipe if user is scrolling vertically
      if (isScrolling) return;

      // If horizontal movement is significant, prevent default behavior
      if (diffX > 10 && diffX > diffY) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (!startX || !startY || isScrolling) {
        startX = 0;
        startY = 0;
        return;
      }

      const diffX = endX - startX;
      const diffY = Math.abs(endY - startY);
      const minSwipeDistance = 100;
      const maxVerticalDistance = 100;

      // Only trigger swipe if horizontal movement is significant and vertical movement is minimal
      if (Math.abs(diffX) > minSwipeDistance && diffY < maxVerticalDistance) {
        if (diffX > 0) {
          onSwipe('right'); // Swipe right (go back)
        } else {
          onSwipe('left');  // Swipe left (go forward)
        }
      }

      startX = 0;
      startY = 0;
      endX = 0;
      endY = 0;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, onSwipe]);
};
