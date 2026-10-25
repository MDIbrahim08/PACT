'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

import { GlassShineCard } from '@/components/ui/glass-shine-card';

const TOTAL_FRAMES = 300;

const getFramePath = (frameIndex: number): string => {
  const num = Math.min(Math.max(1, frameIndex + 1), TOTAL_FRAMES);
  return `/hero-frames/ezgif-frame-${String(num).padStart(3, '0')}.jpg`;
};

export default function AppleScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Active text phase: 1 for Text 1, 2 for Text 2, 0 for clear view
  const activeText =
    scrollProgress >= 0.12 && scrollProgress < 0.48
      ? 1
      : scrollProgress >= 0.52 && scrollProgress < 0.88
      ? 2
      : 0;

  // Render a specific frame onto the high-DPI 4K canvas
  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Retrieve requested image or nearest loaded neighbor
    let img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let delta = 1; delta < 35; delta++) {
        const prev = imagesRef.current[index - delta];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesRef.current[index + delta];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }
    if (!img || !img.complete || img.naturalWidth === 0) {
      img = imagesRef.current[0];
    }
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Enforce high-quality 4K bilinear filtering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Precise high-res object-fit: cover calculation
    const hRatio = canvas.width / img.naturalWidth;
    const vRatio = canvas.height / img.naturalHeight;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.naturalWidth * ratio) / 2;
    const centerShift_y = (canvas.height - img.naturalHeight * ratio) / 2;

    ctx.drawImage(
      img,
      0,
      0,
      img.naturalWidth,
      img.naturalHeight,
      centerShift_x,
      centerShift_y,
      img.naturalWidth * ratio,
      img.naturalHeight * ratio
    );
  };

  // Resize canvas according to 4K supersampling (minimum 2x DPR)
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    renderFrame(currentFrame - 1);
  };

  // Preload all 300 JPG frames into memory in fast prioritized batches
  useEffect(() => {
    let active = true;
    const imgs: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    // Load Frame 1 immediately
    const firstImg = new Image();
    firstImg.src = getFramePath(0);
    firstImg.onload = () => {
      if (!active) return;
      imgs[0] = firstImg;
      imagesRef.current = imgs;
      setIsLoaded(true);
      resizeCanvas();
      if (typeof window !== 'undefined') {
        ScrollTrigger.refresh();
      }
    };

    // Load remaining frames in batches to avoid network bottle-necking
    const batchSize = 30;
    let currentBatch = 1;

    const loadNextBatch = () => {
      if (!active || currentBatch >= TOTAL_FRAMES) return;
      const end = Math.min(currentBatch + batchSize, TOTAL_FRAMES);
      for (let i = currentBatch; i < end; i++) {
        const img = new Image();
        img.src = getFramePath(i);
        img.onload = () => {
          if (!active) return;
          imgs[i] = img;
        };
      }
      currentBatch = end;
      if (currentBatch < TOTAL_FRAMES) {
        setTimeout(loadNextBatch, 30);
      }
    };

    loadNextBatch();
    imagesRef.current = imgs;

    window.addEventListener('resize', resizeCanvas);
    return () => {
      active = false;
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // GSAP ScrollTrigger timeline setup with explicit pinning & 5000px runway
  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: stickyRef.current,
          pinSpacing: true,
          start: 'top top',
          end: '+=5000', // 5000px of full, smooth scrolling runway (~2 seconds per text phase)
          scrub: 0.8, // Buttery smooth 120Hz Lenis scrub
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            setScrollProgress(p);
            const idx = Math.min(
              Math.floor(p * (TOTAL_FRAMES - 1)),
              TOTAL_FRAMES - 1
            );
            setCurrentFrame(idx + 1);
            renderFrame(idx);
          },
        },
      });
    }, containerRef);

    // Refresh ScrollTrigger to recalculate exact offsets
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <div ref={containerRef} className="relative w-full bg-transparent">
      
      {/* Pinned Viewport (100vh) Controlled Strictly by GSAP ScrollTrigger */}
      <div 
        ref={stickyRef} 
        className="relative w-full h-screen overflow-hidden flex items-center justify-center select-none"
      >
        {/* Full-Viewport High-DPI 4K Canvas Renderer with transparent multiply blend on white grid */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-none z-0 mix-blend-multiply"
          style={{
            imageRendering: '-webkit-optimize-contrast',
            filter: 'contrast(1.06) brightness(1.03)',
          }}
        />

        {/* ============================================================
            TEXT 1: 12% - 48% Scroll (Left Aligned Glass Shine Card)
           ============================================================ */}
        <div
          className={`absolute left-6 sm:left-12 lg:left-16 max-w-xs sm:max-w-md z-30 transition-all duration-700 ease-out transform ${
            activeText === 1
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          }`}
        >
          <GlassShineCard
            align="left"
            className="border-neutral-200/90 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_30px_rgba(0,0,0,0.25)]"
            badge={
              <div className="inline-flex items-center space-x-1.5 text-[10px] font-mono text-neutral-800 dark:text-slate-100 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/95 dark:bg-slate-800/90 border border-neutral-300/80 dark:border-slate-700 shadow-xs backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>01 · MULTILINGUAL CAPTURE</span>
              </div>
            }
            title={
              <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-snug">
                Informal Hinglish to{' '}
                <span className="text-black dark:text-white font-extrabold underline decoration-neutral-400 dark:decoration-slate-400">
                  Structured Intent
                </span>
              </h3>
            }
            description={
              <p className="text-neutral-700 dark:text-slate-200 text-xs sm:text-sm font-medium leading-relaxed">
                Gemini 3.8 Live & NVIDIA Nemotron 70B extract Section 10 contract pillars in &lt; 1.2s.
              </p>
            }
          />
        </div>

        {/* ============================================================
            TEXT 2: 52% - 88% Scroll (Right Aligned Glass Shine Card)
           ============================================================ */}
        <div
          className={`absolute right-6 sm:right-12 lg:right-16 max-w-xs sm:max-w-md z-30 transition-all duration-700 ease-out transform ${
            activeText === 2
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          }`}
        >
          <GlassShineCard
            align="right"
            className="border-neutral-200/90 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_30px_rgba(0,0,0,0.25)]"
            badge={
              <div className="inline-flex items-center space-x-1.5 text-[10px] font-mono text-neutral-800 dark:text-slate-100 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/95 dark:bg-slate-800/90 border border-neutral-300/80 dark:border-slate-700 shadow-xs backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>02 · STATUTORY AMBIGUITY RADAR</span>
              </div>
            }
            title={
              <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-snug">
                Section 29 Risk Shield &{' '}
                <span className="text-black dark:text-white font-extrabold underline decoration-neutral-400 dark:decoration-slate-400">
                  MSMED §15 Lock
                </span>
              </h3>
            }
            description={
              <p className="text-neutral-700 dark:text-slate-200 text-xs sm:text-sm font-medium leading-relaxed sm:ml-auto">
                DeepSeek R1 flags vague terms while Llama 3.3 sends automated WhatsApp counter-nudges to lock exact dates.
              </p>
            }
          />
        </div>

      </div>

    </div>
  );
}
