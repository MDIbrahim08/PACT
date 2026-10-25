'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useAnimationFrame } from 'framer-motion';
import { useMousePositionRef } from '@/hooks/use-mouse-position-ref';

interface FloatingContextType {
  registerElement: (id: string, depth: number, ref: HTMLElement) => void;
  unregisterElement: (id: string) => void;
}

const FloatingContext = createContext<FloatingContextType | null>(null);

export function Floating({
  children,
  className = '',
  sensitivity = 1,
  easingFactor = 0.05,
}: {
  children: React.ReactNode;
  className?: string;
  sensitivity?: number;
  easingFactor?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePositionRef(containerRef);
  const elementsMap = useRef<Map<string, { ref: HTMLElement; depth: number }>>(new Map());
  const currentPositions = useRef<Map<string, { x: number; y: number }>>(new Map());

  const registerElement = (id: string, depth: number, el: HTMLElement) => {
    elementsMap.current.set(id, { ref: el, depth });
    if (!currentPositions.current.has(id)) {
      currentPositions.current.set(id, { x: 0, y: 0 });
    }
  };

  const unregisterElement = (id: string) => {
    elementsMap.current.delete(id);
    currentPositions.current.delete(id);
  };

  useAnimationFrame(() => {
    elementsMap.current.forEach(({ ref, depth }, id) => {
      const targetX = (mousePosition.current.x * depth * sensitivity) / 20;
      const targetY = (mousePosition.current.y * depth * sensitivity) / 20;

      const current = currentPositions.current.get(id) || { x: 0, y: 0 };
      const newX = current.x + (targetX - current.x) * easingFactor;
      const newY = current.y + (targetY - current.y) * easingFactor;

      currentPositions.current.set(id, { x: newX, y: newY });
      ref.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
    });
  });

  return (
    <FloatingContext.Provider value={{ registerElement, unregisterElement }}>
      <div ref={containerRef} className={`relative w-full h-full ${className}`}>
        {children}
      </div>
    </FloatingContext.Provider>
  );
}

export function FloatingElement({
  children,
  depth = 1,
  className = '',
}: {
  children: React.ReactNode;
  depth?: number;
  className?: string;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(`float-${Math.random().toString(36).substring(2, 9)}`);
  const context = useContext(FloatingContext);

  useEffect(() => {
    if (!context || !elementRef.current) return;
    const id = idRef.current;
    context.registerElement(id, depth, elementRef.current);
    return () => {
      context.unregisterElement(id);
    };
  }, [context, depth]);

  return (
    <div
      ref={elementRef}
      className={`absolute will-change-transform pointer-events-none transition-opacity duration-500 ${className}`}
    >
      {children}
    </div>
  );
}
