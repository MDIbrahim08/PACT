'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Shield, Sparkles, AlertTriangle, Lock, Mic, X, Volume2 } from 'lucide-react';

export type AgentState = 
  | 'listening' 
  | 'analyzing' 
  | 'locked' 
  | 'tampered'
  | 'user-speaking'
  | 'processing'
  | 'agent-speaking';

interface MuseMascotProps {
  state: AgentState;
  statusMessage?: string;
  enforceabilityScore?: number;
  isVoiceActive?: boolean;
  onToggleVoice?: () => void;
  compact?: boolean;
  placement?: 'center' | 'header-right' | 'dock-bubble';
  isOpen?: boolean;
  onClick?: () => void;
}

export const MuseMascot: React.FC<MuseMascotProps> = ({
  state,
  statusMessage,
  enforceabilityScore = 96,
  isVoiceActive = false,
  onToggleVoice,
  compact = false,
  placement = 'center',
  isOpen = false,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-play video strictly muted in a seamless loop with zero audio
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [state]);

  // Click handler: strictly triggers UI action without un-muting sound
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    } else if (onToggleVoice) {
      onToggleVoice();
    }
  };

  const getStateTheme = () => {
    switch (state) {
      case 'user-speaking':
        return {
          glow: 'rgba(239, 68, 68, 0.55)',
          border: 'border-red-500',
          shadow: 'shadow-red-500/50',
          ring: 'border-red-400',
          badgeBg: 'bg-red-950/90 border-red-500/60 text-red-200',
          icon: <Mic className="w-3.5 h-3.5 text-red-400 animate-pulse" />,
          title: '🎙️ User Speaking...',
          badgeText: 'LIVE AUDIO',
        };
      case 'processing':
        return {
          glow: 'rgba(56, 189, 248, 0.55)',
          border: 'border-cyan-400',
          shadow: 'shadow-cyan-400/50',
          ring: 'border-cyan-400',
          badgeBg: 'bg-cyan-950/90 border-cyan-500/60 text-cyan-200',
          icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />,
          title: '🧠 Gemini Live Processing...',
          badgeText: 'GEMINI 3.5',
        };
      case 'agent-speaking':
        return {
          glow: 'rgba(0, 130, 251, 0.85)',
          border: 'border-[#0082fb]',
          shadow: 'shadow-[0_0_35px_rgba(0,130,251,0.7)]',
          ring: 'border-blue-400',
          badgeBg: 'bg-blue-950/90 border-blue-500/60 text-blue-200',
          icon: <Volume2 className="w-3.5 h-3.5 text-blue-400 animate-bounce" />,
          title: '🔊 Pact Agent Speaking...',
          badgeText: 'STREAMING',
        };
      case 'tampered':
        return {
          glow: 'rgba(239, 68, 68, 0.45)',
          border: 'border-red-500',
          shadow: 'shadow-red-500/30',
          ring: 'border-red-400',
          badgeBg: 'bg-red-950/90 border-red-500/60 text-red-200',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-red-400" />,
          title: 'Tamper Detected // Hash Mismatch',
          badgeText: '0% VALID',
        };
      case 'analyzing':
        return {
          glow: 'rgba(56, 189, 248, 0.45)',
          border: 'border-cyan-400',
          shadow: 'shadow-cyan-400/30',
          ring: 'border-cyan-400',
          badgeBg: 'bg-cyan-950/90 border-cyan-500/60 text-cyan-200',
          icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />,
          title: 'Extracting Section 10 Pillars...',
          badgeText: `${enforceabilityScore}% ENFORCEABLE`,
        };
      case 'locked':
        return {
          glow: 'rgba(16, 185, 129, 0.4)',
          border: 'border-emerald-500',
          shadow: 'shadow-emerald-500/30',
          ring: 'border-emerald-400',
          badgeBg: 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200',
          icon: <Lock className="w-3.5 h-3.5 text-emerald-400" />,
          title: 'Evidence Locked (BSA §63(4))',
          badgeText: `${enforceabilityScore}% ENFORCEABLE`,
        };
      case 'listening':
        return {
          glow: 'linear-gradient(135deg, rgba(64,122,221,0.85) 0%, rgba(16,185,129,0.85) 100%)',
          border: 'border-[#10B981]',
          shadow: 'shadow-[0_0_35px_rgba(64,122,221,0.7)]',
          ring: 'border-[#407ADD]',
          badgeBg: 'bg-emerald-950/90 border-emerald-500/70 text-emerald-200',
          icon: <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />,
          title: '🎙️ "Hey Pact" Voice Listening...',
          badgeText: 'SARVAM STT ACTIVE',
        };
      default:
        return {
          glow: 'rgba(0, 130, 251, 0.35)',
          border: 'border-[#0082fb]',
          shadow: 'shadow-[#0082fb]/30',
          ring: 'border-blue-400',
          badgeBg: 'bg-slate-900/95 border-brand-border text-slate-200',
          icon: isVoiceActive ? <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <Shield className="w-3.5 h-3.5 text-industrial-400" />,
          title: isVoiceActive ? 'Pact is listening to voice note...' : 'Pact Agent is listening...',
          badgeText: `${enforceabilityScore}% ENFORCEABLE`,
        };
    }
  };

  const theme = getStateTheme();

  // ============================================================
  // PLACEMENT: Floating Dock Bubble (Widget trigger at bottom-right)
  // ============================================================
  if (placement === 'dock-bubble') {
    return (
      <div 
        className="relative group select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hover Tooltip / Status Bubble */}
        <div className={`absolute bottom-full right-0 mb-3 pointer-events-none transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <div className="bg-slate-900/95 border border-slate-700/80 text-white px-3 py-1.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center space-x-2 whitespace-nowrap">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                state === 'tampered' ? 'bg-red-400' : 'bg-emerald-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                state === 'tampered' ? 'bg-red-500' : 'bg-emerald-500'
              }`} />
            </span>
            <span className="text-xs font-semibold">{isOpen ? 'Minimize Pact Assistant' : 'Open Pact Assistant'}</span>
            <span className="text-[10px] text-slate-400 font-mono pl-1 border-l border-slate-700">
              {theme.badgeText}
            </span>
          </div>
        </div>

        {/* Ambient Glow Aura */}
        <div
          className="absolute inset-0 rounded-full blur-xl transition-all duration-700 pointer-events-none opacity-85"
          style={{ background: theme.glow }}
        />

        {/* Glowing #407ADD to #10B981 Pulse Ring for "Hey Pact" Voice Capture */}
        {(state === 'listening' || isVoiceActive) && (
          <>
            <span 
              className="absolute -inset-3.5 rounded-full bg-gradient-to-r from-[#407ADD] to-[#10B981] animate-ping opacity-75 pointer-events-none blur-sm" 
            />
            <span 
              className="absolute -inset-2.5 rounded-full border-2 border-emerald-400 animate-pulse opacity-95 pointer-events-none shadow-[0_0_25px_#10B981]" 
            />
          </>
        )}

        {/* Pulsing Active Ring */}
        <span 
          className={`absolute -inset-2 rounded-full border-2 ${theme.ring} animate-ping opacity-60 pointer-events-none`} 
        />
        {state === 'agent-speaking' && (
          <span 
            className="absolute -inset-3.5 rounded-full border-2 border-blue-400 animate-pulse opacity-90 pointer-events-none shadow-[0_0_20px_#0082fb]" 
          />
        )}

        {/* Orbit Rotating Tech Ring */}
        <div
          className={`absolute -inset-1 rounded-full border border-dashed ${
            state === 'tampered' ? 'border-red-500/50' : state === 'agent-speaking' ? 'border-blue-400' : 'border-blue-400/50'
          } animate-[spin_14s_linear_infinite] opacity-75 pointer-events-none`}
        />

        {/* Main Circular Video Mascot Widget */}
        <div
          onClick={handleClick}
          role="button"
          tabIndex={0}
          aria-label="Toggle Pact Assistant Chat"
          title="Toggle Pact Assistant Chat"
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden relative border-2 ${theme.border} shadow-[0_10px_35px_rgba(0,0,0,0.6)] ${theme.shadow} ${
            state === 'agent-speaking' ? 'ring-4 ring-blue-400 shadow-[0_0_35px_rgba(0,130,251,0.85)] animate-pulse' : ''
          } bg-white cursor-pointer transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center`}
        >
          {/* ONLY the HTML5 Video Tag — No SVG fallback */}
          <video
            ref={videoRef}
            src="/pact-mascot.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-110 bg-white"
          />

          {/* Close indicator overlay if open */}
          {isOpen && (
            <div className="absolute inset-0 bg-blue-950/70 backdrop-blur-[1px] flex items-center justify-center text-white transition-opacity">
              <X className="w-6 h-6 text-white" />
            </div>
          )}

          {/* Subtle inner border */}
          <div className="absolute inset-0 rounded-full pointer-events-none ring-1 ring-inset ring-black/10" />
        </div>

        {/* Mini Status Floating Indicator Badge */}
        <div className="absolute -bottom-1 -right-1 z-20 w-6 h-6 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center shadow-lg">
          {isOpen ? <X className="w-3.5 h-3.5 text-slate-300" /> : theme.icon}
        </div>
      </div>
    );
  }

  // ============================================================
  // PLACEMENT: Header-Right Variant
  // ============================================================
  if (placement === 'header-right') {
    return (
      <div className="relative flex items-center space-x-2 select-none">
        <div
          onClick={handleClick}
          role="button"
          tabIndex={0}
          title="Pact Companion Mascot"
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden relative border-2 ${theme.border} shadow-lg ${theme.shadow} ${
            state === 'agent-speaking' ? 'ring-4 ring-blue-400 shadow-[0_0_25px_rgba(0,130,251,0.85)] animate-pulse' : ''
          } bg-white cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center`}
        >
          {(isVoiceActive || state === 'analyzing' || state === 'user-speaking' || state === 'processing' || state === 'agent-speaking') && (
            <span className={`absolute -inset-1 rounded-full border-2 ${theme.ring} animate-ping opacity-75 pointer-events-none`} />
          )}

          <video
            ref={videoRef}
            src="/pact-mascot.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-110 bg-white"
          />

          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center">
            <span className={`w-1.5 h-1.5 rounded-full ${
              state === 'tampered' ? 'bg-red-500' : state === 'user-speaking' ? 'bg-red-500' : state === 'agent-speaking' ? 'bg-blue-400' : state === 'processing' || state === 'analyzing' ? 'bg-cyan-400' : 'bg-emerald-400'
            }`} />
          </span>
        </div>
      </div>
    );
  }

  // ============================================================
  // PLACEMENT: Center Hero / Drawer Header Variant (Default)
  // ============================================================
  return (
    <div className={`flex flex-col items-center justify-center text-center relative select-none ${compact ? 'py-1' : 'py-2'}`}>
      
      {/* 3D Animated Character Frame */}
      <div 
        className="relative flex items-center justify-center mb-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Ambient Glow Aura */}
        <div
          className="absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none opacity-80"
          style={{ background: theme.glow }}
        />

        {/* Dynamic Pulsing Ring */}
        {(isVoiceActive || state === 'analyzing' || state === 'user-speaking' || state === 'processing' || state === 'agent-speaking') && (
          <>
            <span 
              className={`absolute -inset-3 sm:-inset-4 rounded-full border-2 ${theme.ring} animate-ping opacity-75 pointer-events-none`} 
            />
            {state === 'agent-speaking' && (
              <span 
                className="absolute -inset-5 sm:-inset-6 rounded-full border-2 border-blue-400 animate-pulse opacity-90 pointer-events-none shadow-[0_0_25px_#0082fb]" 
              />
            )}
          </>
        )}

        {/* Orbit Rotating Tech Ring */}
        <div
          className={`absolute -inset-1.5 sm:-inset-2 rounded-full border border-dashed ${
            state === 'tampered' ? 'border-red-500/40' : state === 'agent-speaking' ? 'border-blue-400' : 'border-blue-400/40'
          } animate-[spin_16s_linear_infinite] opacity-60 pointer-events-none`}
        />

        {/* Circular Frame Cropping Container */}
        <div
          onClick={handleClick}
          role="button"
          tabIndex={0}
          title="Pact Companion Mascot"
          className={`${
            compact ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-24 h-24 sm:w-28 sm:h-28'
          } rounded-full overflow-hidden relative border-2 ${theme.border} shadow-xl ${theme.shadow} ${
            state === 'agent-speaking' ? 'ring-4 ring-blue-400 shadow-[0_0_35px_rgba(0,130,251,0.85)] animate-pulse' : ''
          } bg-white cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center`}
        >
          {/* ONLY the HTML5 Video Tag — No SVG fallback */}
          <video
            ref={videoRef}
            src="/pact-mascot.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-110 bg-white"
          />

          <div className="absolute inset-0 rounded-full pointer-events-none ring-1 ring-inset ring-black/10" />
        </div>

        {/* Mini Status Floating Orb Badge */}
        <div className="absolute -bottom-1 -right-1 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-950 border border-slate-700/80 flex items-center justify-center shadow-lg">
          {theme.icon}
        </div>
      </div>

      {/* Floating Meta Muse Agent Status Capsule */}
      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border shadow-subtle backdrop-blur-md transition-all duration-300 ${theme.badgeBg}`}>
        <span className="flex h-2 w-2 relative">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            state === 'tampered' ? 'bg-red-400' : state === 'user-speaking' ? 'bg-red-400' : state === 'agent-speaking' ? 'bg-blue-400' : state === 'processing' || state === 'analyzing' ? 'bg-cyan-400' : 'bg-emerald-400'
          }`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
            state === 'tampered' ? 'bg-red-500' : state === 'user-speaking' ? 'bg-red-500' : state === 'agent-speaking' ? 'bg-blue-400' : state === 'processing' || state === 'analyzing' ? 'bg-cyan-400' : 'bg-emerald-500'
          }`} />
        </span>
        <span className="font-semibold text-[11px] sm:text-xs">{statusMessage || theme.title}</span>
        <span className="text-slate-400 font-mono text-[9px] sm:text-[10px] pl-1 border-l border-white/15">
          {theme.badgeText}
        </span>
      </div>

    </div>
  );
};
