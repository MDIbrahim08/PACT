'use client';

import React, { useState } from 'react';

interface PhysicsGoldenMascotProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export function PhysicsGoldenMascot({
  size = 'lg',
  className = '',
  onClick,
}: PhysicsGoldenMascotProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Core avatar size: enlarged for clear presentation
  const coreDimensions = 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28';

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none cursor-pointer group mb-4 ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Launch Interactive Pact Agent"
    >
      {/* Clean Bot Mascot Avatar with completely empty surroundings */}
      <div className="relative flex items-center justify-center">
        <div
          className={`relative z-10 ${coreDimensions} rounded-full overflow-hidden bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)] border-2 border-white/90 ring-4 ring-neutral-900/5 transition-all duration-500 ease-out ${
            isHovered ? 'scale-105 shadow-[0_20px_40px_rgba(0,0,0,0.12)] ring-neutral-900/10' : ''
          }`}
        >
          {/* Internal Radial Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-neutral-100/40 pointer-events-none z-10" />

          {/* Adorable 3D Bot Character in Video Loop */}
          <video
            src="/pact-mascot.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-110 pointer-events-none select-none transition-transform duration-500 group-hover:scale-115"
          />

          {/* Active Status Pulse Dot in bottom-right corner */}
          <div className="absolute bottom-1 right-2 z-20 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhysicsGoldenMascot;

