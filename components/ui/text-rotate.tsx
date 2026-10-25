'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TextRotateProps {
  texts: string[];
  rotationInterval?: number;
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  exit?: Record<string, any>;
  transition?: Record<string, any>;
  loop?: boolean;
  auto?: boolean;
  splitBy?: 'words' | 'characters' | 'lines' | 'none';
  staggerDuration?: number;
  staggerFrom?: 'first' | 'last' | 'center' | 'random';
  className?: string;
  elementLevelClassName?: string;
  mainClassName?: string;
}

export function TextRotate({
  texts,
  rotationInterval = 2600,
  initial = { y: '100%', opacity: 0 },
  animate = { y: 0, opacity: 1 },
  exit = { y: '-100%', opacity: 0 },
  transition = { type: 'spring', damping: 25, stiffness: 300 },
  loop = true,
  auto = true,
  splitBy = 'none',
  className = '',
  mainClassName = '',
}: TextRotateProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    if (!auto || texts.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentTextIndex((prevIndex) => {
        if (prevIndex === texts.length - 1) {
          return loop ? 0 : prevIndex;
        }
        return prevIndex + 1;
      });
    }, rotationInterval);

    return () => clearInterval(intervalId);
  }, [auto, texts, rotationInterval, loop]);

  const currentText = texts[currentTextIndex] || '';

  return (
    <span className={`inline-flex overflow-hidden align-baseline ${mainClassName}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentTextIndex}
          initial={initial}
          animate={animate}
          exit={exit}
          transition={transition}
          className={`inline-block whitespace-nowrap ${className}`}
        >
          {currentText}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default TextRotate;
