'use client';

import React from 'react';

export const LiquidLogo: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none group cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      title="Pact // Liquid Protocol"
    >
      {/* Ambient Blue Liquid Glow */}
      <span className="absolute inset-0 rounded-xl bg-blue-500/30 blur-md group-hover:bg-blue-400/50 transition-all duration-500" />
      
      {/* Outer subtle glass frame */}
      <div className="relative w-full h-full rounded-xl bg-[#0a1326] border border-blue-500/40 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,130,251,0.3)] group-hover:border-blue-400 group-hover:shadow-[0_0_20px_rgba(0,130,251,0.6)] transition-all">
        
        {/* Liquid Wave Refraction Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0082fb]/30 via-transparent to-cyan-300/20 opacity-70 group-hover:opacity-100 transition-opacity" />

        {/* Cursive / Geometric Stylized "P" SVG */}
        <svg 
          viewBox="0 0 32 32" 
          className="w-4/5 h-4/5 relative z-10 transition-transform duration-300 group-hover:scale-105"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="pactLiquidGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00E5FF" />
              <stop offset="0.45" stopColor="#0082FB" />
              <stop offset="1" stopColor="#0047FF" />
            </linearGradient>
            <filter id="liquidGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#0082FB" floodOpacity="0.8"/>
            </filter>
          </defs>

          {/* Stem & Curved Loop of Geometric Cursive P */}
          <path
            d="M9 25V8.5C9 7.12 10.12 6 11.5 6H18.2C21.95 6 25 9.05 25 12.8C25 16.55 21.95 19.6 18.2 19.6H13.5V25"
            stroke="url(#pactLiquidGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#liquidGlow)"
          />

          {/* Fluid Central Dot Highlight */}
          <circle cx="17.5" cy="12.8" r="2" fill="#FFFFFF" opacity="0.9" />
        </svg>

      </div>
    </div>
  );
};
