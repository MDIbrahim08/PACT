'use client';

import { useEffect, useRef } from 'react';

export function useMousePositionRef(containerRef?: React.RefObject<HTMLElement | null>) {
  const position = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        position.current = {
          x: x - rect.left - rect.width / 2,
          y: y - rect.top - rect.height / 2,
        };
      } else {
        position.current = {
          x: x - window.innerWidth / 2,
          y: y - window.innerHeight / 2,
        };
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      updatePosition(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        updatePosition(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [containerRef]);

  return position;
}

export default useMousePositionRef;
