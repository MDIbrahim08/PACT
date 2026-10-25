"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Play, Volume2, VolumeX } from 'lucide-react';

export interface CenteredWalkthroughVideoProps {
  className?: string;
}

export function CenteredWalkthroughVideo({ className }: CenteredWalkthroughVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isInView, setIsInView] = useState(false);

  // Track when video section is in viewport for spacebar control
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Ensure video is paused at start (never autoplays on scroll)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Scroll-linked animation as video scrolls into view
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  // Smooth transforms: subtle scale up from 0.90 to 1.0, 3D tilt from 8deg to 0deg
  const scale = useTransform(smoothProgress, [0, 1], [0.90, 1.0]);
  const rotateX = useTransform(smoothProgress, [0, 1], [8, 0]);
  const opacity = useTransform(smoothProgress, [0, 0.3, 1], [0.55, 0.88, 1]);
  const glowOpacity = useTransform(smoothProgress, [0, 1], [0, 0.5]);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Fallback if browser requires muted play
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play();
            setIsPlaying(true);
          }
        });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Spacebar Key Listener: Play/Pause when video is in view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.key !== ' ') return;

      // Do not trigger if typing in form inputs, textareas or modals
      const activeEl = document.activeElement;
      const isInputActive = activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        (activeEl as HTMLElement).isContentEditable
      );
      if (isInputActive) return;

      if (isInView) {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInView, togglePlay]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex flex-col items-center justify-center py-6 sm:py-10 ${className || ''}`}
      style={{ perspective: '1200px' }}
    >
      {/* Soft Ambient Background Glow on Scroll */}
      <motion.div
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute -inset-2 sm:-inset-6 max-w-lg mx-auto rounded-[48px] bg-gradient-to-tr from-blue-500/20 via-emerald-400/15 to-indigo-500/20 blur-2xl -z-10"
      />

      {/* Clean, Visible & Perfectly Sized Video Frame */}
      <motion.div
        style={{
          scale,
          rotateX,
          opacity,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full max-w-[360px] sm:max-w-[430px] md:max-w-[460px] aspect-square rounded-[28px] sm:rounded-[36px] overflow-hidden bg-black border border-neutral-300/80 dark:border-neutral-700/80 shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-all hover:shadow-[0_25px_70px_rgba(0,0,0,0.25)] group"
      >
        {/* Video Element - Paused by default at frame 0 */}
        <video
          ref={videoRef}
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-cover rounded-[26px] sm:rounded-[34px] cursor-pointer"
        >
          <source src="/pact-deal-walkthrough.mp4" type="video/mp4" />
          <source src="/IMG_2678.mp4" type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>

        {/* Clean Play Overlay Indicator when Paused */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[1.5px] cursor-pointer transition-all hover:bg-black/40 group/play"
          >
            <div className="w-16 h-16 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-2xl transition-transform group-hover/play:scale-110 active:scale-95 pl-1">
              <Play className="w-7 h-7 fill-neutral-900 text-neutral-900" />
            </div>
            <span className="mt-3 text-[11px] font-mono tracking-wider text-white/95 bg-black/60 border border-white/20 px-3 py-1 rounded-full backdrop-blur-xs shadow-md">
              Press Space or Click to Play
            </span>
          </div>
        )}

        {/* Minimalist Floating Audio Toggle (Corner, Doesn't Cover Video) */}
        <button
          type="button"
          onClick={toggleMute}
          className="absolute bottom-3 right-3 z-20 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-white border border-white/15 backdrop-blur-xs transition-all active:scale-95 shadow-md opacity-80 group-hover:opacity-100"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-neutral-300" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
          )}
        </button>
      </motion.div>
    </div>
  );
}

export default CenteredWalkthroughVideo;
