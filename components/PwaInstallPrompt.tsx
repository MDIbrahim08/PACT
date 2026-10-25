'use client';

import React, { useEffect, useState } from 'react';
import { Smartphone, Download, X, Wifi } from 'lucide-react';
import { TiltCard } from '@/components/ui/be-ui-tilt-card';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PwaCardProps {
  onDismiss?: () => void;
  showDismiss?: boolean;
  className?: string;
}

export const PwaInstallCardContent: React.FC<PwaCardProps> = ({
  onDismiss,
  showDismiss = false,
  className,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert(
        'To install Pact on your device:\n\n• On Android/Chrome: Tap the three dots (⋮) in the top-right and select "Install app" or "Add to Home Screen".\n• On Windows/Laptop: Click the install icon in the browser address bar.\n• On iOS/Safari: Tap Share (square with up arrow) and select "Add to Home Screen".'
      );
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <TiltCard
      max={12}
      glare={true}
      className={`relative overflow-hidden rounded-[20px] p-3.5 sm:p-4 max-w-[340px] w-full bg-neutral-900/85 dark:bg-black/90 backdrop-blur-2xl border border-neutral-700/80 dark:border-white/20 shadow-[0_16px_40px_rgba(0,0,0,0.35)] text-white select-none transition-all duration-300 ${className || ''}`}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center space-x-2.5">
          {/* Dark Frosted Icon Squircle */}
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0 shadow-inner">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white leading-tight tracking-tight">
              Install Pact on Mobile
            </h4>
            <p className="text-[10.5px] sm:text-[11px] text-neutral-300 mt-0.5 leading-snug font-sans">
              Instant access from your home screen with offline evidence hashing in godowns.
            </p>
          </div>
        </div>

        {showDismiss && onDismiss && (
          <button
            onClick={onDismiss}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-neutral-700/60 dark:border-white/10 text-xs">
        <div className="flex items-center space-x-1.5 text-neutral-300 text-[10.5px] font-mono">
          <Wifi className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>PWA Standalone Mode</span>
        </div>

        {/* Clean Frosted Dark Button */}
        <button
          onClick={handleInstallClick}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white border border-white/20 text-[11px] font-semibold transition-all active:scale-95 shadow-xs"
        >
          <Download className="w-3 h-3 text-white" />
          <span>{isInstalled ? 'Installed' : 'Download to Device'}</span>
        </button>
      </div>
    </TiltCard>
  );
};

export const PwaInstallPrompt: React.FC = () => {
  // Only rendered at the end of the page when scrolled to bottom, not as floating card
  return null;
};

export default PwaInstallPrompt;
