'use client';

import React, { useState } from 'react';
import { 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Smartphone, 
  Laptop, 
  X, 
  ShieldCheck, 
  RefreshCw,
  ArrowRight
} from 'lucide-react';

interface UninstallClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmUninstall: () => void;
  isStandaloneApp?: boolean;
}

export const UninstallClientModal: React.FC<UninstallClientModalProps> = ({
  isOpen,
  onClose,
  onConfirmUninstall,
  isStandaloneApp = false,
}) => {
  const [isUninstalled, setIsUninstalled] = useState(false);

  if (!isOpen) return null;

  const handleUninstall = () => {
    onConfirmUninstall();
    setIsUninstalled(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b1120] border border-red-500/40 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl animate-fadeIn text-slate-100 font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isUninstalled ? (
          <div>
            {/* Header Icon */}
            <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-400 flex items-center justify-center mb-4 shadow-lg shadow-red-950/40">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Uninstall Pact Legal Agent?</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Uninstalling resets the bot to clean web mode, releases local background wake locks, and clears offline voice cache from this device.
            </p>

            {/* Warning Pill */}
            <div className="my-4 p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>Zero Data Loss:</strong> Your cryptographic evidence certificates and legal documents remain valid under Indian Contract Act §10. You can reinstall the bot anytime with 1 tap.
              </div>
            </div>

            {/* Platform Instructions Guide */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 mb-5 text-[11px]">
              <span className="font-semibold text-slate-300 font-mono text-[10px] uppercase tracking-wider block">
                How to completely remove app icon:
              </span>
              <div className="space-y-1.5 text-slate-400">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span><strong>Android:</strong> Long-press "Pact" on Home Screen &rarr; Tap "Uninstall".</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span><strong>iPhone / iPad:</strong> Touch & hold icon &rarr; Tap "Delete Bookmark" / "Remove".</span>
                </div>
                <div className="flex items-center gap-2">
                  <Laptop className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span><strong>Laptop / PC:</strong> Click 3 dots in title bar &rarr; "Uninstall Pact Legal Agent".</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Keep Bot Installed
              </button>
              <button
                type="button"
                onClick={handleUninstall}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-red-950/50 transition-all active:scale-95 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Uninstall</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/40">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Bot Client Uninstalled</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Pact Legal Agent has been removed from this browser session. Background voice listening and offline locks have been deactivated.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Close & Return to Web
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
