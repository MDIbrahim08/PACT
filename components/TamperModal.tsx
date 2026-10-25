'use client';

import React from 'react';
import { X, Gavel, RotateCcw } from 'lucide-react';
import { TamperSimulator } from './TamperSimulator';

interface TamperModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  currentText: string;
  originalHash: string;
  currentHash: string;
  isTampered: boolean;
  onModifyText: (newText: string) => void;
  onRestoreOriginal: () => void;
}

export const TamperModal: React.FC<TamperModalProps> = ({
  isOpen,
  onClose,
  originalText,
  currentText,
  originalHash,
  currentHash,
  isTampered,
  onModifyText,
  onRestoreOriginal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-brand-border rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Topbar */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-brand-border flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className={`p-1.5 rounded-lg border ${
              isTampered 
                ? 'bg-red-950 text-red-400 border-red-500/40' 
                : 'bg-industrial-950 text-industrial-400 border-industrial-500/40'
            }`}>
              <Gavel className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Judge Tamper-Simulation Sandbox
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                  isTampered 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {isTampered ? 'Tamper Detected' : 'Cryptographic Integrity'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Test editing WhatsApp messages and observe instant cryptographic SHA-256 failure
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/80">
          <TamperSimulator
            originalText={originalText}
            currentText={currentText}
            originalHash={originalHash}
            currentHash={currentHash}
            isTampered={isTampered}
            onModifyText={onModifyText}
            onRestoreOriginal={onRestoreOriginal}
          />
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-brand-border flex items-center justify-between text-xs text-slate-400">
          <span>Arjun Panditrao Khotkar (2020) • BSA 2023 §63(4)</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            Close Sandbox
          </button>
        </div>

      </div>
    </div>
  );
};
