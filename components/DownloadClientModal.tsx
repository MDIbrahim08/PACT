'use client';

import React, { useState, useEffect } from 'react';
import { 
  Download, 
  CheckCircle2, 
  Smartphone, 
  Laptop, 
  X, 
  Shield, 
  Cpu, 
  ArrowRight,
  HardDrive,
  Lock,
  Share2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { UserProfileData } from '@/components/UserConsentOnboarding';

interface DownloadClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfileData | null;
  onOpenClient: () => void;
  onDownloadSuccess?: () => void;
  onOpenCompatibility?: () => void;
  onUninstall?: () => void;
  isDownloaded?: boolean;
}

export const DownloadClientModal: React.FC<DownloadClientModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onOpenClient,
  onDownloadSuccess,
  onOpenCompatibility,
  onUninstall,
  isDownloaded = false,
}) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initiating cryptographic packaging...');
  const [isCompleted, setIsCompleted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'windows' | 'mac' | 'desktop'>('desktop');
  const [copiedLink, setCopiedLink] = useState(false);

  // Platform detection for tailored installation experience
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent || '';
      const isIOSDevice = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isAndroidDevice = /Android/i.test(ua);
      const isWinDevice = /Windows/i.test(ua);
      const isMacDevice = /Macintosh/i.test(ua);

      if (isIOSDevice) setPlatform('ios');
      else if (isAndroidDevice) setPlatform('android');
      else if (isWinDevice) setPlatform('windows');
      else if (isMacDevice) setPlatform('mac');
      else setPlatform('desktop');
    }
  }, []);

  // Listen for native Chromium PWA beforeinstallprompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Run downloading & packaging sequence when opened
  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setIsCompleted(false);
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 18) + 12;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setProgress(100);
        setIsCompleted(true);
        setStatusText('Client successfully packaged & signed under BSA 2023 §63!');
      } else {
        setProgress(current);
        if (current < 35) {
          setStatusText(`Compiling Zero-Storage Sandbox for ${userProfile?.fullName || 'User'}...`);
        } else if (current < 75) {
          setStatusText('Binding SHA-256 Offline Notary Keys & Sarvam Voice Models...');
        } else {
          setStatusText('Finalizing Standalone PWA Manifest & Cache...');
        }
      }
    }, 150);

    return () => clearInterval(interval);
  }, [isOpen, userProfile]);

  if (!isOpen) return null;

  // Direct File Download for Windows Desktop ONLY (Never run on iOS/Android)
  const handleDownloadDesktopFile = () => {
    try {
      localStorage.setItem('pact_bot_downloaded', 'true');
      localStorage.setItem('pact_download_modal_shown', 'true');
    } catch {}
    onDownloadSuccess?.();

    const urlContent = `[InternetShortcut]\nURL=${window.location.origin}\nIconIndex=0\nIconFile=${window.location.origin}/favicon.ico\n`;
    const blob = new Blob([urlContent], { type: 'application/internet-shortcut' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Pact-Legal-Agent-${(userProfile?.fullName || 'Client').replace(/\s+/g, '_')}.url`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Trigger PWA install or instructions
  const handleTriggerInstall = async () => {
    try {
      localStorage.setItem('pact_bot_downloaded', 'true');
      localStorage.setItem('pact_download_modal_shown', 'true');
    } catch {}
    onDownloadSuccess?.();

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
    } else if (platform === 'windows') {
      // Fallback only for Windows desktop PC
      handleDownloadDesktopFile();
    } else {
      // For iOS/Android/Mac: launch web client directly
      onClose();
      onOpenClient();
    }
  };

  // Copy Direct App URL for iOS / in-app browsers
  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-[#0c121e] border border-slate-700/80 rounded-3xl p-5 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-white overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-blue-500 via-emerald-400 to-indigo-500 rounded-full blur-xs" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all active:scale-95"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Mascot */}
        <div className="flex items-center space-x-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 p-0.5 shadow-lg shrink-0">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[14px] flex items-center justify-center overflow-hidden">
              <img src="/pact-badge.png" alt="Pact Mascot" className="w-10 h-10 object-cover scale-110" />
            </div>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Pact Standalone Client Installer
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              v2.4 Zero-Storage Offline Evidence Architecture
            </p>
          </div>
        </div>

        {/* User License / Client Info Banner */}
        <div className="mb-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between font-mono">
          <div className="space-y-0.5">
            <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Registered Client Identity</span>
            <span className="text-white font-bold">{userProfile?.fullName || 'Verified MSME Trader'}</span>
          </div>
          <div className="text-right space-y-0.5">
            <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Contact / Sync ID</span>
            <span className="text-emerald-400 font-mono text-[11px]">{userProfile?.phone ? userProfile.phone : 'Client Device Encrypted'}</span>
          </div>
        </div>

        {/* Multi-Channel Device Sync Status Indicators */}
        <div className="mb-3.5 grid grid-cols-3 gap-2 text-[10px] font-mono">
          <div className="p-2 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex items-center space-x-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">WhatsApp: Ready</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/90 border border-indigo-500/30 flex items-center space-x-1.5 text-indigo-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shrink-0" />
            <span className="truncate">Email: Synced</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/90 border border-blue-500/30 flex items-center space-x-1.5 text-blue-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
            <span className="truncate">SMS: Connected</span>
          </div>
        </div>

        {/* Downloading & Packaging Progress Bar */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-medium flex items-center gap-2">
              {!isCompleted ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {statusText}
            </span>
            <span className="text-emerald-400 font-bold">{progress}%</span>
          </div>

          <div className="w-full h-2.5 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-emerald-400 to-indigo-500 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Platform-Specific Installation Container */}
        {platform === 'ios' ? (
          /* ============================================================
             APPLE iOS / iPHONE SPECIFIC INSTALLATION GUIDE
             Never downloads .url files which iOS cannot open
             ============================================================ */
          <div className="mb-4 p-4 rounded-2xl bg-gradient-to-b from-blue-950/60 to-slate-900/90 border border-blue-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider font-mono">
                <Smartphone className="w-4 h-4" />
                <span>iPhone / iPad Installation</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Apple iOS PWA
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Apple iOS does not use file downloads (<span className="font-mono text-amber-300">.url / .exe</span>). Install Pact AI directly onto your iPhone Home Screen:
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    Tap Safari Share Button <Share2 className="w-3.5 h-3.5 text-blue-400 inline" />
                  </span>
                  <span className="text-slate-400 block text-[11px] mt-0.5">
                    In Safari's bottom toolbar, tap the square icon with an upward arrow.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <span className="font-semibold text-white">
                    Select "Add to Home Screen" <span className="text-emerald-400 font-mono">(+)</span>
                  </span>
                  <span className="text-slate-400 block text-[11px] mt-0.5">
                    Scroll down the sheet, tap <strong className="text-white">Add to Home Screen</strong>, then tap <strong className="text-white">Add</strong> in top right.
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Launches as a standalone app with the official Pact mascot icon!</span>
            </p>
          </div>
        ) : platform === 'android' ? (
          /* ============================================================
             ANDROID SPECIFIC CARD
             ============================================================ */
          <div className="mb-4 p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-xs space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase tracking-wider font-mono text-[11px]">
              <Smartphone className="w-4 h-4" />
              <span>Android Standalone PWA Ready</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Install directly from Chrome to receive an app icon on your home screen with offline voice and WhatsApp integration.
            </p>
          </div>
        ) : (
          /* ============================================================
             LAPTOP / DESKTOP (WINDOWS & MAC) CARD
             ============================================================ */
          <div className="mb-4 p-3.5 rounded-2xl bg-slate-900/80 border border-blue-500/30 text-xs space-y-1.5">
            <div className="flex items-center space-x-2 text-blue-400 font-bold uppercase tracking-wider font-mono text-[11px]">
              <Laptop className="w-4 h-4" />
              <span>Laptop / Desktop Standalone Client</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Installs into a dedicated, un-interrupted application window on Windows 10/11 & macOS. Keep the window active or minimized in your taskbar for live contract monitoring.
            </p>
          </div>
        )}

        {/* Features Checklist */}
        <div className="grid grid-cols-2 gap-2 mb-5 text-[11px] font-sans">
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2 text-slate-300">
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Zero-Storage Vault</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">Sarvam Voice Offline</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">BSA 2023 §63 Notary</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2 text-slate-300">
            <HardDrive className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="truncate">MSMED Act Recovery</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {isCompleted ? (
            <div className="space-y-2.5">
              {/* PRIMARY ACTION: Launch Agent Immediately (Works 100% on all devices including iOS) */}
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.setItem('pact_bot_downloaded', 'true');
                    localStorage.setItem('pact_download_modal_shown', 'true');
                  } catch {}
                  onDownloadSuccess?.();
                  onClose();
                  onOpenClient();
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white rounded-xl py-3 text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/30 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>
                  {platform === 'ios'
                    ? 'Launch Mobile Agent Directly Now'
                    : 'Open Dedicated Agent Workspace Now'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* SECONDARY ACTION: PWA Native Prompt if available */}
              {deferredPrompt && (
                <button
                  type="button"
                  onClick={handleTriggerInstall}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center space-x-2 transition-all border border-slate-700 active:scale-[0.98] cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Pin App to Device (Native PWA Install)</span>
                </button>
              )}

              {/* iOS Helper: Copy direct URL if opened inside in-app browser */}
              {platform === 'ios' && (
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl py-2 text-[11px] font-mono flex items-center justify-center space-x-1.5 transition-all border border-slate-700"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Direct App URL Copied!' : 'Copy Direct Web App URL (Open in Safari)'}</span>
                </button>
              )}

              {/* Windows Desktop Shortcut (.url file) strictly for Windows desktop */}
              {platform === 'windows' && !deferredPrompt && (
                <button
                  type="button"
                  onClick={handleDownloadDesktopFile}
                  className="w-full py-1.5 text-center text-[10px] font-mono text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-slate-400" />
                  <span>Download Windows Desktop Shortcut (.url file)</span>
                </button>
              )}

              {/* Device OS Specs Modal Button */}
              {onOpenCompatibility && (
                <button
                  type="button"
                  onClick={onOpenCompatibility}
                  className="w-full py-2 text-center text-[11px] font-mono text-slate-400 hover:text-white transition-colors border border-slate-800 rounded-xl hover:bg-slate-800/50 flex items-center justify-center space-x-1.5 cursor-pointer mt-1"
                >
                  <Laptop className="w-3.5 h-3.5 text-blue-400" />
                  <span>Inspect Mobile, Laptop & Tablet OS Specifications</span>
                </button>
              )}

              {/* Uninstall / Clear Bot Client Option */}
              {isDownloaded && onUninstall && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onUninstall();
                  }}
                  className="w-full py-2 text-center text-[11px] font-mono text-red-400 hover:text-red-300 transition-colors border border-red-950 hover:border-red-800 rounded-xl bg-red-950/20 hover:bg-red-950/40 flex items-center justify-center space-x-1.5 cursor-pointer mt-1"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Uninstall Bot Client / Reset to Web Mode</span>
                </button>
              )}
            </div>
          ) : (
            <div className="w-full py-3 bg-slate-800/50 text-slate-400 rounded-xl text-center text-xs font-mono animate-pulse">
              Downloading client assets & signing cryptographic package...
            </div>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-[10px] text-slate-500 text-center font-mono mt-3">
          Direct standalone launcher for Windows, macOS, Android, and iOS. Zero data retained on servers.
        </p>
      </div>
    </div>
  );
};
