'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Bot,
  Download,
  FileText,
  Gavel,
  Cpu,
  Shield,
  Play,
  BookOpen,
  Send,
  ExternalLink,
  CheckCircle2,
  Lock,
  Sparkles,
  ChevronRight,
  Award,
  Laptop
} from 'lucide-react';

export interface FeaturesHamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacy: () => void;
  onOpenPrint: () => void;
  onOpenCertificate: () => void;
  onOpenJudge: () => void;
  onOpenClient: () => void;
  onOpenAgent: () => void;
  onOpenCompatibility: () => void;
  isBotDownloaded?: boolean;
}

export function FeaturesHamburgerMenu({
  isOpen,
  onClose,
  onOpenPrivacy,
  onOpenPrint,
  onOpenCertificate,
  onOpenJudge,
  onOpenClient,
  onOpenAgent,
  onOpenCompatibility,
  isBotDownloaded = false,
}: FeaturesHamburgerMenuProps) {
  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when hamburger drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const scrollToSection = (sectionId: string) => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative z-50 w-full max-w-md h-full bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/70 dark:bg-neutral-900/50 backdrop-blur-md shrink-0">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 rounded-full border border-neutral-300 dark:border-neutral-700 overflow-hidden bg-white shadow-sm flex items-center justify-center shrink-0">
                  <img
                    src="/pact-badge.png"
                    alt="Pact Logo"
                    className="w-full h-full object-cover scale-[1.3] translate-y-[2px]"
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-bold text-neutral-900 dark:text-white text-base">Pact Features</h2>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black">
                      v2.4
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-medium">MSME Legal & Compliance Hub</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center transition-all cursor-pointer border border-neutral-300 dark:border-neutral-700 active:scale-95"
                aria-label="Close Features Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Features Content */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 scrollbar-thin">
              
              {/* SECTION 1: Core AI & Legal Architecture */}
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3 flex items-center justify-between">
                  <span>Core Legal Architecture</span>
                  <span className="text-[10px] font-normal text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded">
                    Active System
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {/* Launch Agent */}
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAgent();
                    }}
                    className="w-full p-3.5 rounded-xl bg-neutral-900 hover:bg-black text-white transition-all flex items-center justify-between text-left shadow-sm group active:scale-[0.99] cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-700">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>Launch Live Legal Agent</span>
                          <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                            AI Auditor
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400">Interact with real-time Indian legal AI</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Download Standalone Client */}
                  <button
                    onClick={() => {
                      onClose();
                      onOpenClient();
                    }}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all flex items-center justify-between text-left group active:scale-[0.99] cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 flex items-center justify-center shrink-0">
                        <Download className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                          <span>{isBotDownloaded ? 'Open Standalone Client' : 'Download Standalone Client'}</span>
                          {isBotDownloaded ? (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
                              Active & Ready
                            </span>
                          ) : (
                            <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-mono">
                              Desktop / Mobile
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500">Native Windows, macOS, iOS & Android standalone client</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Judicial e-Stamp Paper */}
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPrint();
                    }}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all flex items-center justify-between text-left group active:scale-[0.99] cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                          Judicial e-Stamp Paper
                        </div>
                        <p className="text-[11px] text-neutral-500">Non-Judicial Article 10 digital e-stamp specimen</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* BSA 2023 §63(4) Evidence Certificate */}
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCertificate();
                    }}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all flex items-center justify-between text-left group active:scale-[0.99] cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 flex items-center justify-center shrink-0">
                        <Gavel className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                          BSA §63(4) Evidence Format
                        </div>
                        <p className="text-[11px] text-neutral-500">SHA-256 tamper-sealed court evidence format</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* System Architecture Deep Dive */}
                  <button
                    onClick={() => {
                      onClose();
                      onOpenJudge();
                    }}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all flex items-center justify-between text-left group active:scale-[0.99] cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 flex items-center justify-center shrink-0">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                          System Architecture Deep Dive
                        </div>
                        <p className="text-[11px] text-neutral-500">4-model cascade, CAD blueprints & tech stack</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Device & OS Compatibility Matrix */}
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCompatibility();
                    }}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all flex items-center justify-between text-left group active:scale-[0.99] cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                        <Laptop className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                          <span>Device & OS Compatibility Standard</span>
                          <span className="text-[9px] bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 px-1.5 py-0.2 rounded font-mono">
                            SPEC-2024
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500">Android, iOS, Windows, macOS & Tablet specs</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Zero-Storage Privacy Charter */}
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPrivacy();
                    }}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all flex items-center justify-between text-left group active:scale-[0.99] cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                          Security & Privacy Charter
                        </div>
                        <p className="text-[11px] text-neutral-500">Zero-storage ephemeral protocol & DPDP Act 2023</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* SECTION 2: Page Sections Navigation */}
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
                  Jump to Section
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => scrollToSection('registration-form')}
                    className="w-full p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 transition-all flex items-center space-x-3 text-left group cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-neutral-500 group-hover:text-black dark:group-hover:text-white" />
                    <div>
                      <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        Agreement Generator
                      </div>
                      <p className="text-[10px] text-neutral-500">Input WhatsApp chat or voice transcript</p>
                    </div>
                  </button>

                  <button
                    onClick={() => scrollToSection('walkthrough-video')}
                    className="w-full p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 transition-all flex items-center space-x-3 text-left group cursor-pointer"
                  >
                    <Play className="w-4 h-4 text-neutral-500 group-hover:text-black dark:group-hover:text-white" />
                    <div>
                      <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        Deal Walkthrough Video
                      </div>
                      <p className="text-[10px] text-neutral-500">60-second animated contract breakdown</p>
                    </div>
                  </button>

                  <button
                    onClick={() => scrollToSection('bookshelf-section')}
                    className="w-full p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 transition-all flex items-center space-x-3 text-left group cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-neutral-500 group-hover:text-black dark:group-hover:text-white" />
                    <div>
                      <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        3D MSME Legal Library
                      </div>
                      <p className="text-[10px] text-neutral-500">8 hand-bound 3D Indian law volumes</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* SECTION 3: Official Statutory MSME Portals */}
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
                  Government Portals & Legal Redressal
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <a
                    href="https://samadhaan.msme.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-800 dark:text-neutral-200 transition-all group"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                        <span>MSME Samadhaan Portal</span>
                        <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                      </div>
                      <p className="text-[10px] text-neutral-500">Delayed payment recovery & MSEFC arbitration</p>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">gov.in</span>
                  </a>

                  <a
                    href="https://www.mca.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-800 dark:text-neutral-200 transition-all group"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                        <span>MCA21 Registry</span>
                        <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                      </div>
                      <p className="text-[10px] text-neutral-500">Ministry of Corporate Affairs company master data</p>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">gov.in</span>
                  </a>

                  <a
                    href="https://services.ecourts.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-800 dark:text-neutral-200 transition-all group"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                        <span>e-Courts Services Portal</span>
                        <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                      </div>
                      <p className="text-[10px] text-neutral-500">National Judicial Data Grid & commercial court filing</p>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">gov.in</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Footer Status Bar */}
            <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-900/80 backdrop-blur-md shrink-0">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-3">
                <div className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Zero-Storage Active</span>
                </div>
                <div>BSA §63 Verified</div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenClient();
                }}
                className="w-full py-2.5 rounded-xl bg-black hover:bg-neutral-900 text-white font-medium text-xs transition-all shadow-md active:scale-95 flex items-center justify-center space-x-2 border border-black cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isBotDownloaded ? 'Open Standalone Client' : 'Download Pact Client'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default FeaturesHamburgerMenu;
