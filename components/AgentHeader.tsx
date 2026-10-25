'use client';

import React from 'react';
import { Shield, Sparkles, Smartphone, CheckCircle, AlertTriangle, FileText, Award } from 'lucide-react';
import { LanguageCode } from '@/lib/translations';
import { LanguageSelector } from './LanguageSelector';

interface AgentHeaderProps {
  isTampered: boolean;
  currentHash: string;
  ambiguityCount: number;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenStampPaper?: () => void;
  onInstallClick?: () => void;
  canInstall?: boolean;
}

export const AgentHeader: React.FC<AgentHeaderProps> = ({
  isTampered,
  currentHash,
  ambiguityCount,
  currentLanguage,
  onLanguageChange,
  onOpenStampPaper,
  onInstallClick,
  canInstall,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/90 border-b border-brand-border/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand & Theme Title */}
          <div className="flex items-center space-x-3">
            <div className="relative w-9 h-9 rounded-full border-2 border-blue-500/30 overflow-hidden bg-white shadow-md shrink-0">
              <img 
                src="/pact-badge.png" 
                alt="Pact Mascot Logo" 
                className="w-full h-full object-cover scale-[1.3] translate-y-[2px]" 
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isTampered ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isTampered ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                  PACT<span className="text-industrial-400">.</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-industrial-950/80 text-industrial-300 border border-industrial-500/30">
                  LS-06 Handshake to Contract
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Indian Contract Act 1872 (§10) • Bharatiya Sakshya Adhiniyam 2023 (§63(4))
              </p>
            </div>
          </div>

          {/* Floating Muse Agent Status HUD */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Multi-Language Selector */}
            <div className="hidden sm:block">
              <LanguageSelector
                currentLanguage={currentLanguage}
                onLanguageChange={onLanguageChange}
              />
            </div>

            {/* Official Judicial Stamp Paper Trigger Button */}
            {onOpenStampPaper && (
              <button
                onClick={onOpenStampPaper}
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all shadow-subtle active:scale-95"
                title="View Official Government e-Stamp Paper Affidavit"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>e-Stamp Paper</span>
              </button>
            )}

            {/* Live Tamper / Integrity Badge */}
            <div className={`hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-300 ${
              isTampered 
                ? 'bg-red-950/40 border-red-500/50 text-red-300 shadow-glow-red animate-pulse' 
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-glow-emerald'
            }`}>
              {isTampered ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span className="font-semibold">TAMPER DETECTED // HASH INVALID</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold">IMMUTABLE EVIDENCE LOCK // SHA-256</span>
                </>
              )}
            </div>

            {/* Ambiguity Radar Pill */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-surface border border-brand-border text-xs">
              <span className="text-slate-400 hidden xs:inline">Flags:</span>
              <span className={`px-1.5 py-0.2 rounded font-bold font-mono text-[11px] ${
                ambiguityCount > 0 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {ambiguityCount > 0 ? `${ambiguityCount}` : '0'}
              </span>
            </div>

            {/* PWA Mobile Install Action */}
            <button
              onClick={onInstallClick}
              className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-industrial-600 to-industrial-500 hover:from-industrial-500 hover:to-industrial-400 text-white font-medium text-xs shadow-subtle hover:shadow-glow transition-all active:scale-95 border border-industrial-300/30"
              title="Install native PWA app on your Android/iOS/Desktop device"
            >
              <Smartphone className="w-3.5 h-3.5 text-industrial-100" />
              <span className="hidden xs:inline">Install</span>
            </button>

          </div>

        </div>

        {/* Mobile secondary strip with Language Selector + live status */}
        <div className="flex sm:hidden items-center justify-between py-1.5 border-t border-brand-border/40 text-[10px] font-mono text-slate-400">
          <div className="flex items-center space-x-1.5">
            <span className={`inline-block w-2 h-2 rounded-full ${isTampered ? 'bg-red-500' : 'bg-emerald-400'}`}></span>
            <span>{isTampered ? 'EVIDENCE CORRUPTED' : 'EVIDENCE LOCKED (BSA 2023)'}</span>
          </div>
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
          />
        </div>
      </div>
    </header>
  );
};
